import { IInputFieldProps } from 'models';
import { FormControlLabel, FormHelperText, Checkbox as MaterialCheckbox } from '@mui/material';

export const Checkbox = ({
  field,
  label,
  required,
  disabled,
  onChange,
  formik,
  hint,
}: IInputFieldProps) => {
  const { values, handleChange, handleBlur } = formik;

  return (
    <>
      <FormControlLabel
        sx={{ marginTop: '8px', marginLeft: 0 }}
        required={required}
        disabled={disabled}
        control={
          <MaterialCheckbox
            required={required}
            disabled={disabled}
            id={field}
            name={field}
            onBlur={handleBlur}
            checked={values[field] === true}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(event);
              formik.setFieldValue(field, event.target.checked);
              if (onChange) onChange(event.target.value);
            }}
          />
        }
        label={label}
      />
      {hint && <FormHelperText disabled={disabled}>{hint}</FormHelperText>}
    </>
  );
};
