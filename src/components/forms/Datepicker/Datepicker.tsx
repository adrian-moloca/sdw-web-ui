import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import get from 'lodash/get';
import { IDateFieldProps } from 'models';

export const Datepicker = ({
  field,
  label,
  disabled,
  formik,
  views,
  openTo,
  format,
  onChange,
  disablePortal,
  disableFuture,
  yearsOrder,
  size = 'medium',
}: IDateFieldProps) => {
  const { values } = formik;

  return (
    <DatePicker
      sx={{ my: 1, width: '100%' }}
      disabled={disabled === true}
      label={label}
      format={format ?? 'YYYY-MM-DD'}
      disableFuture={disableFuture}
      disableHighlightToday={true}
      minDate={dayjs('1986-01-01')}
      formatDensity="dense"
      views={views}
      openTo={openTo}
      yearsOrder={yearsOrder}
      slotProps={{
        popper: {
          disablePortal,
        },
        textField: {
          size,
        },
      }}
      value={get(values, field, null)}
      onChange={(newValue: any) => {
        formik.setFieldValue(field, newValue);
        onChange?.(newValue);
      }}
    />
  );
};
