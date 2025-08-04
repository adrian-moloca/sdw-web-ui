import appConfig from 'config/app.config';
import { useModelConfig, useSecurity, useSecurityProfile } from 'hooks';
import { EntityType, MenuFlagEnum, ViewType } from 'models';
import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import { IngestDashboard } from '../components';

const OdfIngestPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.OdfIngest);
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
      dashboard={<IngestDashboard />}
      dataSource={{
        url: `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_INGEST_ODF}`,
        apiVersion: config.apiVersion,
        queryKey: config.entityName,
      }}
    />
  );
};

export default OdfIngestPage;
