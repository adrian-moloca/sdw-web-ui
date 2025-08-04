import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import { Stack, Typography } from '@mui/material';
import { PageContainer } from '@toolpad/core';
import { LongTextPanel } from 'components';
import type { Section } from 'types/text-panel';
import { MasterFooter } from 'layout/MasterFooter';
import config from 'baseConfig';
import bannerOg from 'assets/images/hockey-banner.jpeg';
import qr from 'assets/images/qr-request.png';

const SecurityInfoPage = () => {
  const data = t('security.content', { returnObjects: true }) as Section[];

  return (
    <PageContainer maxWidth="xl" title={t('security.title')} breadcrumbs={[]}>
      <Grid container spacing={config.gridSpacing}>
        <Grid size={12}>
          <img
            src={bannerOg}
            alt={t('main.project.name')}
            style={{ height: 'auto', width: '100%', maxHeight: 260, objectFit: 'cover' }}
          />
        </Grid>
        <Grid size={12}>
          <Typography gutterBottom>{t('security.subtitle')}</Typography>
          <Typography gutterBottom>{t('security.subtitle2')}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
          <LongTextPanel data={data} />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Stack alignItems="center" justifyItems="center" sx={{ marginTop: { xs: 0, md: 6 } }}>
            <img
              src={qr}
              alt={t('main.project.name')}
              style={{ height: 'auto', width: 100, maxHeight: 100 }}
            />
            <Typography variant="caption" color="textSecondary">
              {t('security.buttonScan')}
            </Typography>
          </Stack>
        </Grid>
        <MasterFooter />
      </Grid>
    </PageContainer>
  );
};

export default SecurityInfoPage;
