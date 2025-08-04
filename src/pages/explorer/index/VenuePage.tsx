import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import { useModelConfig, useSecurity, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum, ViewType } from 'models';

const VenuePage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Venue);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  return (
    <DataGridPanel
      showHeader={true}
      config={config}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      metadata={getMetadata(config.type)}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
    />
  );
};

export default VenuePage;
