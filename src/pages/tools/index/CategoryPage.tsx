import { useEffect } from 'react';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { useModelConfig, useSecurity, useSecurityProfile } from 'hooks';
import { EntityType, MenuFlagEnum, ViewType } from 'models';

const CategoryPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Category);
  const { checkPermission } = useSecurityProfile();

  useEffect(() => {
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  return (
    <DataGridPanel
      config={config}
      showHeader={true}
      toolbarType="search"
      flags={useSecurity(config.type, ViewType.Index, false).flags}
      dataSource={{
        url: `${appConfig.masterDataEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.entityName,
      }}
    />
  );
};

export default CategoryPage;
