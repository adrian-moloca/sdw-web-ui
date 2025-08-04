import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { CompetitionProfile } from 'pages/profiles';
import { useTranslation } from 'react-i18next';

const CompetitionDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Competition);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata, handleHidden, handleMasterDataInfo } = useStoreCache();
  const { i18n } = useTranslation();
  useEffect(() => {
    handleMetadata(config.type);
    handleHidden(config.type);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await handleMasterDataInfo();
    };
    fetchData();
  }, [i18n.language]);
  return (
    <ViewPanel
      config={config}
      expandInfo={true}
      metadata={getMetadata(config.type)}
      overrideViewPanel={(dataItem: any, setup: any) => (
        <CompetitionProfile data={dataItem} setup={setup} type={EntityType.Competition} />
      )}
      displayBoxes={[]}
    />
  );
};

export default CompetitionDetailsPage;
