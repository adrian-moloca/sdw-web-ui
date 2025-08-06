import { useQuery } from '@tanstack/react-query';
import type { IParameter } from 'types/views';
import useApiService from 'hooks/useApiService';
import { ErrorPanel, GenericLoadingPanel } from 'components';
import { useModelConfig } from 'hooks';
import { EntityType } from 'models';
import { EventBracketsFlow } from './EventBracketsFlow';

type Props = {
  parameter: IParameter;
  discipline: string;
};

export const EventBracketsDisplayBuilder = ({ parameter }: Props) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Event);
  const url = `${config.apiNode}/${parameter.id}/brackets`;

  const { data, error, isLoading } = useQuery({
    queryKey: [parameter.id, 'brackets'],
    queryFn: () => apiService.fetch(url),
  });
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }
  return <EventBracketsFlow data={data} />;
};
