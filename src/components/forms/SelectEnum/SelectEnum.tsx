import { DataType, IEnumFieldProps } from 'models';
import { Autocomplete, TextField, useTheme } from '@mui/material';
import get from 'lodash/get';
import { useMemo } from 'react';
import { t } from 'i18next';
import { getFieldState } from 'utils/formik-error-helper';
import { layout } from 'themes/layout';
import { colors } from 'themes/colors';

export const SelectEnum = ({
  options,
  field,
  label,
  hint,
  placeholder,
  required,
  disabled,
  onChange,
  formik,
  type,
  size,
  disablePortal,
  findByKey,
}: IEnumFieldProps) => {
  const { values, errors, touched, handleBlur } = formik;
  const { error: formikError, helperText } = getFieldState(field, touched, errors, hint);
  const validKeyField = 'code';
  const theme = useTheme();
  const currentValue = useMemo(() => {
    if (findByKey) {
      if (type === DataType.MultiSelect) {
        const foundValues = options.filter((x: any) => {
          const selectedValues = get(values, field); // Get the selected values array
          return selectedValues?.includes(get(x, validKeyField)); // Check if current value exists in the selected values
        });

        return foundValues?.length ? foundValues : [];
      }
      const foundValue = options?.find((x: any) => get(x, validKeyField) === get(values, field));

      return foundValue ?? null;
    }
    return get(values, field, null);
  }, [options, findByKey, values, validKeyField, field, type]);
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
      onBlur={handleBlur}
      options={options}
      value={currentValue}
      includeInputInList
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option[validKeyField] === value[validKeyField];
      }}
      getOptionLabel={(option) => option.text ?? ''}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          margin="dense"
          name={field}
          sx={{
            borderRadius: layout.radius.md,
            backgroundColor: theme.palette.background.paper,
            ...theme.applyStyles('dark', {
              backgroundColor: colors.neutral[600],
            }),
          }}
          placeholder={placeholder ?? `${t('actions.select')} ${label}`}
          required={required === true}
          helperText={helperText}
          error={formikError}
        />
      )}
    />
  );
};
