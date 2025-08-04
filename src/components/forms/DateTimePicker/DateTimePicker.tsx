import { DateTimePicker as MaterialDateTimePicker } from '@mui/x-date-pickers-pro';
import get from 'lodash/get';
import { IDateFieldProps } from 'models';

export const DateTimePicker = ({
  field,
  label,
  disabled,
  formik,
  onChange,
  disablePortal,
  disableFuture,
}: IDateFieldProps) => {
  const { values } = formik;
  return (
    <MaterialDateTimePicker
      sx={{ mt: 1, width: '100%' }}
      disabled={disabled === true}
      label={label}
      disableFuture={disableFuture}
      value={get(values, field, null)}
      slotProps={{
        popper: {
          disablePortal,
        },
      }}
      onChange={(newValue: any) => {
        formik.setFieldValue(field, newValue);
        onChange?.(newValue);
      }}
    />
  );
};
