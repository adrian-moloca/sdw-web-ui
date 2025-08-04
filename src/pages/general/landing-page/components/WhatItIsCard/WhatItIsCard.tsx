import { t } from 'i18next';
import { memo } from 'react';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import SDW_Team from 'assets/images/SDW_Team.avif';
import { OlympicColors } from 'themes/colors';

export const WhatItIsCard = memo(() => {
  const data: CardVariantData = {
    background: `radial-gradient(circle at bottom right, ${OlympicColors.GREEN} 40%,  transparent  30%),
      radial-gradient(ellipse at bottom right, ${OlympicColors.YELLOW} 40%, transparent  10%)`,
    imgSrc: SDW_Team,
    direction: 'up',
    imgAlt: t('landing.what-it-is'),
    title: t('landing.what-it-is'),
    content: t('landing.what-it-is-content', { returnObjects: true }) as string[],
    buttons: [],
  };

  return <InfoCard card={data} reverse={true} />;
});
