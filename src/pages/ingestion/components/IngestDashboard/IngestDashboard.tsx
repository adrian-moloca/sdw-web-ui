import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { IngestKpiCard } from '../IngestKpiCard';
import appConfig from 'config/app.config';
import type { TimeData } from 'types/ingestion';
import useApiService from 'hooks/useApiService';
import { GenericLoadingPanel } from 'components';

type Data = {
  [key: string]: TimeData;
};

export const IngestDashboard = () => {
  const apiService = useApiService();

  const urlKpi = `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_INGEST_ODF_STATS}?minutes=5`;
  const { data, isLoading } = useQuery({
    queryKey: ['ingest_kpi_services'],
    queryFn: () => apiService.fetch(urlKpi),
    refetchInterval: 6000,
  });

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  if (!data) return null;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {Object.entries(data as Data).map(([key, value]) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={key}>
            <IngestKpiCard title={key} data={value} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
