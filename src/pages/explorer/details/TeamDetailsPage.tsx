import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { TeamProfile } from 'pages/profiles';

const TeamDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Team);
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
        <TeamProfile data={dataItem} setup={setup} type={config.type} />
      )}
      displayBoxes={[]}
    />
  );
};
export default TeamDetailsPage;
