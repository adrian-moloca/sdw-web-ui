import { useQuery } from '@tanstack/react-query';
import { Autocomplete, TextField } from '@mui/material';
import get from 'lodash/get';
import { t } from 'i18next';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { DataType, IInputFieldProps } from 'models';
import { useMemo } from 'react';
import { getFieldState } from 'utils/formik-error-helper';

export const SelectSource = ({
  field,
  type,
  onChange,
  placeholder,
  findByKey,
  hint,
  required,
  disabled,
  disablePortal,
  size,
  formik,
  anonymous = false,
}: IInputFieldProps) => {
  const apiService = useApiService();
  const url = !anonymous
    ? `${appConfig.apiUsdmEndPoint}/common/sources`
    : `${appConfig.toolsEndPoint}/common/sources`;
  const { data, error, isLoading } = useQuery({
    queryKey: ['common_sources', anonymous],
    queryFn: () => apiService.fetch(url, anonymous),
  });

  const controlData = isLoading || error ? [] : data;
  const { values, errors, touched, handleBlur } = formik;
  const { error: formikError, helperText } = getFieldState(field, touched, errors, hint);
  const validKeyField = 'code';
  const validTextField = 'title';

  const currentValue = useMemo(() => {
    if (findByKey) {
      if (type === DataType.MultiSelect) {
        const foundValues = controlData.filter((x: any) => {
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
  return (
    <Autocomplete
      id={field}
      fullWidth
      disabled={disabled}
      size={size}
      disablePortal={disablePortal}
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
      onBlur={handleBlur}
      options={controlData}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option[validKeyField] === value[validKeyField];
      }}
      getOptionLabel={(option) => {
        const code = get(option, validKeyField);
        const display = get(option, validTextField);
        if (code === display) return display;
        return `${code} (${display})`;
      }}
      getOptionKey={(option) => get(option, validKeyField) ?? ''}
      value={currentValue}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={t('general.sources')}
          margin="dense"
          name={field}
          placeholder={placeholder ?? `Select ${t('general.sources').toLowerCase()}`}
          required={required === true}
          helperText={helperText}
          error={formikError}
        />
      )}
    />
  );
};
