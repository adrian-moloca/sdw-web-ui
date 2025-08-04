import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { PersonProfile } from 'pages/profiles';

const PersonBiographyDetailsPage = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.PersonBiography);
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
      expandInfo={true}
      config={config}
      overrideViewPanel={(dataItem: any, setup: any) => (
        <PersonProfile data={dataItem} setup={setup} type={EntityType.PersonBiography} />
      )}
      metadata={getMetadata(config.type)}
      displayBoxes={[]}
      dataSource={getDataSource(config.type)}
    />
  );
};

export default PersonBiographyDetailsPage;
