import { Autocomplete, CircularProgress, TextField, useTheme } from '@mui/material';
import get from 'lodash/get';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import {
  DataType,
  EntityType,
  Entry,
  IInputFieldProps,
  MasterData,
  MasterDataCategory,
} from 'models';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { useModelConfig } from 'hooks';
import { formatMasterCode } from '_helpers';
import { getFieldState } from 'utils/formik-error-helper';
import { colors } from 'themes/colors';
import { layout } from 'themes/layout';
import { useTranslation } from 'react-i18next';

interface IMasterDataFieldProps extends IInputFieldProps {
  category: MasterDataCategory;
  filter?: (x: Entry | undefined) => boolean;
  findByKey?: boolean;
  group?: boolean;
  anonymous?: boolean;
}

export const SelectMasterData = ({
  type,
  hint,
  field,
  placeholder,
  required,
  disabled,
  category,
  label,
  formik,
  filter,
  group,
  onChange,
  disablePortal,
  findByKey,
  sticky,
  anonymous = false,
  size = 'medium',
}: IMasterDataFieldProps) => {
  const validKeyField = 'key';
  const validTextField = 'value';
  const theme = useTheme();
  const { masterDataDisplay } = useModelConfig();
  const { i18n } = useTranslation();
  const myLabel = label ?? masterDataDisplay[category];

  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Entry);
  const apiService = useApiService();
  const url = !anonymous
    ? `${appConfig.masterDataEndPoint}${config.apiNode}/${category}?`
    : `${appConfig.toolsEndPoint}/common/master/${category}`;

  const variables: any = {
    enablePagination: true,
    rows: 2000,
    start: 0,
    languageCode: i18n.language.toUpperCase(),
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [`${category}_combo`, anonymous],
    queryFn: () => apiService.getMasterData(url, variables, anonymous),
  });

  const mapDataContent = (content: Entry[]): Entry[] => {
    if (category === MasterData.EventType) {
      return content.map((item: Entry) => {
        const formatInput = formatMasterCode(item.key);
        const prefix = formatInput.substring(0, 4);
        let value = `${formatInput.substring(0, 3)} | ${item.value}`;
        if (prefix.startsWith('ARC-')) {
          value = `${formatInput.substring(0, 5)} | ${item.value}`;
        } else if (prefix.startsWith('ARC')) {
          const modified = `${formatInput.slice(0, 3)}-${formatInput[3]}`;
          value = `${modified.toUpperCase()} | ${item.value}`;
        }
        return {
          ...item,
          value,
          key: item.key,
        };
      });
    }
    return content;
  };

  const getDataArray = (data: any): Entry[] => {
    let filteredData = anonymous ? data : (data?.content ?? []);

    if (filter) {
      filteredData = filteredData.filter(filter);
    }

    const mappedData = mapDataContent(filteredData)
      .map((item: Entry) => {
        const firstChar = item.value?.[0]?.toUpperCase() ?? '';
        return {
          ...item,
          firstLetter: /[0-9]/.test(firstChar) ? '0-9' : firstChar,
        };
      })
      .sort((a, b) => a.value.localeCompare(b.value)); // sort by value

    return mappedData;
  };

  const controlData = isLoading || error ? { data: [] } : { data: getDataArray(data) };
  const { values, errors, touched, handleBlur } = formik;
  const { error: formikError, helperText } = getFieldState(field, touched, errors, hint);

  const currentValue = useMemo(() => {
    if (findByKey) {
      if (type === DataType.MultiSelect) {
        const foundValues = controlData.data.filter((x: any) => {
          const selectedValues = get(values, field); // Get the selected values array
          return selectedValues?.includes(get(x, validKeyField)); // Check if current value exists in the selected values
        });

        return foundValues?.length ? foundValues : [];
      }
      const foundValue = controlData.data?.find(
        (x: any) => get(x, validKeyField) === get(values, field)
      );

      return foundValue ?? null;
    }

    return get(values, field);
  }, [controlData, findByKey, values, validKeyField, field, type]);

  if (sticky)
    return (
      <TextField
        fullWidth
        required={required}
        disabled={true}
        margin="dense"
        id={field}
        name={field}
        label={myLabel}
        aria-label={myLabel}
        value={get(formik.values[field], validTextField, '')}
      />
    );

  return (
    <Autocomplete
      id={field}
      fullWidth
      loading={isLoading}
      disabled={disabled}
      size={size}
      disablePortal={disablePortal}
      multiple={type === DataType.MultiSelect}
      disableCloseOnSelect={type == DataType.MultiSelect}
      aria-label={myLabel}
      onChange={(_event, value) => {
        _event.preventDefault();
        if (findByKey) {
          if (type === DataType.MultiSelect) {
            formik.setFieldValue(
              field,
              value.map((x: any) => get(x, validKeyField))
            );
          } else formik.setFieldValue(field, get(value, validKeyField, ''));
        } else formik.setFieldValue(field, value);
        if (onChange) onChange(value);
      }}
      limitTags={2}
      options={controlData.data}
      onBlur={handleBlur}
      groupBy={group ? (option) => option.firstLetter : undefined}
      value={currentValue}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option[validKeyField] === value[validKeyField];
      }}
      includeInputInList
      getOptionLabel={(option) => get(option, validTextField) ?? ''}
      getOptionKey={(option) => get(option, validKeyField) ?? ''}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={myLabel}
          aria-label={myLabel}
          margin="dense"
          name={field}
          size={size}
          placeholder={placeholder ?? `${myLabel}`}
          required={required === true}
          helperText={helperText}
          error={formikError}
          sx={{
            borderRadius: layout.radius.md,
            backgroundColor: theme.palette.background.paper,
            ...theme.applyStyles('dark', {
              backgroundColor: colors.neutral[600],
            }),
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};
