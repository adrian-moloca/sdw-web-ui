import { t } from 'i18next';
import { memo } from 'react';
import Grid from '@mui/material/Grid';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import { OlympicColors } from 'themes/colors';
import SDW_Equ from 'assets/images/SDW_Equ.avif';

export const Feature2Card = memo(() => {
  const data: CardVariantData = {
    background: `radial-gradient(circle at bottom left, ${OlympicColors.GREEN} 25%, transparent  10%)`,
    imgSrc: SDW_Equ,
    //imageHeight: { xs: 100, md: 160, lg: 200 },
    direction: 'up',
    imgAlt: t('landing.feature2'),
    title: t('landing.feature2'),
    content: t('landing.feature2-content', { returnObjects: true }) as string[],
    buttons: [],
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <InfoCard card={data} reverse={true} />
    </Grid>
  );
});
