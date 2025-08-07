import Grid from '@mui/material/Grid';
import { MasterFooter } from 'layout/MasterFooter';
import { PageContainer } from '@toolpad/core';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  Feature1Card,
  Feature2Card,
  Feature3Card,
  Feature4Card,
  MainLinks,
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
import baseConfig from 'baseConfig';
import { RecentGamesTable } from './components/Statistics/RecentGamesTable';
import { RandomAthletes } from './components/Statistics/RandomAthletes';
import { Container } from '@mui/system';

const LandingPage = () => {
  const auth = useSelector((x: RootState) => x.auth);

  if (auth.isAuthorized)
    return (
      <PageContainer maxWidth="xl" title="" breadcrumbs={[]}>
        <Grid container spacing={baseConfig.gridSpacing}>
          <Grid container size={12}>
            <WelcomeUserCard />
          </Grid>
          <Grid size={12} sx={{ mb: 2 }}>
            <RecentGamesTable />
          </Grid>
          <Grid size={12} sx={{ mb: 2 }}>
            <RandomAthletes />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <MedalNocTable />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
            <MedalAthleteTable />
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
    <PageContainer maxWidth={false} title="" breadcrumbs={[]}>
      <Grid container spacing={baseConfig.gridSpacing}>
        <WelcomeCard />
        <Grid container size={12}>
          <WhatItIsCard />
        </Grid>
        <Grid size={12}>
          <WhatCard />
        </Grid>
        <Grid container size={12}>
          <Container maxWidth="lg">
            <Grid container size={12} spacing={baseConfig.gridSpacing}>
              <Feature1Card />
              <Feature2Card />
              <Feature3Card />
              <Feature4Card />
            </Grid>
          </Container>
        </Grid>
        <Grid size={12}>
          <Container maxWidth="lg" sx={{ my: 8 }}>
            <MainLinks />
          </Container>
        </Grid>
        <MasterFooter />
      </Grid>
    </PageContainer>
  );
};

export default LandingPage;
