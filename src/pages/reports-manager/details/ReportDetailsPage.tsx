import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { ReportDisplay } from 'pages/reports-manager/components';
import { useEffect } from 'react';

const ReportDetailsPage = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.Report);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata } = useStoreCache();

  useEffect(() => {
    checkPermission(MenuFlagEnum.Reports);
  }, []);

  return (
    <ViewPanel
      config={config}
      expandInfo={true}
      metadata={getMetadata(config.type)}
      overrideViewPanel={(dataItem: any) => <ReportDisplay data={dataItem} type={config.type} />}
      displayBoxes={[]}
      dataSource={getDataSource(config.type)}
    />
  );
};

export default ReportDetailsPage;
