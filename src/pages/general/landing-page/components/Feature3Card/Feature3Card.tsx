import { t } from 'i18next';
import { memo } from 'react';
import Grid from '@mui/material/Grid';
import { MainCard } from 'components';
import { Typography } from '@mui/material';

export const Feature3Card = memo(() => {
  const content: string[] = t('landing.feature3-content', { returnObjects: true }) as string[];

  return (
    <Grid size={{ xs: 12, md: 3 }}>
      <MainCard fullHeight contentSX={{ px: 6, paddingTop: 9, paddingBottom: '18px!important' }}>
        <Typography variant="h5" gutterBottom>
          {t('landing.feature3')}
        </Typography>
        <>
          {content.map((text, index) => (
            <Typography
              key={`${text}-${index}`}
              component={'div'}
              gutterBottom
              variant="body1"
              sx={{ mb: 4 }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </>
      </MainCard>
    </Grid>
  );
});
