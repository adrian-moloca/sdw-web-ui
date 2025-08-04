import { DataGridPanel } from 'components/datagrid';
import { useModelConfig, useSecurity, useSecurityProfile } from 'hooks';
import { EntityType, MenuFlagEnum, ViewType } from 'models';
import { useEffect } from 'react';

const ReportPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Report);
  const { checkPermission } = useSecurityProfile();
  const { getDataSource } = useModelConfig();

  useEffect(() => {
    checkPermission(MenuFlagEnum.ReportsSetup);
  }, []);

  return (
    <DataGridPanel
      showHeader={true}
      config={config}
      toolbarType="default"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      sorting={[{ column: config.displayAccessor, operator: 'asc' }]}
      dataSource={getDataSource(config.type)}
    />
  );
};
export default ReportPage;
