import { useEffect } from 'react';
import { t } from 'i18next';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, TemplateType, MenuFlagEnum } from 'models';
import appConfig from 'config/app.config';
import { QualifierDetailsPage } from './QualifierDetailsPage';

const QualifiedHorsePage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.QualifiedHorse);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(EntityType.Horse);
    checkPermission(MenuFlagEnum.GamesTimeInfo);
  }, []);
  const data = getMetadata(config.type);

  return (
    <ViewPanel
      expandInfo={true}
      config={config}
      metadata={getMetadata(config.type)}
      dataSource={{
        url: `${appConfig.biographiesManagerEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.entityName,
      }}
      displayBoxes={[
        { field: 'id', title: t('general.accreditationId') },
        { field: 'yearOfBirth', title: data?.yearOfBirth?.displayName },
        {
          field: 'nationality',
          title: data?.nationality?.displayName,
          template: TemplateType.MasterData,
          metadata: data?.nationality,
        },
        {
          field: 'organisation',
          title: t('general.organisation'),
          template: TemplateType.MasterData,
          metadata: data?.nationality,
        },
        {
          field: 'sex',
          title: t('common.gender'),
          template: TemplateType.MasterData,
          metadata: data?.sex,
        },
        { field: 'breed', title: data?.breed?.displayName },
        { field: 'colour', title: data?.colour?.displayName },
        { field: 'groom', title: data?.groom?.displayName },
        {
          field: 'disciplineCode',
          title: t('general.discipline'),
          template: TemplateType.Discipline,
        },
        { field: 'federationId', title: t('general.federationId') },
        { field: 'status', title: t('common.status'), template: TemplateType.Status },
        { field: 'hordIds', title: 'HORD IDs', template: TemplateType.Tags },
        { field: 'federationIds', title: 'Federation IDs', template: TemplateType.Tags },
        { field: 'updatedOn', title: t('common.modifiedOn'), template: TemplateType.Date },
      ]}
      subcomponent={{ title: t('general.mappings'), component: QualifierDetailsPage }}
    />
  );
};

export default QualifiedHorsePage;
