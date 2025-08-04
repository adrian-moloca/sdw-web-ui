import { MenuFlagEnum } from 'models';
import { useSecurityProfile } from 'hooks';
import { PageContainer } from '@toolpad/core';
import { t } from 'i18next';
import appConfig from 'config/app.config';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ButtonTabHeader } from 'components';
import {
  AccessRequestIndex,
  SecurityClientsIndex,
  SecurityPageHeader,
  SecurityUsersIndex,
} from './components';

const targetAtom = atomWithHash('target', '1');
const SecurityManager = () => {
  const { checkPermission } = useSecurityProfile();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = useAtom(targetAtom);
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  checkPermission(MenuFlagEnum.Administrator);

  return (
    <PageContainer
      maxWidth="xl"
      title={`${t('navigation.SecurityManager')} (${appConfig.forgeRockRealm.toUpperCase()})`}
      breadcrumbs={[
        { title: t('navigation.Tools'), path: '/' },
        { title: t('navigation.SecurityManager'), path: '/tools/security-manager' },
      ]}
      slots={{ header: SecurityPageHeader }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            variant={isMobile ? 'fullWidth' : 'standard'}
            onChange={handleChange}
            aria-label={t('navigation.SecurityManager')}
          >
            <ButtonTabHeader label={t('general.users')} value="1" />
            <ButtonTabHeader label={t('general.apiClients')} value="2" />
            <ButtonTabHeader label={t('general.accessRequests')} value="3" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ px: 0, py: 1 }}>
          <SecurityUsersIndex />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0, py: 1 }}>
          <SecurityClientsIndex />
        </TabPanel>
        <TabPanel value="3" sx={{ p: 0, py: 1 }}>
          <AccessRequestIndex />
        </TabPanel>
      </TabContext>
    </PageContainer>
  );
};

export default SecurityManager;
