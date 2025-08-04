import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { TeamProfile } from 'pages/profiles';

const TeamBiographyDetailsPage = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.TeamBiography);
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
        <TeamProfile data={dataItem} setup={setup} type={config.type} />
      )}
      displayBoxes={[]}
      dataSource={getDataSource(config.type)}
    />
  );
};

export default TeamBiographyDetailsPage;
