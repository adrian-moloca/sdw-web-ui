import { t } from 'i18next';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import { OlympicColors } from 'themes/colors';
import SDW_HighJump from 'assets/images/SDW_HighJump.avif';
import { RootState } from 'store';
import { layout } from 'themes/layout';

export const WelcomeUserCard = memo(() => {
  const auth = useSelector((x: RootState) => x.auth);
  const userName = auth.user?.fullName ?? auth.user?.loginName;
  const data: CardVariantData = {
    background: `radial-gradient(circle at bottom left, ${OlympicColors.BLUE} 20%,  transparent  20%),
      radial-gradient(circle at top right, ${OlympicColors.RED} 20%, transparent  10%)`,
    imgSrc: SDW_HighJump,
    borderRadius: layout.radius.sm,
    direction: 'up',
    imgAlt: `${t('general.hello')} ${userName}!`,
    title: `${t('general.hello')} ${userName}!`,
    imageHeight: { xs: 200, md: 300, lg: 300 },
    content: t('landing.welcome-intro', { returnObjects: true }) as string[],
    buttons: [],
  };

  return <InfoCard card={data} reverse={false} />;
});
