import { TableCell, TableRow, Typography } from '@mui/material';
import { formatCompactValue, transformOdfExtensions } from '_helpers';
import { OdfExtTitle, OdfTitle } from '../OdfTitle';
import { DisplayValue } from 'components';

export const OdfExtensionRow = (param: { row: any; discipline: string }) => {
  const extension = transformOdfExtensions(param.row, 'ext');
  if (extension)
    return (
      <>
        <TableRow>
          <TableCell>{OdfTitle(param.row)}</TableCell>
          <TableCell>
            <Typography variant="body2">{formatCompactValue(param.row)}</Typography>
          </TableCell>
        </TableRow>
        {extension?.map((ext: any, i: number) => (
          <TableRow key={`${ext.code}-${ext.value}-${i}`}>
            <TableCell sx={{ marginRight: 0.5 }}>{OdfExtTitle(param.row, ext)}</TableCell>
            <TableCell>
              <Typography
                variant="body2"
                component={'span'}
                key={ext.code}
                sx={{ marginRight: 0.5 }}
              >
                {DisplayValue('', ext.value)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  return (
    <TableRow>
      <TableCell>{OdfTitle(param.row)}</TableCell>
      <TableCell>
        <Typography variant="body2">{formatCompactValue(param.row)}</Typography>
      </TableCell>
    </TableRow>
  );
};
