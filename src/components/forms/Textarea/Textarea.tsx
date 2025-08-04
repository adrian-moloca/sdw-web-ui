import { TextField } from '@mui/material';
import get from 'lodash/get';
import { IInputFieldProps } from 'models';
import { getFieldState } from 'utils/formik-error-helper';

export const Textarea = ({
  field,
  label,
  placeholder,
  hint,
  required,
  disabled,
  rows,
  formik,
}: IInputFieldProps) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const { error, helperText } = getFieldState(field, touched, errors, hint);

  return (
    <TextField
      fullWidth
      required={required}
      disabled={disabled}
      margin="dense"
      multiline
      rows={rows ?? 4}
      id={field}
      name={field}
      label={label}
      value={get(values, field, '')}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      helperText={helperText}
    />
  );
};
