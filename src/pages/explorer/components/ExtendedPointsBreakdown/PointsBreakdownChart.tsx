import { Grid, useTheme } from '@mui/material';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';
import { ChartErrorBoundary } from 'components';
import { PointBreakdownData } from './types';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import { BarChart, barLabelClasses } from '@mui/x-charts';

type Props = {
  data: PointBreakdownData;
};

export const PointsBreakdownChart = ({ data }: Props) => {
  const theme = useTheme();
  const metrics = uniqBy(
    data.properties.map((prop) => ({
      title: prop.title,
      field: prop.field,
    })),
    'field'
  );
  if (
    !data.categories ||
    data.categories.length === 0 ||
    !data.breakdown ||
    data.breakdown.length === 0
  ) {
    return null; // No data to display
  }
  const radarCategories = metrics.map((m) => m.title);
  const series = data.categories?.map((categoryDef) => {
    const breakdownForCategory = data.breakdown.find((item) => item.category === categoryDef.code);

    if (!breakdownForCategory) {
      return {
        label: categoryDef.title,
        fillArea: false,
        hideMark: false,
        data: Array(metrics.length).fill(0), // Fill with zeros for each metric
      };
    }
    const seriesData = metrics.map((metricDef) => {
      const value = Number(get(breakdownForCategory, metricDef.field) || 0);
      return value;
    });

    return {
      label: categoryDef.title,
      fillArea: false,
      hideMark: false,
      data: seriesData,
    };
  });
  if (metrics.length < 3) {
    const barChartCategories = data.categories?.map((cat) => cat.title);
    const barChartSeries = metrics
      .filter((x) => x.field !== 'rank')
      .map((metricDef) => {
        const metricValues = data.breakdown.map((item) => Number(get(item, metricDef.field) || 0));
        return {
          label: metricDef.title, // e.g., "Artistic"
          data: metricValues,
        };
      });

    return (
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartErrorBoundary name={`point-breakdown-chart-bar`}>
          <BarChart
            height={300}
            colors={[theme.palette.primary.main, theme.palette.secondary.main]}
            barLabel="value"
            borderRadius={5}
            xAxis={[{ position: 'none' }]} // X-axis labels for the bar chart
            yAxis={[{ data: barChartCategories, scaleType: 'band', width: 100 }]}
            layout="horizontal"
            series={barChartSeries} // Data series for the bar chart
            slotProps={{
              barLabel: { fontFamily: 'Olympic Sans', fontSize: 8 },
            }}
            hideLegend={true}
            sx={{
              [`& .${barLabelClasses.root}`]: {
                fontFamily: 'Olympic Sans',
                fontSize: 12,
              },
            }}
          />
        </ChartErrorBoundary>
      </Grid>
    );
  }
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <ChartErrorBoundary name={`point-breakdown-chart-radar`}>
        <RadarChart
          height={300}
          radar={{
            metrics: radarCategories,
          }}
          series={series}
        />
      </ChartErrorBoundary>
    </Grid>
  );
};
