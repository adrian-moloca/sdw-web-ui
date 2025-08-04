import { useQuery } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import useConsolidation from 'hooks/useConsolidation';
import { ErrorPanel, ViewSkeleton } from 'components';
import { EditConsolidationPanel } from '../EditConsolidationPanel';
import type { Props } from './types';

export const BaseEditMergeConsolidationPanel = (props: Props) => {
  const apiService = useApiService();
  const { editUrl } = useConsolidation();

  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.id}_view`, props.config.type, props.tags],
    queryFn: () => apiService.getById(props.config, props.id ?? '', props.dataSource?.url),
  });

  const { data: dataSetup, isLoading: isLoadingSetup } = useQuery({
    queryKey: [`${props.id}_editFields`, props.config.type, props.tags],
    queryFn: () => apiService.getById(props.config, props.id ?? '', editUrl),
    refetchOnMount: true,
  });

  if (isLoading || isLoadingSetup) return <ViewSkeleton />;
  if (error) return <ErrorPanel error={error} />;

  const getFieldSetup = () => {
    const fieldSetup = dataSetup.data;
    fieldSetup.productionRecord = props.data.data;
    fieldSetup.state = 'ok';
    return fieldSetup;
  };

  return (
    <EditConsolidationPanel
      id={props.id ?? ''}
      data={data}
      fieldSetup={getFieldSetup()}
      name={props.name}
      config={props.config}
      onCallback={props.onCallback}
      metadata={props.metadata}
    />
  );
};
