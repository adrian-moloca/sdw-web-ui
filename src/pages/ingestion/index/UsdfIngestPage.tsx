import appConfig from 'config/app.config';
import { useModelConfig, useSecurity, useSecurityProfile } from 'hooks';
import { EntityType, MenuFlagEnum, ViewType } from 'models';
import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';

const UsdfIngestPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.UsdfIngest);
  const { checkPermission } = useSecurityProfile();

  useEffect(() => {
    checkPermission(MenuFlagEnum.Ingest);
  }, []);

  return (
    <DataGridPanel
      showHeader={true}
      config={config}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      dataSource={{
        url: `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_INGEST_USDF}`,
        apiVersion: config.apiVersion,
        queryKey: config.entityName,
      }}
    />
  );
};

export default UsdfIngestPage;
