import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { PieChart } from '@mui/x-charts-pro';
import { MainCard } from 'components/cards/MainCard';
import { sum } from 'lodash/';
import { basicLightChartColors, legendDefaultProps } from 'constants/chart';
import { t } from 'i18next';
import { ChartErrorBoundary } from 'components';

export const DataQualityStats = () => {
  // Sample data representing counts of reports per status
  const reportData = [
    { id: 0, label: 'Dummy', value: 12 },
    { id: 1, label: 'Pending', value: 46 },
    { id: 2, label: 'Blocked', value: 54 },
    { id: 3, label: 'Partial', value: 34 },
    { id: 4, label: 'Ready', value: 78 },
  ];

  const totalReports = sum(reportData.map((x: any) => x.count ?? 0));
  const totalErrorReports = sum(
    reportData.filter((x: any) => x.status != 'READY').map((x: any) => x.count ?? 0)
  );
  const totalValidReports = sum(
    reportData.filter((x: any) => x.status == 'READY').map((x: any) => x.count ?? 0)
  );
  const percentage = totalReports > 0 ? (totalErrorReports / totalReports) * 100 : 0;

  return (
    <MainCard content={false}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1}>
            <Typography color="secondary">{t('general.numReports')}</Typography>
            <Typography variant="h4">{`${totalValidReports.toLocaleString()} / ${totalReports.toLocaleString()}`}</Typography>
          </Stack>
          <Typography variant="body1">{t('general.data-quality')}</Typography>
          <Stack spacing={1} alignItems="end">
            <Typography color="secondary">{t('general.percentaje-errors')}</Typography>
            <Typography variant="h4">{`${Math.round(percentage)}%`}</Typography>
          </Stack>
        </Stack>
        <ChartErrorBoundary name={'DataQualityStats'}>
          <PieChart
            colors={basicLightChartColors}
            series={[
              {
                data: reportData,
                innerRadius: 60,
                outerRadius: 180,
                paddingAngle: 5,
                arcLabel: (item) => `${item.value}%`,
                //cornerRadius: 5,
              },
            ]}
            height={450}
            slotProps={{
              legend: legendDefaultProps,
            }}
          />
        </ChartErrorBoundary>
      </Box>
    </MainCard>
  );
};
