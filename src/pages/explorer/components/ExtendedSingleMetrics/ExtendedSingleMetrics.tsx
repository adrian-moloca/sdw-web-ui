import { Grid, Typography, useMediaQuery } from '@mui/material';
import { useResults } from 'hooks';
import { SingleCard } from './SingleCard';
import { ExtendedCard } from 'components';
import { t } from 'i18next';
import DataUsageOutlinedIcon from '@mui/icons-material/DataUsageOutlined';
type Props = {
  data: any;
};
export const ExtendedSingleMetrics = ({ data }: Props) => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const { getVisibleMetrics } = useResults();
  const metrics = getVisibleMetrics(data, isMobile);
  if (metrics.length === 0) return null;
  return (
    <Grid container size={12} spacing={1}>
      <ExtendedCard titleText={t('general.additional-information')} icon={DataUsageOutlinedIcon}>
        <Grid container size={12} spacing={1}>
          {metrics
            .filter((x: any) => !x.l)
            .map((row, index) => (
              <SingleCard key={index} data={row} />
            ))}
          {metrics
            .filter((x: any) => x.l)
            .map((row, index) => (
              <Grid key={index} size={12}>
                <Typography>
                  <b>{row?.label}</b>: {row?.formattedValue}
                </Typography>
              </Grid>
            ))}
        </Grid>
      </ExtendedCard>
    </Grid>
  );
};
