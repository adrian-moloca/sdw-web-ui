import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ButtonTabPrimary, ErrorPanel, EventInfo, GenericLoadingPanel } from 'components';
import { EntityType } from 'models';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { EventResultsTab } from 'pages/explorer/tabs/EventResultsTab';
import { EventRecordsTab } from 'pages/explorer/tabs/EventRecordsTab';
import { EventAwardsTab } from 'pages/explorer/tabs/EventAwardsTab';
import { EventStructureBuilder } from 'pages/explorer/components';
import { EventRankingTab } from 'pages/explorer/tabs/EventRankingTab';
import { IParameter } from 'types/views';
import { Box } from '@mui/system';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { EventCalendarTab } from 'pages/explorer/tabs/EventCalendarTab';
import { useTranslation } from 'react-i18next';
type Props = {
  data: any;
  discipline: any;
};
const targetAtom = atomWithHash('target', '1');
export const DisciplineEventDetails: React.FC<Props> = ({
  data,
  discipline,
}): React.ReactElement | null => {
  const [value, setValue] = useAtom(targetAtom);
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const { i18n } = useTranslation();
  const hasAwards = data?.awards?.length > 0;
  const apiService = useApiService();
  const { getConfig, hasDisciplineRecords } = useModelConfig();
  const hasRecords = hasDisciplineRecords(discipline);
  const config = getConfig(EntityType.Event);

  const url = `${config.apiNode}/${data.id}?languageCode=${i18n.language}`;
  const {
    data: resultData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`${data.id}_results`],
    queryFn: () => apiService.fetch(url),
  });
  const dataContent = isLoading ? [] : (resultData?.data ?? []);

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }
  const parameter: IParameter = {
    id: data.id,
    type: EntityType.Event,
    display: data.title,
  };
  const tabs = [
    {
      value: '1',
      label: t('general.eventRankings'),
      component: <EventRankingTab parameter={parameter} data={dataContent} />,
    },
    {
      value: '2',
      label: t('general.results'),
      component: <EventResultsTab parameter={parameter} data={dataContent} />,
    },
    hasAwards && {
      value: '3',
      label: t('general.awards'),
      component: <EventAwardsTab parameter={parameter} data={dataContent} />,
    },
    hasRecords && {
      value: '4',
      label: t('general.broken-records'),
      component: <EventRecordsTab parameter={parameter} data={dataContent} />,
    },
    {
      value: '5',
      label: t('general.calendar'),
      component: <EventCalendarTab parameter={parameter} data={dataContent} />,
    },
    {
      value: '6',
      label: t('general.structure'),
      component: <EventStructureBuilder parameter={parameter} data={dataContent} />,
    },
    data.stats && {
      value: '7',
      label: t('general.stats'),
      component: <EventInfo data={data} discipline={discipline.sportDisciplineId} />,
    },
  ].filter(Boolean);
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="discipline.events">
          {tabs.map((tab) => (
            <ButtonTabPrimary key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </TabList>
      </Box>
      {tabs.map((tab) => (
        <TabPanel key={tab.value} value={tab.value} sx={{ px: 0, py: 2 }}>
          {tab.component}
        </TabPanel>
      ))}
    </TabContext>
  );
};
