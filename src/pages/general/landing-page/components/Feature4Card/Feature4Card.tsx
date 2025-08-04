import { t } from 'i18next';
import { memo } from 'react';
import Grid from '@mui/material/Grid';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import { OlympicColors } from 'themes/colors';
import SDW_HRun from 'assets/images/SDW_HRun.avif';

export const Feature4Card = memo(() => {
  const data: CardVariantData = {
    background: `radial-gradient(circle at top left, ${OlympicColors.RED} 25%, transparent  10%)`,
    imgSrc: SDW_HRun,
    direction: 'up',
    imgAlt: t('landing.feature4'),
    title: t('landing.feature4'),
    content: t('landing.feature4-content', { returnObjects: true }) as string[],
    buttons: [],
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <InfoCard card={data} reverse={true} />
    </Grid>
  );
});
