import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useDispatch } from 'react-redux';
import appConfig from 'config/app.config';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { t } from 'i18next';
import { useAtom } from 'jotai';
import { atomWithHash } from 'jotai-location';
import { GenericLoadingPanel } from 'components';
import { H2HGenerator, StartListGenerator } from './components';
import useApiService from 'hooks/useApiService';
import { MenuFlagEnum } from 'models';
import { useSecurityProfile } from 'hooks';
import { AppDispatch, dataActions } from 'store';

const locationAtom = atomWithHash('tab', '1');

const ReportLivePage = () => {
  const apiService = useApiService();
  const dispatch = useDispatch<AppDispatch>();
  const { checkPermission } = useSecurityProfile();
  const [value, setValue] = useAtom(locationAtom);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  checkPermission(MenuFlagEnum.ReportsSetup);

  const url = `${appConfig.gdsReportEndpoint}/config`;
  const { data, isLoading } = useQuery({
    queryKey: ['report_config'],
    queryFn: () => apiService.fetch(url),
  });

  useEffect(() => {
    dispatch(dataActions.setReport(data?.options));
  }, [isLoading, data]);

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label={t('general.participants')}>
          <Tab label="Head-To-Head" value="1" />
          <Tab label="Extended Start Lists" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1" sx={{ px: 0, py: 1 }}>
        <H2HGenerator data={data.options.find((e: any) => e.key === 'H2H')} />
      </TabPanel>
      <TabPanel value="2" sx={{ px: 0, py: 1 }}>
        <StartListGenerator data={data.options.find((e: any) => e.key === 'ESL')} />
      </TabPanel>
    </TabContext>
  );
};

export default ReportLivePage;
