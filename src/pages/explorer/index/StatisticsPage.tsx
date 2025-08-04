import { useEffect } from 'react';
import { ButtonTabPrimary } from 'components/datagrid';
import { useSecurityProfile } from 'hooks';
import { MenuFlagEnum } from 'models';
import { PageContainer } from '@toolpad/core';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { t } from 'i18next';
import { BasicPageHeader } from 'layout/page.layout';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { MedalsByCountryTab } from '../tabs/Statistics/MedalsByCountryTab';
import { MedalsByAthleteTab } from '../tabs/Statistics/MedalsByAthleteTab';
import { OlympicParticipationTab } from '../tabs/Statistics/OlympicParticipationTab';
import { OlympicRecordsTab } from '../tabs/Statistics/OlympicRecordsTab';
import { AgeRecordsTab } from '../tabs/Statistics/AgeRecordsTab';
import { BornTodayTab } from '../tabs/Statistics/BornTodayTab';
import { RecentDeathsTab } from '../tabs/Statistics/RecentDeathsTab';
import { Box } from '@mui/material';

const targetAtom = atomWithHash('target', 'medals-by-country');
const StatisticsPage = () => {
  const { checkPermission } = useSecurityProfile();
  const [value, setValue] = useAtom(targetAtom);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  useEffect(() => {
    checkPermission(MenuFlagEnum.Explorer);
  }, []);
  const tabConfig = [
    {
      value: 'medals-by-country',
      label: t('general.medals-by-country'),
      component: <MedalsByCountryTab />,
    },
    {
      value: 'medals-by-athlete',
      label: t('general.medals-by-athletes'),
      component: <MedalsByAthleteTab />,
    },
    {
      value: 'olympic-participation',
      label: t('general.olympic-participation'),
      component: <OlympicParticipationTab />,
    },
    {
      value: 'olympic-records',
      label: t('general.olympic-records'),
      component: <OlympicRecordsTab />,
    },
    { value: 'age-records', label: t('general.age-records'), component: <AgeRecordsTab /> },
    { value: 'born-today', label: t('general.born-today'), component: <BornTodayTab /> },
    { value: 'recent-deaths', label: t('general.recent-deaths'), component: <RecentDeathsTab /> },
  ];
  return (
    <PageContainer
      maxWidth={'xl'}
      title={t('general.olympic-data-statistics')}
      breadcrumbs={[
        { title: t('navigation.Explorer'), path: '/' },
        { title: t('general.statistics'), path: '/' },
      ]}
      slots={{ header: BasicPageHeader }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange}>
            {tabConfig.map(({ value, label }) => (
              <ButtonTabPrimary key={value} value={value} label={label} />
            ))}
          </TabList>
        </Box>
        {tabConfig.map(({ value, component }) => (
          <TabPanel key={value} value={value} sx={{ p: 0 }}>
            {component}
          </TabPanel>
        ))}
      </TabContext>
    </PageContainer>
  );
};

export default StatisticsPage;
