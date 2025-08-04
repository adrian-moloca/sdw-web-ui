import get from 'lodash/get';
import { TableCell, TableRow } from '@mui/material';
import { calculateAge } from '../../utils';

export function DisplayAgeField(props: { opponent1: any; opponent2: any }) {
  const dateOfBirth1 = get(props.opponent1, 'dateOfBirth');
  const dateOfBirth2 = get(props.opponent2, 'dateOfBirth');

  if (!dateOfBirth1 && !dateOfBirth2) return null;

  return (
    <TableRow>
      <TableCell sx={{ textAlign: 'right', width: '35%' }}>{calculateAge(dateOfBirth1)}</TableCell>
      <TableCell
        sx={{
          textAlign: 'center',
          width: '30%',
          fontFamily: 'Olympic Headline',
          fontSize: '1.2rem',
        }}
      >
        {'Age'}
      </TableCell>
      <TableCell sx={{ textAlign: 'left', width: '35%' }}>{calculateAge(dateOfBirth2)}</TableCell>
    </TableRow>
  );
}
