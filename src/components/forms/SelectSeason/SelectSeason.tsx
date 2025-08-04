import { useQuery } from '@tanstack/react-query';
import { Autocomplete, TextField, useTheme } from '@mui/material';
import get from 'lodash/get';
import { t } from 'i18next';
import { DataType, IInputFieldProps } from 'models';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { useMemo } from 'react';
import orderBy from 'lodash/orderBy';
import { getFieldState } from 'utils/formik-error-helper';
import { layout } from 'themes/layout';
import { colors } from 'themes/colors';

interface ISeasonFieldProps extends IInputFieldProps {
  findByKey?: boolean;
  group?: boolean;
}

export const SelectSeason = ({
  field,
  type,
  onChange,
  label,
  placeholder,
  hint,
  size,
  required,
  disabled,
  findByKey,
  formik,
  disablePortal,
}: ISeasonFieldProps) => {
  const apiService = useApiService();
  const url = `${appConfig.apiUsdmEndPoint}/competitions/seasons`;
  const validKeyField = 'season';
  const validTextField = 'title';
  const validGroupField = 'category';
  const { data, error, isLoading } = useQuery({
    queryKey: ['competitions_seasons'],
    queryFn: () => apiService.fetch(url),
  });
  const theme = useTheme();
  const controlData = isLoading || error ? { data: [] } : { data };
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
        (x: any) =>
          (get(x, validKeyField) === get(values, field) &&
            get(x, validGroupField) === get(values, validGroupField)) ||
          get(x, validKeyField) === get(values, field)
      );

      return foundValue ?? null;
    }

    return get(values, field);
  }, [controlData, findByKey, values, field, type]);
  const formalLabel =
    label ?? (type === DataType.MultiSelect ? t('general.seasons') : t('general.season'));
  return (
    <Autocomplete
      id={field}
      fullWidth
      size={size}
      disablePortal={disablePortal}
      disabled={disabled}
      multiple={type === DataType.MultiSelect}
      disableCloseOnSelect={type === DataType.MultiSelect}
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
      groupBy={(option) => option[validGroupField]}
      getOptionLabel={(option) => option[validTextField] ?? option[validKeyField]}
      getOptionKey={(option) => option[validKeyField] + option[validGroupField]}
      isOptionEqualToValue={(option, value) =>
        option[validKeyField] === value[validKeyField] &&
        option[validGroupField] === value[validGroupField]
      }
      onBlur={handleBlur}
      options={orderBy(controlData.data, [validGroupField, validKeyField], ['asc', 'desc'])}
      value={currentValue}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={formalLabel}
          margin="dense"
          size={size}
          name={field}
          placeholder={placeholder ?? `Select ${formalLabel.toLowerCase()}`}
          required={required}
          helperText={helperText}
          error={formikError}
          sx={{
            borderRadius: layout.radius.md,
            backgroundColor: theme.palette.background.paper,
            ...theme.applyStyles('dark', {
              backgroundColor: colors.neutral[600],
            }),
          }}
        />
      )}
    />
  );
};
