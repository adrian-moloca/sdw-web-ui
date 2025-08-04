import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab, Stack, Box, Typography } from '@mui/material';
import React, { type JSX, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import IngestionPackagesTab from './IngestionPackagesTab';
import CompetitionsTab from './CompetitionsTab';
import { Breadcrumbs, StyledIconButton } from 'components';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { olympicsDesignColors } from 'themes/colors';

const tabConfig = [
  {
    value: 'ingestion-packages-dashboard',
    label: t('navigation.PackageSummary'),
    component: <IngestionPackagesTab />,
    pathSuffix: 'ingestion-packages',
  },
  {
    value: 'competitions-dashboard',
    label: t('navigation.StateByCompetition'),
    component: <CompetitionsTab />,
    pathSuffix: 'competitions',
  },
];

const DataScopeStatusPage: React.FC = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const [page, setPage] = useState('ingestion-packages-dashboard');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setPage(newValue);
  };

  const breadcrumbs = [
    { title: t('navigation.home'), path: '/' },
    { title: t('navigation.ReportsManager') },
    { title: t('navigation.GDSDashboards'), path: location.pathname },
  ];

  return (
    <Stack
      sx={[
        { padding: '24px 40px 0 40px' },
        () => ({
          backgroundColor: olympicsDesignColors.light.general.backgroundLight,
        }),
        (theme) =>
          theme.applyStyles('dark', {
            backgroundColor: olympicsDesignColors.dark.general.backgroundLight,
          }),
      ]}
    >
      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        separator={<ChevronRightOutlinedIcon fontSize="small" />}
      />
      <Box display="flex" alignItems="center" gap="12px" marginTop="8px" marginBottom="8px">
        <StyledIconButton
          title={t('actions.buttonBack')}
          aria-label={t('actions.buttonBack')}
          onClick={() => navigate(-1)}
          size="small"
          width="36px"
          height="36px"
        >
          <ArrowBack fontSize="small" />
        </StyledIconButton>
        <Typography variant="h4" fontWeight="700" lineHeight="46px">
          {t('navigation.GDSDashboards')}
        </Typography>
      </Box>
      <TabContext value={page}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            sx={{
              '& .MuiTabs-flexContainer': {
                gap: '16px',
              },
            }}
          >
            {tabConfig.map(({ value, label }) => (
              <Tab
                key={value}
                value={value}
                label={label}
                sx={[
                  { fontWeight: '700', fontSize: '16px', lineHeight: '24px', padding: 0 },
                  () => ({
                    color: olympicsDesignColors.base.neutral.black,
                  }),
                  (theme) =>
                    theme.applyStyles('dark', {
                      color: olympicsDesignColors.base.neutral.white,
                    }),
                ]}
              />
            ))}
          </TabList>
        </Box>
        {tabConfig.map(({ value, component }) => (
          <TabPanel key={value} value={value} sx={{ p: 0 }}>
            {component}
          </TabPanel>
        ))}
      </TabContext>
    </Stack>
  );
};

export default DataScopeStatusPage;
