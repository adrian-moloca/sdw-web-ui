import { useQuery } from '@tanstack/react-query';
import type { IPanelTabProps } from 'types/views';
import useApiService from 'hooks/useApiService';
import { Entry } from 'models';
import { filterData } from 'pages/explorer/utils/historical-results';
import { useModelConfig } from 'hooks';
import { HistoricalResultsDisplay } from './HistoricalResultsDisplay';

interface Props extends IPanelTabProps {
  categories: Array<Entry>;
}

export const HistoricalResultsGrid = ({ parameter, categories }: Props) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(parameter.type);

  const url = `${config.apiNode}/${parameter.id}/historical-results`;
  const { data, error, isLoading } = useQuery({
    queryKey: [parameter.id, `historical-results`],
    queryFn: () => apiService.fetch(url),
  });
  const dataContent = isLoading ? [] : (filterData(data?.data, categories) ?? []);
  return <HistoricalResultsDisplay data={dataContent} isLoading={isLoading} error={error} />;
};
