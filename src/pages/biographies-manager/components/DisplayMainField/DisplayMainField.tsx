import get from 'lodash/get';
import { Chip, TableCell, TableRow } from '@mui/material';
import { BiosCountry } from '../BiosCountry';

export const DisplayMainField = (props: Readonly<{ opponent1: any; opponent2: any }>) => {
  const value1 = get(props.opponent1, 'team') ?? get(props.opponent1, 'participationName');
  const value2 = get(props.opponent2, 'team') ?? get(props.opponent2, 'participationName');

  if (!value1 && !value2) return null;

  return (
    <>
      <TableRow sx={{ borderBottom: 'unset' }}>
        <TableCell
          sx={{
            textAlign: 'right',
            borderBottom: 'unset',
            width: '45%',
            fontFamily: 'Olympic Headline',
            fontSize: '1.6rem',
          }}
        >
          {value1}
        </TableCell>
        <TableCell
          rowSpan={2}
          sx={{
            textAlign: 'center',
            borderBottom: 'unset',
            width: '10%',
            fontFamily: 'Olympic Headline',
          }}
        >
          <Chip size="small" label={get(props.opponent1, 'competitorType').toUpperCase()} />
        </TableCell>
        <TableCell
          sx={{
            textAlign: 'left',
            borderBottom: 'unset',
            width: '45%',
            fontFamily: 'Olympic Headline',
            fontSize: '1.6rem',
          }}
        >
          {value2}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ textAlign: 'right', borderBottom: 'unset', width: '45%' }}>
          <BiosCountry
            countryCode={get(props.opponent1, 'organisationCode')}
            size="default"
            position="1"
          />
        </TableCell>
        <TableCell sx={{ textAlign: 'left', borderBottom: 'unset', width: '45%' }}>
          <BiosCountry
            countryCode={get(props.opponent2, 'organisationCode')}
            size="default"
            position="2"
          />
        </TableCell>
      </TableRow>
    </>
  );
};
