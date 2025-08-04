import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import { GenericLoadingPanel, ViewPanel } from 'components';
import useApiService from 'hooks/useApiService';
import useAppRoutes from 'hooks/useAppRoutes';
import { ActionType, DataType, EntityType, MenuFlagEnum, TemplateType } from 'models';
import { EventRankingTab } from 'pages/explorer/tabs/EventRankingTab';
import { EventResultsTab } from '../tabs/EventResultsTab';
import { EventRecordsTab } from '../tabs/EventRecordsTab';
import { EventAwardsTab } from '../tabs/EventAwardsTab';
import { EventStatsTab } from '../tabs/EventStatsTab';
import appConfig from 'config/app.config';
import { HideShowDialog } from 'pages/tools/consolidation/components';
import { EventStructureBuilder } from '../components';
import { isNullOrEmpty } from '_helpers';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import saveAs from 'file-saver';
import { EventCalendarTab } from '../tabs/EventCalendarTab';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { getIndexRoute } = useAppRoutes();
  const { getConfig, hasDisciplineRecords } = useModelConfig();
  const config = getConfig(EntityType.Event);
  const apiService = useApiService();
  const { hasPermission, checkPermission } = useSecurityProfile();
  const { getMetadata, handleMetadata } = useStoreCache();

  const [loading, setLoading] = useState<boolean>(false);
  const [openHide, setOpenHide] = useState(false);
  const [item, setItem] = useState<any>(undefined);

  useEffect(() => {
    handleMetadata(config.type);
    handleMetadata(EntityType.Phase);
    handleMetadata(EntityType.Phase);
    handleMetadata(EntityType.Unit);
    handleMetadata(EntityType.Participant);
    handleMetadata(EntityType.Official);
    handleMetadata(EntityType.Result);
    handleMetadata(EntityType.Record);
    handleMetadata(EntityType.Award);
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  const data = getMetadata(config.type);
  const hasCompetitors = (data: any) => data.competitors && data.competitors.length > 0;
  const hasStats = (data: any) => data.stats;

  const handlePreview = async () => {
    setLoading(true);

    const response = await apiService.fetch(
      `${appConfig.apiEndPoint}${appConfig.EVENT_BREAKDOWN.replace('{0}', id ?? '')}`
    );
    const jsonContent = JSON.stringify(response, null, 2);

    setLoading(false);

    const blob = new Blob([jsonContent], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    URL.revokeObjectURL(url);
    if (newTab === null) {
      alert('Popup blocked. Please allow popups for this site.');
    }
  };

  const handleDownload = async () => {
    setLoading(true);

    const response = await apiService.fetch(
      `${appConfig.apiEndPoint}${appConfig.EVENT_BREAKDOWN.replace('{0}', id ?? '')}`
    );
    const jsonContent = JSON.stringify(response, null, 2);

    setLoading(false);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, `${id}.json`);
  };

  const handleHideShow = (dataItem: any) => {
    setOpenHide(true);
    setItem(dataItem);
  };

  const canSeeStructure =
    hasPermission(MenuFlagEnum.Administrator) || hasPermission(MenuFlagEnum.Ingest);

  return (
    <>
      <GenericLoadingPanel loading={loading} />
      <ViewPanel
        config={config}
        expandInfo={false}
        metadata={getMetadata(config.type)}
        toolbar={[
          {
            type: ActionType.Disable,
            title: t('actions.buttonHideShowEntity'),
            handleClick: handleHideShow,
            condition: () => hasPermission(MenuFlagEnum.Consolidation),
          },
          {
            type: ActionType.Preview,
            title: t('actions.buttonPreview'),
            handleClick: async () => {
              await handlePreview();
            },
            condition: () => canSeeStructure,
          },
          {
            type: ActionType.Download,
            title: t('actions.buttonDownload'),
            handleClick: async () => {
              await handleDownload();
            },
            condition: () => canSeeStructure,
          },
        ]}
        displayBoxes={[
          {
            field: 'type',
            title: t('common.type'),
            template: TemplateType.MasterData,
            metadata: data?.type,
          },
          {
            field: 'gender',
            title: t('common.gender'),
            template: TemplateType.MasterData,
            metadata: data?.gender,
          },
          { field: 'startDate', title: t('general.startDate'), template: TemplateType.Date },
          { field: 'finishDate', title: t('general.finishDate'), template: TemplateType.Date },
          { field: 'region', title: t('general.region') },
          {
            field: 'country',
            title: t('common.country'),
            template: TemplateType.MasterData,
            metadata: data?.country,
          },
          { field: 'order', title: t('general.order'), type: DataType.Integer },
          {
            field: 'scheduleStatus',
            title: t('common.status'),
            template: TemplateType.MasterData,
            metadata: data?.scheduleStatus,
          },
          {
            field: 'discipline',
            title: t('general.discipline'),
            route: getIndexRoute(EntityType.Discipline),
            template: TemplateType.RouteDirect,
          },
        ]}
        tabs={[
          {
            title: t('general.eventRankings'),
            component: EventRankingTab,
            condition: hasCompetitors,
          },
          { title: t('general.results'), component: EventResultsTab },
          { title: t('general.structure'), component: EventStructureBuilder },
          { title: t('general.awards'), component: EventAwardsTab },
          { title: t('general.schedule'), component: EventCalendarTab },
          {
            title: t('general.broken-records'),
            component: EventRecordsTab,
            condition: () => hasDisciplineRecords,
          },
          { title: t('general.stats'), component: EventStatsTab, condition: hasStats },
        ]}
      />
      <HideShowDialog
        dataItem={item}
        config={config}
        onClickOk={() => setOpenHide(false)}
        onClickCancel={() => setOpenHide(false)}
        visible={openHide && !isNullOrEmpty(item)}
        operation="HIDE"
      />
    </>
  );
};
export default EventDetailsPage;
