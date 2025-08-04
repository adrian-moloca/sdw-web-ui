import { Autocomplete, Chip, TextField } from '@mui/material';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import { DataType, IOptionFieldProps } from 'models';
import { getFieldState } from 'utils/formik-error-helper';

export const SelectOptions = ({
  options,
  field,
  label,
  hint,
  placeholder,
  required,
  disabled,
  onChange,
  disablePortal,
  formik,
  type,
}: IOptionFieldProps) => {
  const { values, errors, touched, handleBlur } = formik;
  const { error, helperText } = getFieldState(field, touched, errors, hint);

  const validKeyField = 'value';
  const validTextField = 'displayName';

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
      options={uniqBy(options, validKeyField)}
      value={get(values, field, type === DataType.MultiSelect ? [] : null)}
      includeInputInList
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option[validKeyField] === value[validKeyField];
      }}
      renderTags={
        type == DataType.MultiSelect
          ? (value: readonly any[], getTagProps) =>
              value.map((option: any, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="outlined"
                    sx={{ fontSize: '1rem' }}
                    label={get(option, validTextField) ?? ''}
                    key={key}
                    {...tagProps}
                  />
                );
              })
          : undefined
      }
      getOptionLabel={(option) => get(option, validTextField) ?? ''}
      getOptionKey={(option) => get(option, validKeyField) ?? ''}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          margin="dense"
          name={field}
          placeholder={placeholder ?? `Select ${label}`}
          required={required}
          helperText={helperText}
          error={error}
        />
      )}
    />
  );
};
