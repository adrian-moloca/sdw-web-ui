import { InputAdornment, TextField } from '@mui/material';
import get from 'lodash/get';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { IInputFieldProps } from 'models';
import { getFieldState } from 'utils/formik-error-helper';

export const SearchInput = ({
  field,
  label,
  placeholder,
  hint,
  required,
  disabled,
  sticky,
  formik,
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
      size="small"
      id={field}
      name={field}
      label={label}
      value={get(values, field, '')}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
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
