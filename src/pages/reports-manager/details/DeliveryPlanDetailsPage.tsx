import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { DeliveryPlanDisplay } from 'pages/reports-manager/components';
import { useEffect } from 'react';

const DeliveryPlanDetailsPage = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.DeliveryPlan);
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
      overrideViewPanel={(dataItem: any) => (
        <DeliveryPlanDisplay data={dataItem} type={config.type} />
      )}
      displayBoxes={[]}
      dataSource={getDataSource(config.type)}
    />
  );
};

export default DeliveryPlanDetailsPage;
