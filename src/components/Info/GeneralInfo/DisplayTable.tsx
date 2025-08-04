import { TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { BorderedTable } from 'components';
import { snakeCaseToWords } from '_helpers';
import { grey } from '@mui/material/colors';
import { DisplayValue } from './DisplayValue';

export function DisplayTable(value: any) {
  if (!value) return null;
  return (
    <BorderedTable size={'small'}>
      <TableBody>
        {Object.keys(value)
          .filter((x: string) => x !== 'schema' && x !== '$schema')
          .map((key: any, i: number) => (
            <TableRow key={`${i}_${key}`}>
              <TableCell sx={{ color: grey[700], verticalAlign: 'top' }}>
                <Typography variant="body2">{snakeCaseToWords(key)}</Typography>
              </TableCell>
              <TableCell>{DisplayValue(key, value[key])}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </BorderedTable>
  );
}
