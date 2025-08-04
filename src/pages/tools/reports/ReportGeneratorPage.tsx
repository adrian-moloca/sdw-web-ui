import { Box, Tab } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useSecurityProfile } from 'hooks';
import { MenuFlagEnum } from 'models';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { ReportGenerator } from './generator/components';
import baseConfig from 'baseConfig';
import { AppDispatch, dataActions } from 'store';
import { CReportsGenerator, ReportSeason } from './components';

const locationAtom = atomWithHash('tab', 0);

const ReportGeneratorPage = () => {
  const apiService = useApiService();
  const dispatch = useDispatch<AppDispatch>();
  const { checkPermission } = useSecurityProfile();
  const [value, setValue] = useAtom(locationAtom);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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

  return (
    <Grid container spacing={baseConfig.gridSpacing}>
      <Grid size={12}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="ReportGenerator" variant="scrollable">
              <Tab label="Report Generation + Viewer" value={1} />
              <Tab label="C24 - Records" value={2} />
              <Tab label="Data Generation" value={3} />
            </TabList>
          </Box>
          <TabPanel value={0} sx={{ px: 0, py: 1 }}>
            <ReportGenerator data={data} isLoading={isLoading} />
          </TabPanel>
          <TabPanel value={1} sx={{ px: 0, py: 1 }}>
            <CReportsGenerator id="C24" />
          </TabPanel>
          <TabPanel value={2} sx={{ px: 0, py: 1 }}>
            <ReportSeason data={data} isLoading={isLoading} season="summer" />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default ReportGeneratorPage;
