import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { ErrorPanel, GenericLoadingPanel, RoundCard } from 'components';
import useApiService from 'hooks/useApiService';
import { apiConfig } from 'config/app.config';
import {
  CompetitorTable,
  PhaseHeader,
  PhaseUnitsDisplay,
  ScheduleStatusChip,
} from 'pages/explorer/components';
import { useTranslation } from 'react-i18next';

type Props = {
  data: any;
  discipline: string;
};

export const RankingDisplay = ({ data: sourceData, discipline }: Props) => {
  const apiService = useApiService();
  const { i18n } = useTranslation();
  const url = `${apiConfig.apiUsdmEndPoint}/phases/${sourceData.id}?languageCode=${i18n.language}`;

  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? {} : (data?.data ?? {});

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  return (
    <Grid container spacing={2}>
      {dataContent.competitors && dataContent.competitors.length > 0 && (
        <Grid size={12}>
          <RoundCard
            title={<PhaseHeader data={dataContent} stageType={sourceData.type} />}
            secondary={<ScheduleStatusChip data={dataContent} />}
          >
            <CompetitorTable data={dataContent.competitors} discipline={discipline} />
          </RoundCard>
        </Grid>
      )}
      <Grid size={12}>
        <PhaseUnitsDisplay
          data={sourceData}
          discipline={discipline}
          link={`${url}/units`}
          showTitle={false}
        />
      </Grid>
    </Grid>
  );
};
