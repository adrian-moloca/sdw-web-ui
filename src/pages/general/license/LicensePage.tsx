import { Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { PageContainer } from '@toolpad/core';
import config from 'baseConfig';
import { MasterFooter } from 'layout/MasterFooter';
import bannerOg from 'assets/images/running.jpeg';
import { LongTextPanel } from 'components';

type Section = {
  title: string;
  content: string | string[];
  list?: string[];
  footer?: string[] | string;
};

const LicensePage = () => {
  const data = t('license.content', { returnObjects: true }) as Section[];

  return (
    <PageContainer maxWidth="xl" title={t('license.title')} breadcrumbs={[]}>
      <Grid container spacing={config.gridSpacing}>
        <Grid size={12}>
          <img
            src={bannerOg}
            alt={t('main.project.name')}
            style={{ height: 'auto', width: '100%', maxHeight: 100, objectFit: 'cover' }}
          />
        </Grid>
        <Grid size={12}>
          <Typography gutterBottom>{t('license.subtitle')}</Typography>
          <Typography>{t('license.subtitle2')}</Typography>
          <LongTextPanel data={data} />
        </Grid>
        <MasterFooter />
      </Grid>
    </PageContainer>
  );
};

export default LicensePage;
