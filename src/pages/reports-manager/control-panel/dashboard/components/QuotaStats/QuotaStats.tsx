import { Box, Stack, Typography } from '@mui/material';
import { ChartErrorBoundary, GenericLoadingPanel } from 'components';
import { MainCard } from 'components/cards/MainCard';
import { useModelConfig, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import sum from 'lodash/sum';
import { EntityType } from 'models';
import { useQuery } from '@tanstack/react-query';
import { BarChart } from '@mui/x-charts-pro';
import { t } from 'i18next';
import { basicLightChartColors, legendDefaultProps } from 'constants/chart';

export const QuotaStats = () => {
  const apiService = useApiService();
  const { getDataSource } = useModelConfig();
  const { managerSetup, getDisciplineEntry } = useStoreCache();

  const variables: any = {
    enablePagination: true,
    rows: 300,
    start: 0,
    editionId: managerSetup?.currentEdition?.id,
    //filters: [{ column: 'type', values: ['PERSON'], operator: 'inList' }],
  };

  const { data, isLoading } = useQuery({
    queryKey: ['quota_stats'],
    queryFn: () => apiService.post(getDataSource(EntityType.BiographyQuota).url, variables),
  });

  const seriesData = [
    {
      label: t('general.remaining-bios'),
      data: data?.content?.map((x: any) => x.quota - x.currentQuota) ?? [],
      stack: 'bios',
    },
    {
      label: t('general.actual-bios'),
      data: data?.content?.map((x: any) => x.currentQuota) ?? [],
      stack: 'bios',
    },
  ];

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  const totalBios = data?.content ? sum(data.content.map((x: any) => x.quota ?? 0)) : 0;
  const totalCurrentQuota = data?.content
    ? sum(data.content.map((x: any) => x.currentQuota ?? 0))
    : 0;
  const percentage = totalBios > 0 ? (totalCurrentQuota / totalBios) * 100 : 0;

  return (
    <MainCard content={false}>
      <Box sx={{ p: 2, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1}>
            <Typography color="secondary">{t('general.person-bios')}</Typography>
            <Typography variant="h4">{`${totalCurrentQuota.toLocaleString()} / ${totalBios.toLocaleString()}`}</Typography>
          </Stack>
          <Stack spacing={1} alignItems="end">
            <Typography color="secondary">{t('general.total-quota')}</Typography>
            <Typography variant="h4">{`${Math.round(percentage)}%`}</Typography>
          </Stack>
        </Stack>
        <ChartErrorBoundary name={'QuotaStats'}>
          <BarChart
            colors={basicLightChartColors}
            borderRadius={5}
            yAxis={[
              {
                scaleType: 'band',
                data:
                  data.content?.map((item: any) => getDisciplineEntry(item.disciplineCode).value) ??
                  [],
              },
            ]}
            layout="horizontal"
            grid={{ horizontal: true }}
            series={seriesData}
            height={600}
            margin={{
              left: 200,
            }}
            barLabel="value"
            slotProps={{
              legend: legendDefaultProps,
            }}
          />
        </ChartErrorBoundary>
      </Box>
    </MainCard>
  );
};
