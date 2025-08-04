import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useSecurityProfile, useStoreCache, useModelConfig } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { HorseProfile } from 'pages/profiles';

const HorseBiographyDetailsPage = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.HorseBiography);
  const { checkPermission } = useSecurityProfile();
  const { handleMetadata, getMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    handleMetadata(EntityType.Event);
    handleMetadata(EntityType.Result);
    checkPermission(MenuFlagEnum.Biography);
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
      dataSource={getDataSource(config.type)}
    />
  );
};

export default HorseBiographyDetailsPage;
