import Grid from '@mui/material/Grid';
import { MasterFooter } from 'layout/MasterFooter';
import bannerOg from 'assets/images/run.jpg';
import SDW_Locations from 'assets/images/SDW_Locations.avif';
import { t } from 'i18next';
import { PageContainer } from '@toolpad/core';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  Feature1Card,
  Feature2Card,
  Feature3Card,
  Feature4Card,
  MainLinks,
  MainShortCuts,
  WelcomeCard,
  WelcomeUserCard,
  WhatCard,
  WhatItIsCard,
} from './components';
import {
  MedalNocTable,
  MedalAthleteTable,
  RecentDeathsTable,
  BornTodayTable,
} from './components/Statistics';
import { layout } from 'themes/layout';
import baseConfig from 'baseConfig';
import { RecentGamesTable } from './components/Statistics/RecentGamesTable';
import { RandomAthletes } from './components/Statistics/RandomAthletes';

const LandingPage = () => {
  const auth = useSelector((x: RootState) => x.auth);

  if (auth.isAuthorized)
    return (
      <PageContainer maxWidth="xl" title="" breadcrumbs={[]}>
        <Grid container spacing={baseConfig.gridSpacing}>
          <Grid size={12}>
            <WelcomeUserCard />
          </Grid>
          <MainShortCuts />
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <RecentGamesTable />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <RandomAthletes />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <MedalNocTable />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <MedalAthleteTable />
          </Grid>
          <Grid size={12}>
            <img
              src={bannerOg}
              alt={t('main.project.name')}
              style={{
                height: 'auto',
                width: '100%',
                marginRight: 5,
                borderRadius: layout.radius.sm,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <RecentDeathsTable />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <BornTodayTable />
          </Grid>
          <Grid size={12}>
            <MainLinks />
          </Grid>
          <MasterFooter />
        </Grid>
      </PageContainer>
    );

  return (
    <PageContainer maxWidth="xl" title="" breadcrumbs={[]}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <WelcomeCard />
        </Grid>
        <Grid size={12}>
          <WhatItIsCard />
        </Grid>
        <Grid size={12}>
          <WhatCard />
        </Grid>
        <Grid container size={12}>
          <Feature1Card />
          <Feature2Card />
          <Feature3Card />
          <Feature4Card />
        </Grid>
        <Grid size={12} sx={{ my: 4 }}>
          <img
            src={SDW_Locations}
            alt={t('main.project.name')}
            style={{ height: 'auto', width: '100%' }}
          />
        </Grid>
        <Grid size={12}>
          <MainLinks />
        </Grid>
        <MasterFooter />
      </Grid>
    </PageContainer>
  );
};

export default LandingPage;
