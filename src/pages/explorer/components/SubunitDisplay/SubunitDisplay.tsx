import { useQuery } from '@tanstack/react-query';
import { ErrorPanel, GenericLoadingPanel, RoundCard } from 'components';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { CompetitorTable, ScheduleDisplay, SubunitHeader } from 'pages/explorer/components';

type Props = {
  data: any;
  discipline: string;
};

export const SubunitDisplay = ({ data: sourceData, discipline }: Props) => {
  const apiService = useApiService();
  const url = `${apiConfig.apiUsdmEndPoint}/subunits/${sourceData.id}`;

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
    <RoundCard
      title={<SubunitHeader data={dataContent} />}
      secondary={<ScheduleDisplay data={dataContent} />}
    >
      <CompetitorTable
        discipline={discipline}
        data={dataContent.competitors ?? []}
        officials={dataContent.officials}
      />
    </RoundCard>
  );
};
