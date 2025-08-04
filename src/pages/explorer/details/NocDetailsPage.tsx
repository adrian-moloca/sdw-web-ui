import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { NocProfile } from 'pages/profiles';

const NocDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Noc);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata, handleMasterDataInfo } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    handleMasterDataInfo();
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  return (
    <ViewPanel
      config={config}
      expandInfo={true}
      metadata={getMetadata(config.type)}
      overrideViewPanel={(dataItem: any, setup: any) => (
        <NocProfile data={dataItem} setup={setup} type={EntityType.Noc} />
      )}
      displayBoxes={[]}
    />
  );
};

export default NocDetailsPage;
