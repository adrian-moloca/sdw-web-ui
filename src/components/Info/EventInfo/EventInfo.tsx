import { Grid } from '@mui/material';
import { OdfMiscellaneous, OdfStats } from 'components';
import get from 'lodash/get';

export const EventInfo = (param: { data: any; discipline: string }) => {
  const name = get(param.data, 'name');
  const extendedInfo = get(param.data, 'extendedInfo');
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <OdfMiscellaneous data={extendedInfo} discipline={param.discipline} name={name} />
      <OdfStats {...param} />
    </Grid>
  );
};
