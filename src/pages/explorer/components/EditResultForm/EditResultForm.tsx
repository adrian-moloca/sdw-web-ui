import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EntityType } from 'models';
import { GenericLoadingPanel, MainCard } from 'components';
import useApiService from 'hooks/useApiService';
import { isNullOrEmpty } from '_helpers';
import useConsolidation from 'hooks/useConsolidation';
import { EditConsolidationPanel } from 'pages/tools/consolidation/components';
import { useModelConfig } from 'hooks';

type Props = {
  dataItem: any;
  metadata: any;
  onClickClose: () => void;
};

export const EditResultForm = ({ dataItem, metadata, onClickClose }: Props) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Result);
  const { editUrl } = useConsolidation();
  const queryClient = useQueryClient();

  const id = dataItem.roundsResult.result.id;
  const competitionId = dataItem?.competition.id;
  const clonedObject = { ...dataItem };

  const { data: dataSetup, isLoading } = useQuery({
    queryKey: [`${id}_editFields`, config.type],
    queryFn: () => apiService.getById(config, id ?? '', editUrl),
    enabled: !isNullOrEmpty(id),
    refetchOnMount: true,
  });

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return (
    <MainCard
      size="small"
      title={`${dataItem?.competition.title} • ${dataItem?.roundsResult.participation_name} • ${dataItem?.roundsResult.title} • ${dataItem?.roundsResult.startDate}`}
      contentSX={{ p: 0.5 }}
    >
      <EditConsolidationPanel
        id={clonedObject.roundsResult.result.id ?? ''}
        name={`${clonedObject?.competition.title} ${clonedObject?.roundsResult.participation_name}`}
        config={config}
        data={clonedObject.roundsResult.result}
        metadata={metadata}
        fieldSetup={dataSetup.data}
        onCallback={() => {
          queryClient.invalidateQueries({ queryKey: ['competitionResults', competitionId] });
          onClickClose();
        }}
      />
    </MainCard>
  );
};
