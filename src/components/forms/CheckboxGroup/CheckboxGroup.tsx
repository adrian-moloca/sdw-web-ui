import React from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import { IEnumGroupFieldProps, IEnumProps } from 'models';

export const CheckboxGroup = ({
  field,
  label,
  required,
  options,
  disabled,
  formik,
  hint,
  direction,
}: IEnumGroupFieldProps) => {
  const { values, errors, touched, handleBlur } = formik;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const element = options.find((e: IEnumProps) => e.text == event.target.name);
    const currentValues = values[field];

    if (event.target.checked) {
      currentValues.push(element?.id);
      formik.setFieldValue(field, currentValues);
    } else {
      const newValues = currentValues.filter((e: number) => e != element?.id);
      formik.setFieldValue(field, newValues);
    }
  };

  return (
    <FormControl
      required={required}
      disabled={disabled}
      id={field}
      error={touched[field] && Boolean(errors[field])}
      onBlur={handleBlur}
      component="fieldset"
      sx={{ m: 1 }}
      variant="standard"
    >
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup sx={{ display: 'flex', flexDirection: direction }}>
        {options.map((e: IEnumProps) => (
          <FormControlLabel
            key={e.code}
            checked={values[field]?.includes(e.id)}
            control={<Checkbox sx={{ py: 0 }} onChange={handleChange} name={e.text} />}
            label={e.text}
          />
        ))}
      </FormGroup>
      {hint && <FormHelperText disabled={disabled}>{hint}</FormHelperText>}
    </FormControl>
  );
};
