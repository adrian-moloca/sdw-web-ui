import { TextField, useTheme } from '@mui/material';
import get from 'lodash/get';
import React from 'react';
import { IInputFieldProps } from 'models';
import { getFieldState } from 'utils/formik-error-helper';
import { layout } from 'themes/layout';
import { colors } from 'themes/colors';

export const NumberInput = ({
  field,
  label,
  placeholder,
  hint,
  required,
  disabled,
  onChange,
  formik,
  size,
}: IInputFieldProps) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const { error, helperText } = getFieldState(field, touched, errors, hint);
  const theme = useTheme();
  return (
    <TextField
      fullWidth
      type="number"
      required={required}
      disabled={disabled}
      margin="dense"
      size={size}
      id={field}
      name={field}
      label={label}
      value={get(values, field, '')}
      sx={{
        borderRadius: layout.radius.md,
        backgroundColor: theme.palette.background.paper,
        ...theme.applyStyles('dark', {
          backgroundColor: colors.neutral[600],
        }),
      }}
      placeholder={placeholder}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // Accept only integers > 0 or empty string for editing
        if (value === '' || (/^\d+$/.test(value) && Number(value) > 0)) {
          handleChange(event);
          if (onChange) onChange(value);
        }
      }}
      slotProps={{
        htmlInput: {
          type: 'number',
          inputMode: 'numeric',
          min: 0,
          step: 'any',
        },
      }}
      onBlur={handleBlur}
      error={error}
      helperText={helperText}
    />
  );
};
