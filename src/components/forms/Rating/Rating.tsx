import get from 'lodash/get';
import { Rating as MaterialRating } from '@mui/material';
import { IInputFieldProps } from 'models';

export const Rating = ({ field, disabled, formik }: IInputFieldProps) => {
  const { values } = formik;

  return (
    <MaterialRating
      sx={{ mt: 1 }}
      name={field}
      value={get(values, field, null)}
      disabled={disabled}
      onChange={(_e: any, value: any) => formik.setFieldValue(field, value)}
    />
  );
};
