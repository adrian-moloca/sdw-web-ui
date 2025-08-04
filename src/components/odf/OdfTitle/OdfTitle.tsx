import { Typography } from '@mui/material';
import { camelCaseToWords, getOdfDefinition } from '_helpers';
import get from 'lodash/get';

export const OdfTitle = (row: any, discipline: string) => {
  const code = get(row, 'code');
  const title = getOdfDefinition(get(row, 'code'), discipline)?.text;
  return (
    <Typography variant="body2" color="textSecondary" sx={{ marginRight: 0.5 }} component={'span'}>
      {title ?? camelCaseToWords(code)}
    </Typography>
  );
};

export const OdfExtTitle = (row: any, ext: any, discipline: string) => {
  const code = get(row, 'code');
  const extCode = get(ext, 'code');
  const extTitle = getOdfDefinition(extCode, discipline)?.text;
  const title = getOdfDefinition(code, discipline)?.text;
  return (
    <Typography variant="body2">{`${title ?? camelCaseToWords(code)} - ${extTitle ?? camelCaseToWords(extCode)}`}</Typography>
  );
};
