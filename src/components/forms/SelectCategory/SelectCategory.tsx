import { useQuery } from '@tanstack/react-query';
import { Autocomplete, TextField } from '@mui/material';
import get from 'lodash/get';
import { t } from 'i18next';
import { DataType, IInputFieldProps } from 'models';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { getFieldState } from 'utils/formik-error-helper';

export const SelectCategory = ({
  field,
  type,
  onChange,
  placeholder,
  hint,
  required,
  disabled,
  formik,
  disablePortal,
}: IInputFieldProps) => {
  const apiService = useApiService();
  const url = `${appConfig.apiUsdmEndPoint}/competitions/categories`;

  const { data, error, isLoading } = useQuery({
    queryKey: ['competitions_categories'],
    queryFn: () => apiService.fetch(url),
  });

  const controlData = isLoading || error ? { data: [] } : { data };
  const { values, errors, touched, handleBlur } = formik;
  const { error: formikError, helperText } = getFieldState(field, touched, errors, hint);

  return (
    <Autocomplete
      id={field}
      fullWidth
      disablePortal={disablePortal}
      disabled={disabled}
      multiple={type === DataType.MultiSelect}
      disableCloseOnSelect={type === DataType.MultiSelect}
      onChange={(_event, value) => {
        _event.preventDefault();
        formik.setFieldValue(field, value);
        onChange?.(value);
      }}
      onBlur={handleBlur}
      options={controlData.data}
      value={get(values, field, type === DataType.MultiSelect ? [] : null)}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={t('general.competitionCategories')}
          margin="dense"
          name={field}
          placeholder={placeholder ?? `Select ${t('general.competitionCategories').toLowerCase()}`}
          required={required}
          helperText={helperText}
          error={formikError}
        />
      )}
    />
  );
};
