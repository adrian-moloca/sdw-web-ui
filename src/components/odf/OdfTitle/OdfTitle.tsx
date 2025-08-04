import { Typography } from '@mui/material';
import { camelCaseToWords } from '_helpers';
import get from 'lodash/get';

export const OdfTitle = (row: any) => {
  const code = get(row, 'code');
  return (
    <Typography variant="body2" color="textSecondary" sx={{ marginRight: 0.5 }} component={'span'}>
      {camelCaseToWords(code)}
    </Typography>
  );
};

export const OdfExtTitle = (row: any, ext: any) => {
  const code = get(row, 'code');
  const extCode = get(ext, 'code');
  return (
    <Typography variant="body2">{`${camelCaseToWords(code)} - ${camelCaseToWords(extCode)}`}</Typography>
  );
};
