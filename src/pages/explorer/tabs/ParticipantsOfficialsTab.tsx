import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IPanelTabProps } from 'types/views';
import { useModelConfig, useSecurity, useStoreCache } from 'hooks';
import { EntityType, ViewType } from 'models';
import useAppRoutes from 'hooks/useAppRoutes';
import { buildFilter } from '../utils/participants';
import { DataGridPanel } from 'components';

export const ParticipantsOfficialsTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Participant);
  const navigate = useNavigate();
  const { getDetailRoute } = useAppRoutes();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
  }, []);

  const filter = buildFilter(props);
  filter.where!.push({ column: 'individualParticipantType', value: 'ATHLETE', exclude: true });

  return (
    <DataGridPanel
      config={config}
      showHeader={false}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      metadata={getMetadata(config.type)}
      query={filter}
      sorting={[{ column: 'participation_name', operator: 'ASC' }]}
      onSelect={(row: any) => {
        navigate(getDetailRoute(EntityType.Person, row.individualId));
      }}
      dataSource={{
        url: `${config.apiNode}/search/officials`,
        apiVersion: 'search',
        queryKey: `${config.apiNode}${props.parameter.id}`,
      }}
    />
  );
};
