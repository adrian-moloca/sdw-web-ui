import { useQuery } from '@tanstack/react-query';
import orderBy from 'lodash/orderBy';
import type { IPanelTabProps } from 'types/views';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { HistoricalResultsDisplay } from 'pages/explorer/components';

interface Props extends IPanelTabProps {
  id?: string;
}

export const CompetitionResults = (props: Props) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(props.parameter.type);

  const url = `${config.apiNode}/${props.parameter.id}/competitions/${props.id}`;
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ['competitionResults', props.parameter.id, props.id, url],
    queryFn: () => apiService.fetch(url),
    enabled: props.id !== undefined,
  });

  const dataContent = isLoading
    ? []
    : (orderBy(data?.data, ['roundsResult.startDate', 'result.rank'], 'desc') ?? []);

  return (
    <HistoricalResultsDisplay
      data={dataContent}
      isLoading={isLoading || isRefetching}
      error={error}
      hideCompetition={true}
    />
  );
};
