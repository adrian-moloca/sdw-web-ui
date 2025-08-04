import { useEffect } from 'react';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { CompetitionProfile } from 'pages/profiles';

const CompetitionDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Competition);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata, handleHidden } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    handleHidden(config.type);
    handleMetadata(EntityType.Discipline);
    handleMetadata(EntityType.Event);
    handleMetadata(EntityType.Phase);
    handleMetadata(EntityType.Unit);
    handleMetadata(EntityType.Participant);
    handleMetadata(EntityType.Result);
    handleMetadata(EntityType.Record);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

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
