import { t } from 'i18next';
import { memo } from 'react';
import Grid from '@mui/material/Grid';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import { OlympicColors } from 'themes/colors';
import SDW_Cycling from 'assets/images/SDW_Cycling.avif';

export const Feature3Card = memo(() => {
  const data: CardVariantData = {
    background: `radial-gradient(circle at top right, ${OlympicColors.YELLOW} 25%, transparent  10%)`,
    imgSrc: SDW_Cycling,
    //imageHeight: { xs: 100, md: 160, lg: 200 },
    direction: 'up',
    imgAlt: t('landing.feature3'),
    title: t('landing.feature3'),
    content: t('landing.feature3-content', { returnObjects: true }) as string[],
    buttons: [],
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <InfoCard card={data} />
    </Grid>
  );
});
