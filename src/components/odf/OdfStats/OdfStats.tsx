import { Grid, Typography } from '@mui/material';
import { getOdfDefinition, getStatsValue, transformOdfExtensions } from '_helpers';
import { OdfTable } from 'components';
import { t } from 'i18next';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

export const OdfStats = (param: { data: any; discipline: string }) => {
  const extendedInfo = get(param.data, 'extendedInfo');
  const odfStatsTournament = getStatsValue(param.data);
  const stats =
    transformOdfExtensions(extendedInfo, 'odfExtensions', 'stats') ?? odfStatsTournament;
  if (odfStatsTournament) {
    const groupedData = groupBy(stats, 'type');
    return Object.keys(groupedData)
      .sort((a, b) => a.localeCompare(b))
      .map((key: string) => (
        <Grid container size={12} key={key}>
          <Typography variant="body1" fontWeight={'bold'}>
            {getOdfDefinition(key)?.text ?? key}
          </Typography>
          <OdfTable data={groupedData[key]} discipline={param.discipline} />
          <Typography
            variant="caption"
            component={'span'}
            color="textSecondary"
          >{`Format: <value>/<attempt> - <percent> | <average>`}</Typography>
        </Grid>
      ));
  }
  if (!stats || stats.length == 0) return null;
  return (
    <Grid container size={12}>
      <Typography variant="body1" fontWeight={'bold'}>
        {t('general.statistics')}
      </Typography>
      <OdfTable data={stats} discipline={param.discipline} />
      <Typography
        variant="caption"
        component={'span'}
        color="textSecondary"
      >{`Format: <value>/<attempt> - <percent> | <average>`}</Typography>
    </Grid>
  );
};
