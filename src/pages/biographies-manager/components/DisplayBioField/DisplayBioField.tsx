import get from 'lodash/get';
import { TableCell, TableRow } from '@mui/material';

export const DisplayBioField = (props: {
  field: string;
  label: string;
  opponent1: any;
  opponent2: any;
}) => {
  const value1 = get(props.opponent1, props.field);
  const value2 = get(props.opponent2, props.field);

  if (!value1 && !value2) return null;

  return (
    <TableRow>
      <TableCell sx={{ textAlign: 'right', width: '35%' }}>
        {value1?.trim().replace(',', ' | ') ?? '-'}
      </TableCell>
      <TableCell
        sx={{
          textAlign: 'center',
          width: '30%',
          fontFamily: 'Olympic Headline',
          fontSize: '1.2rem',
        }}
      >
        {props.label}
      </TableCell>
      <TableCell sx={{ textAlign: 'left', width: '35%' }}>
        {value2?.trim().replace(',', ' | ') ?? '-'}
      </TableCell>
    </TableRow>
  );
};
