import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'i18next';
import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import useAppRoutes from 'hooks/useAppRoutes';
import { ActionType, EntityType, MenuFlagEnum, TemplateType } from 'models';
import { SubVenuesTab } from 'pages/explorer/tabs/SubVenuesTab';

const VenueDetailsPage = () => {
  const { getIndexRoute } = useAppRoutes();
  const { getConfig } = useModelConfig();

  const config = getConfig(EntityType.Venue);
  const { checkPermission, hasPermission } = useSecurityProfile();
  const navigate = useNavigate();
  const { getMetadata, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  const data = getMetadata(config.type);

  const handleMerge = (dataItem: any) =>
    navigate(`/${getConfig(EntityType.MergeRequest).path}/${dataItem.id}/${config.type}`);

  const hasSubVenues = (data: any) => data.subVenues && data.subVenues.length > 0;

  return (
    <ViewPanel
      config={config}
      expandInfo={true}
      metadata={getMetadata(config.type)}
      toolbar={[
        {
          type: ActionType.Merge,
          title: t('actions.buttonMerge'),
          handleClick: handleMerge,
          condition: () => hasPermission(MenuFlagEnum.Consolidation),
        },
      ]}
      displayBoxes={[
        { field: 'localName', title: t('venue.localName') },
        { field: 'region', title: t('venue.region') },

        {
          field: 'country',
          title: t('general.country'),
          template: TemplateType.MasterData,
          metadata: data?.country,
        },
        {
          field: 'disciplineCodes',
          title: t('venue.disciplines'),
          template: TemplateType.Discipline,
        },
        {
          field: 'competitionCategories',
          title: t('venue.competitionCategories'),
          template: TemplateType.CompetitionCategory,
        },
        {
          field: 'competitions',
          title: t('general.competitions'),
          template: TemplateType.CompetitionInfo,
        },
        { field: 'minStartDate', title: t('venue.minStartDate'), template: TemplateType.Date },
        { field: 'maxFinishDate', title: t('venue.maxFinishDate'), template: TemplateType.Date },
        { field: 'totalDays', title: t('venue.totalDays'), template: TemplateType.Number },
        { field: 'totalEvents', title: t('venue.totalEvents'), template: TemplateType.Number },
        { field: 'totalUnits', title: t('venue.totalUnits'), template: TemplateType.Number },
        { field: 'latitude', title: t('venue.latitude') },
        { field: 'longitude', title: t('venue.longitude') },
        { field: 'capacity', title: t('venue.capacity') },
        { field: 'dimensions', title: t('venue.dimensions') },
        { field: 'altitude', title: t('venue.altitude') },
        { field: 'surfaceType', title: t('venue.surface') },
        { field: 'yearBuilt', title: t('venue.yearBuilt') },
        { field: 'summary', title: t('venue.summary') },
        { field: 'otherDetails', title: t('venue.otherDetails') },
        {
          field: 'parentVenueId',
          title: data?.parentVenueId?.displayName,
          route: getIndexRoute(EntityType.Venue),
        },
      ]}
      tabs={[
        { title: t('general.subvenues'), component: SubVenuesTab, condition: hasSubVenues },
        // { title: t('general.schedules, component: ScheduleTabPage },
      ]}
    />
  );
};
export default VenueDetailsPage;
