import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { transformOdfExtensions } from '_helpers';
import baseConfig from 'baseConfig';
import { DisplayValue, MainCard, StyledTableCell } from 'components';
import dayjs from 'dayjs';
import get from 'lodash/get';

export const OdfWeather = (param: { data: any }) => {
  const data = transformOdfExtensions(param.data, 'odfWeather', 'conditions');
  if (!data || data.length == 0) return null;
  return (
    <MainCard size="small" divider={false} title={'Weather'}>
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            <StyledTableCell>{'Date'}</StyledTableCell>
            <StyledTableCell>{'Period'}</StyledTableCell>
            <StyledTableCell>{'Sky'}</StyledTableCell>
            <StyledTableCell>{'Wind'}</StyledTableCell>
            <StyledTableCell>{'Humidity'}</StyledTableCell>
            <StyledTableCell>{'Temperature'}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((condition: any, i: number) => (
            <TableRow key={`${JSON.stringify(condition)}-${i}`}>
              <TableCell>
                {dayjs(data.date).format(baseConfig.generalDateFormat).toUpperCase()}
              </TableCell>
              <TableCell>{get(condition, 'period')}</TableCell>
              <TableCell>{get(condition, 'sky')}</TableCell>
              <TableCell>{DisplayValue('', get(condition, 'wind'))}</TableCell>
              <TableCell>{DisplayValue('', get(condition, 'humidity'))}</TableCell>
              <TableCell>{DisplayValue('', get(condition, 'temperature'))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainCard>
  );
};
