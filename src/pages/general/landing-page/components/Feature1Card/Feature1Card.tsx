import { t } from 'i18next';
import { memo } from 'react';
import Grid from '@mui/material/Grid';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import SDW_Gyms from 'assets/images/SDW_Gyms.avif';
import { OlympicColors } from 'themes/colors';

export const Feature1Card = memo(() => {
  const data: CardVariantData = {
    background: `radial-gradient(circle at bottom right, ${OlympicColors.BLUE} 25%, transparent  10%)`,
    imgSrc: SDW_Gyms,
    //imageHeight: { xs: 100, md: 160, lg: 200 },
    direction: 'up',
    imgAlt: t('landing.feature1'),
    title: t('landing.feature1'),
    content: t('landing.feature1-content', { returnObjects: true }) as string[],
    buttons: [],
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <InfoCard card={data} reverse={false} />
    </Grid>
  );
});
