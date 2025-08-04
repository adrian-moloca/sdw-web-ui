import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { HorseProfile } from 'pages/profiles';

const HorseDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Horse);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    handleMetadata(EntityType.Event);
    handleMetadata(EntityType.Result);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  return (
    <ViewPanel
      config={config}
      expandInfo={true}
      metadata={getMetadata(config.type)}
      overrideViewPanel={(dataItem: any, setup: any) => (
        <HorseProfile data={dataItem} setup={setup} type={config.type} />
      )}
      displayBoxes={[]}
    />
  );
};

export default HorseDetailsPage;
