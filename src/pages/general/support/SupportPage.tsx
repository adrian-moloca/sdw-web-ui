import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { PageContainer } from '@toolpad/core';
import { LongTextPanel } from 'components';
import type { Section } from 'types/text-panel';
import { MasterFooter } from 'layout/MasterFooter';
import config from 'baseConfig';
import bannerOg from 'assets/images/run-team.jpeg';

const SupportPage = () => {
  const data = t('contact.content', { returnObjects: true }) as Section[];

  return (
    <PageContainer maxWidth="xl" title={t('contact.title')} breadcrumbs={[]}>
      <Grid container spacing={config.gridSpacing}>
        <Grid size={12}>
          <img
            src={bannerOg}
            alt={t('main.project.name')}
            style={{ height: 'auto', width: '100%', maxHeight: 240, objectFit: 'cover' }}
          />
        </Grid>
        <Grid size={12}>
          <Typography gutterBottom>{t('contact.subtitle')}</Typography>
          <LongTextPanel data={data} />
        </Grid>
        <MasterFooter />
      </Grid>
    </PageContainer>
  );
};

export default SupportPage;
