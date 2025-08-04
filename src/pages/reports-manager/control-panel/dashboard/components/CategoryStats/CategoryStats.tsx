import { Box, Stack, Typography } from '@mui/material';
import { GenericLoadingPanel, MainCard } from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart } from '@mui/x-charts-pro';
import { basicLightChartColors, legendDefaultProps } from 'constants/chart';

type Props = {
  mode: 'standard' | 'n20';
};

export const CategoryStats = (props: Props) => {
  const apiService = useApiService();

  const url = `${appConfig.reportManagerEndPoint}/setup/stats/categories`;
  const { data, isLoading } = useQuery({
    queryKey: ['categories_stats'],
    queryFn: () => apiService.fetch(url),
  });

  const chartData = isLoading
    ? []
    : props.mode == 'standard'
      ? sortBy(data?.filter((x: any) => !x.code.startsWith('N2')) ?? [], 'code')
      : sortBy(data?.filter((x: any) => x.code.startsWith('N2')) ?? []);
  const seriesData = useMemo(() => {
    return [
      { label: 'Total Reports', data: chartData.map((x: any) => x.total) ?? [] },
      {
        label: 'Total Approved',
        data: chartData.map((x: any) => x.totalApproved) ?? [],
        stack: 'status',
      },
      {
        label: 'Total Ready',
        data: chartData.map((x: any) => x.totalReady) ?? [],
        stack: 'status',
      },
      {
        label: 'Total Delivered',
        data: chartData.map((x: any) => x.totalDelivered) ?? [],
        stack: 'status',
      },
    ];
  }, [isLoading, data]);

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  const totalVariations = sum(chartData.map((x: any) => x.total ?? 0));
  const totalReports = sum(chartData.map((x: any) => x.totalReports ?? 0));
  const totalReady = sum(chartData.map((x: any) => x.totalReady ?? 0));
  const totalDelivered = sum(chartData.map((x: any) => x.totalDelivered ?? 0));
  const totalApproved = sum(chartData.map((x: any) => x.totalApproved ?? 0));

  return (
    <MainCard content={false}>
      <Box sx={{ p: 2, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1}>
            <Typography color="secondary">
              {props.mode == 'standard' ? '#Reports' : '#Bios Reports'}
            </Typography>
            <Typography variant="h4">{`${totalVariations} / ${totalReports}`}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography color="secondary">Approved</Typography>
            <Typography variant="h4">{totalApproved}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography color="secondary">Ready</Typography>
            <Typography variant="h4">{totalReady}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography color="secondary">Delivered</Typography>
            <Typography variant="h4">{totalDelivered}</Typography>
          </Stack>
        </Stack>
        <BarChart
          colors={basicLightChartColors}
          borderRadius={5}
          xAxis={[
            {
              scaleType: 'band',
              data: chartData?.map((item: any) => item.code) ?? [],
            },
          ]}
          grid={{ horizontal: true }}
          series={seriesData}
          height={props.mode == 'standard' ? 480 : 440}
          barLabel={'value'}
          slotProps={{
            legend: legendDefaultProps,
            barLabel: {
              fontSize: '10px',
            },
          }}
          sx={{
            '& .MuiBarLabel-root': {
              fontSize: '0px',
            },
          }}
        />
      </Box>
    </MainCard>
  );
};
