import { Grid, Typography, useMediaQuery } from '@mui/material';
import { useResults } from 'hooks';
import { SingleCard } from './SingleCard';
import { MainCard } from 'components';
import { olympicsDesignColors } from 'themes/colors';
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
      <MainCard
        sx={[
          (theme) => ({
            width: '100%',
            borderRadius: 0,
            px: theme.spacing(2),
            textAlign: 'left',
            backgroundColor: theme.palette.grey[50],
          }),
          (theme) =>
            theme.applyStyles('dark', {
              borderRadius: 0,
              px: theme.spacing(2),
              width: '100%',
              textAlign: 'left',
              backgroundColor: olympicsDesignColors.dark.general.background,
            }),
        ]}
      >
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
      </MainCard>
    </Grid>
  );
};
