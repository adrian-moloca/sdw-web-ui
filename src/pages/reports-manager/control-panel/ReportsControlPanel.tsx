import { Box, Button, ButtonGroup, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { lazy, useEffect } from 'react';
import { useSecurityProfile, useStoreCache } from 'hooks';
import { EditionMode, EntityType, MenuFlagEnum } from 'models';
import { MainCard } from 'components/cards/MainCard';
import MonitorHeartTwoToneIcon from '@mui/icons-material/MonitorHeartTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import { ManagerDashboard } from './dashboard/components';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { PageContainer } from '@toolpad/core';
import { useLocation } from 'react-router-dom';
import { BasicPageHeader } from 'layout/page.layout';
import { EditionChip } from 'pages/biographies-manager/components';
import type { MenuProps } from 'types/reports-manager';
import { ManagerIndexControl, DeliveryPlanCalendar, ReportDisplay } from '../components';

const DeliveryPlanForm = lazy(() => import('pages/reports-manager/forms/DeliveryPlanForm'));

const locationAtom = atomWithHash<MenuProps>(
  'page',
  { type: undefined, id: undefined },
  {
    serialize: ({ type, id }) => {
      const parts = [];
      if (type !== null && type !== undefined) {
        parts.push(`type=${EntityType[type]}`); // Manually concatenate enum to string
      }
      if (id) parts.push(`id=${id}`);
      return parts.length > 0 ? parts.join('&') : '';
    },
    deserialize: (value) => {
      const params = value.split('&').reduce(
        (acc, pair) => {
          const [key, val] = pair.split('=');
          acc[key] = val;
          return acc;
        },
        {} as Record<string, string>
      );
      const typeString = params.type;
      const type =
        typeString !== null ? ((EntityType as any)[typeString] as EntityType) : undefined;
      const id = params.id || undefined;
      return { type, id };
    },
  }
);

const ReportsControlPanel = () => {
  const location = useLocation();
  const { checkPermission } = useSecurityProfile();
  const { managerSetup, handleManagerSetup, handleDataInfo, handleMetadata } = useStoreCache();
  const [state, setState] = useAtom(locationAtom);

  useEffect(() => {
    const setupData = async () => {
      await handleManagerSetup();
      await handleDataInfo();
      await handleMetadata(EntityType.Edition);
      checkPermission(MenuFlagEnum.Reports);
    };

    setupData();
  }, []);

  const BuildDisplay = () => {
    switch (state.type) {
      case EntityType.Report:
        return (
          <ManagerIndexControl
            type={state.type}
            form={(data: any) => <ReportDisplay data={data} type={state.type!} />}
          />
        );
      case EntityType.DeliveryPlan:
        return (
          <>
            <Grid size={12}>
              <ManagerIndexControl
                type={state.type}
                form={(data: any, editionMode: EditionMode, onClose: () => void) => (
                  <DeliveryPlanForm
                    data={data}
                    type={state.type!}
                    editionMode={editionMode}
                    onClose={onClose}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <DeliveryPlanCalendar type={state.type} />
            </Grid>
          </>
        );
      default:
        return <ManagerDashboard />;
    }
  };

  return (
    <PageContainer
      maxWidth="xl"
      title={managerSetup.currentEdition?.name}
      breadcrumbs={[
        { title: t('navigation.ReportsManager'), path: '/' },
        {
          title: `${managerSetup.currentEdition?.code} ${t('navigation.ReportPanel')}`,
          path: location.pathname,
        },
      ]}
      slots={{ header: BasicPageHeader }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <MainCard
            boxShadow={false}
            border={false}
            divider={false}
            sx={{ backgroundColor: 'transparent' }}
          >
            <Grid container spacing={2}>
              <Grid size={12}>
                <Stack sx={{ p: 0 }} direction="row">
                  <ButtonGroup color="secondary" variant="outlined" sx={{ p: 0 }}>
                    <Button
                      onClick={() => setState({ type: undefined, id: undefined })}
                      startIcon={<DashboardTwoToneIcon />}
                    >
                      {t('general.dashboard')}
                    </Button>
                    <Button
                      onClick={() => setState({ type: EntityType.DeliveryPlan, id: undefined })}
                      startIcon={<CalendarMonthTwoToneIcon />}
                    >
                      {t('common.delivery')}
                    </Button>
                    <Button
                      onClick={() => setState({ type: EntityType.Report, id: undefined })}
                      startIcon={<MonitorHeartTwoToneIcon />}
                    >
                      {t('general.panel')}
                    </Button>
                  </ButtonGroup>
                  <Box sx={{ flexGrow: 1 }} />
                  <EditionChip data={managerSetup.currentEdition} />
                </Stack>
              </Grid>
              <Grid container size={12}>
                {BuildDisplay()}
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ReportsControlPanel;
