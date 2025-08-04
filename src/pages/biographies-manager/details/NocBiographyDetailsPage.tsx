import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useSecurityProfile, useModelConfig, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { NocProfile } from 'pages/profiles';

const NocBiographyDetailsPage = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.NocBiography);
  const { checkPermission } = useSecurityProfile();
  const { handleMetadata, getMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    checkPermission(MenuFlagEnum.Biography);
  }, []);

  return (
    <ViewPanel
      expandInfo={true}
      config={config}
      overrideViewPanel={(dataItem: any, setup: any) => (
        <NocProfile data={dataItem} setup={setup} type={EntityType.NocBiography} />
      )}
      metadata={getMetadata(config.type)}
      displayBoxes={[]}
      dataSource={getDataSource(config.type)}
    />
  );
};

export default NocBiographyDetailsPage;
