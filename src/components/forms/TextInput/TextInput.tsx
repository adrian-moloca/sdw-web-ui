import { TextField } from '@mui/material';
import get from 'lodash/get';
import React from 'react';
import { IInputFieldProps } from 'models';
import { getFieldState } from 'utils/formik-error-helper';

export const TextInput = ({
  field,
  label,
  placeholder,
  hint,
  required,
  disabled,
  sticky,
  formik,
  size,
  onChange,
}: IInputFieldProps) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const { error, helperText } = getFieldState(field, touched, errors, hint);

  return (
    <TextField
      fullWidth
      required={required}
      disabled={sticky || disabled}
      margin="dense"
      id={field}
      name={field}
      label={label}
      aria-label={label}
      size={size ?? 'medium'}
      value={get(values, field, '')}
      placeholder={placeholder ?? `Type a ${label?.toLocaleLowerCase()}`}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event);
        if (onChange) onChange(event);
      }}
      onBlur={handleBlur}
      error={error}
      helperText={helperText}
    />
  );
};
