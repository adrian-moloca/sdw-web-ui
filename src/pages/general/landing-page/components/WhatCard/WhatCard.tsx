import { t } from 'i18next';
import { memo } from 'react';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import { OlympicColors } from 'themes/colors';
import SDW_Run1 from 'assets/images/SDW_Run1.avif';

export const WhatCard = memo(() => {
  const data: CardVariantData = {
    background: `radial-gradient(circle at top left, ${OlympicColors.RED} 30%, transparent  10%)`,
    imgSrc: SDW_Run1,
    direction: 'up',
    imgAlt: t('landing.what'),
    title: t('landing.what'),
    content: t('landing.what-content', { returnObjects: true }) as string[],
    buttons: [],
  };

  return <InfoCard card={data} reverse={false} />;
});
