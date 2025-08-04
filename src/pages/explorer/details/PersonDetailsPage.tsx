import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { PersonProfile } from 'pages/profiles';

const PersonDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Person);
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
      expandInfo={true}
      config={config}
      metadata={getMetadata(config.type)}
      overrideViewPanel={(dataItem: any, setup: any) => (
        <PersonProfile data={dataItem} setup={setup} type={EntityType.Person} />
      )}
      displayBoxes={[]}
    />
  );
};
export default PersonDetailsPage;
