import { useState } from 'react';
import { LineChartPro } from '@mui/x-charts-pro';
import { basicChartColors, legendDefaultProps } from 'constants/chart';
import { ChartErrorBoundary } from 'components';

export const PeriodStatsChart = () => {
  const [series] = useState([
    {
      label: 'Ready',
      data: [0, 86, 28, 115, 48, 210, 136],
    },
    {
      label: 'Approvals',
      data: [0, 43, 14, 56, 24, 105, 68],
    },
  ]);
  return (
    <ChartErrorBoundary name={'PeriodStatsChart'}>
      <LineChartPro
        colors={basicChartColors}
        xAxis={[
          {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            scaleType: 'band',
          },
        ]}
        series={series}
        height={468}
        slotProps={{
          legend: legendDefaultProps,
        }}
      />
    </ChartErrorBoundary>
  );
};
