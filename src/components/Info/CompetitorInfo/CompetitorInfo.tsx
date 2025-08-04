import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import get from 'lodash/get';
import { t } from 'i18next';

import { OdfMiscellaneous, OdfSchemaStats, OdfStats } from 'components';

export const CompetitorInfo = (param: { data: any; discipline: string }) => {
  const name = get(param.data, 'name');
  const extendedInfo = get(param.data, 'extendedInfo');
  const participantNames = get(param.data, 'participantNames');
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {participantNames && (
        <Grid size={12}>
          <Typography variant="body1" fontWeight={'bold'}>
            {t('general.team-members')}
          </Typography>
          {participantNames.map((e: string, index: number) => (
            <Typography key={e} variant="body1">{`${index + 1}. ${e}`}</Typography>
          ))}
        </Grid>
      )}
      <OdfMiscellaneous data={extendedInfo} discipline={param.discipline} name={name} />
      <OdfStats {...param} />
      <OdfSchemaStats {...param} />
    </Grid>
  );
};
