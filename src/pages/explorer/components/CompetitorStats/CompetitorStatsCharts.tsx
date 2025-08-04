import '@xyflow/react/dist/style.css';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';
import uniq from 'lodash/uniq';
import { chunkWithMinSize, unifyStats } from '_helpers';
import { Grid } from '@mui/material';
import { ChartErrorBoundary } from 'components';

type Props = {
  data: Array<any>;
  discipline: string;
};

const getCompetitorSeries = (competitorNames: string[], chunk: any[]) => {
  return competitorNames.map((name) => ({
    label: name,
    fillArea: false,
    hideMark: false,
    data: chunk.map((stat) => {
      const match = stat.competitors.find((c: any) => c.name === name);
      const value = match?.valueNum ?? 0;
      return value < 0 ? 0 : value;
    }),
  }));
};

export const CompetitorStatsCharts = ({ data, discipline }: Props) => {
  if (!data) return null;

  const stats = unifyStats(data, discipline);
  if (!stats || stats.length === 0) return null;

  const validStats = stats.filter((stat) =>
    stat.competitors.some((c) => {
      const val = c.valueNum;
      return val && val !== 0;
    })
  );

  const statChunks = chunkWithMinSize(validStats, 8);
  const competitorNames = uniq(stats.flatMap((stat) => stat.competitors.map((c) => c.name)));

  return (
    <>
      {statChunks.map((chunk, index) => {
        const chunkMetrics = chunk.map((stat) => stat.competitors[0]?.description ?? stat.code);

        // Prepare the series for each competitor
        const series = getCompetitorSeries(competitorNames, chunk);

        return (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <ChartErrorBoundary name={`radar-chart-${index}`}>
              <RadarChart
                height={300}
                radar={{
                  //max: max || 120, // Use dynamic max or default to 120
                  metrics: chunkMetrics,
                }}
                series={series}
              />
            </ChartErrorBoundary>
          </Grid>
        );
      })}
    </>
  );
};
