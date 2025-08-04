import { Typography, Grid } from '@mui/material';
import { t } from 'i18next';
import { PageContainer } from '@toolpad/core';
import config from 'baseConfig';
import { MasterFooter } from 'layout/MasterFooter';
import bannerOg from 'assets/images/run.jpg';
import { LongTextPanel } from 'components';

type Section = {
  title: string;
  content: string | string[];
  list?: string[];
  footer?: string[] | string;
};

const TermsPage = () => {
  const data = t('terms-of-use.content', { returnObjects: true }) as Section[];

  return (
    <PageContainer maxWidth="xl" title={t('terms-of-use.title')} breadcrumbs={[]}>
      <Grid container spacing={config.gridSpacing}>
        <Grid size={12}>
          <img
            src={bannerOg}
            alt={t('main.project.name')}
            style={{ height: 'auto', width: '100%', maxHeight: 100, objectFit: 'cover' }}
          />
        </Grid>
        <Grid size={12}>
          <Typography>
            {t('general.last-updated')}: <b>{t('terms-of-use.date')}</b>
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography>{t('terms-of-use.subtitle')}</Typography>
        </Grid>
        <Grid size={12}>
          <LongTextPanel data={data} />
        </Grid>
        <MasterFooter />
      </Grid>
    </PageContainer>
  );
};

export default TermsPage;
