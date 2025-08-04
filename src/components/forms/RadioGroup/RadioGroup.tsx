import { ILabelValue, IRadioFieldProps } from 'models';
import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup as MaterialRadioGroup,
  FormGroup,
  Checkbox,
} from '@mui/material';
import get from 'lodash/get';

export const RadioGroup = ({
  field,
  label,
  required,
  disabled,
  options,
  formik,
  hint,
  direction = 'row',
}: IRadioFieldProps) => {
  const { values, errors, touched, handleBlur } = formik;

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(field, (event.target as HTMLInputElement).value);
    formik.setFieldTouched(field, true, true);
  };
  const hintText = touched[field] && errors[field] ? touched[field] && errors[field] : hint;
  return (
    <FormControl
      required={required}
      disabled={disabled}
      id={field}
      error={touched[field] && Boolean(errors[field])}
      onBlur={(e) => {
        handleBlur(e);
        formik.setFieldTouched(field, true);
      }}
    >
      <FormLabel id={`${field}-radio-label-group`}>{label}</FormLabel>
      <MaterialRadioGroup
        aria-labelledby={`${field}-radio-label-group`}
        name={`${field}-radio-buttons-group`}
        value={get(values, field, null)}
        onChange={handleRadioChange}
        row={direction === 'row'}
        sx={{ mb: 1 }}
      >
        {options.map((e: ILabelValue) => (
          <FormControlLabel
            sx={{ py: 0 }}
            value={e.value}
            key={e.value}
            control={<Radio sx={{ py: 0.2 }} />}
            label={e.label}
          />
        ))}
      </MaterialRadioGroup>
      {/* @ts-expect-error TODO: investigate type & value for helperText */}
      {hintText && <FormHelperText disabled={disabled === true}>{hintText}</FormHelperText>}
    </FormControl>
  );
};

export const CheckboxGenericGroup = ({
  field,
  label,
  required,
  options,
  disabled,
  formik,
  hint,
}: IRadioFieldProps) => {
  const { values, errors, touched, handleBlur } = formik;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const element = options.find((e: ILabelValue) => e.label == event.target.name);
    const currentValues = values[field];

    if (event.target.checked) {
      currentValues.push(element?.value);
      formik.setFieldValue(field, currentValues);
    } else {
      const newValues = currentValues.filter((e: string) => e != element?.value);
      formik.setFieldValue(field, newValues);
    }
    formik.setFieldTouched(field, true, true);
  };
  const fieldHasError =
    touched[field] && Array.isArray(errors[field])
      ? errors[field].length > 0
      : touched[field] && Boolean(errors[field]);
  const errorText = fieldHasError
    ? Array.isArray(errors[field])
      ? errors[field]
          .map((err: any) => (typeof err === 'string' ? err : JSON.stringify(err)))
          .join(', ')
      : errors[field]
    : undefined;

  const hintText = errorText ?? hint;
  return (
    <FormControl
      required={required}
      disabled={disabled}
      id={field}
      error={fieldHasError}
      onBlur={(e) => {
        handleBlur(e);
        formik.setFieldTouched(field, true);
      }}
      component="fieldset"
      sx={{ m: 1 }}
      variant="standard"
      aria-label={label}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup sx={{ display: 'flex' }}>
        {options.map((e: ILabelValue) => (
          <FormControlLabel
            value={e.value}
            key={e.value}
            checked={values[field]?.includes(e.value)}
            control={<Checkbox sx={{ py: 0 }} onChange={handleChange} name={e.label} />}
            label={e.label}
          />
        ))}
      </FormGroup>
      {/* @ts-expect-error TODO: investigate type & value for helperText */}
      {hintText && <FormHelperText disabled={disabled === true}>{hintText}</FormHelperText>}
    </FormControl>
  );
};
