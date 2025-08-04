import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IPanelTabProps } from 'types/views';
import { useModelConfig, useSecurity, useStoreCache } from 'hooks';
import { EntityType, ViewType } from 'models';
import useAppRoutes from 'hooks/useAppRoutes';
import { DataGridPanel } from 'components';
import { buildFilter } from '../utils/participants';

export const ParticipantsTeamTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Participant);
  const navigate = useNavigate();
  const { getDetailRoute } = useAppRoutes();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
  }, []);

  return (
    <DataGridPanel
      config={config}
      showHeader={false}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      metadata={getMetadata(config.type)}
      query={buildFilter(props)}
      sorting={[{ column: 'participation_name', operator: 'ASC' }]}
      onSelect={(row: any) => {
        navigate(getDetailRoute(EntityType.Team, row.teamId));
      }}
      dataSource={{
        url: `${config.apiNode}/search/teams`,
        apiVersion: 'search',
        queryKey: `${config.apiNode}${props.parameter.id}`,
      }}
    />
  );
};
