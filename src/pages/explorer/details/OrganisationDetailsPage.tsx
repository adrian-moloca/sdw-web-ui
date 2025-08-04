import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { OrganizationProfile } from 'pages/profiles';

const OrganisationDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Organization);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  return (
    <ViewPanel
      config={config}
      expandInfo={true}
      metadata={getMetadata(config.type)}
      overrideViewPanel={(dataItem: any, setup: any) => (
        <OrganizationProfile data={dataItem} setup={setup} type={config.type} />
      )}
      displayBoxes={[]}
    />
  );
};
export default OrganisationDetailsPage;
