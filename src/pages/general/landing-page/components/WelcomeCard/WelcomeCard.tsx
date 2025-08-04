import Login from '@mui/icons-material/Login';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import { t } from 'i18next';
import { memo } from 'react';
import { CardVariantData } from 'types/cards';
import { InfoCard } from 'components/cards/InfoCard';
import authService from 'services/auth';
import SDW_HighJump from 'assets/images/SDW_HighJump.avif';
import { OlympicColors } from 'themes/colors';

export const WelcomeCard = memo(() => {
  const data: CardVariantData = {
    background: `radial-gradient(circle at bottom left, ${OlympicColors.BLUE} 30%,  transparent  30%),
      radial-gradient(circle at top right, ${OlympicColors.YELLOW} 20%, transparent  10%)`,
    imgSrc: SDW_HighJump,
    direction: 'up',
    imgAlt: t('landing.welcome'),
    title: t('landing.welcome'),
    content: t('landing.welcome-intro', { returnObjects: true }) as string[],
    buttons: [
      {
        text: t('actions.buttonLogin'),
        onClick: () => authService.login(),
        startIcon: <Login />,
        sx: { bgcolor: OlympicColors.BLUE },
      },
      {
        text: t('actions.buttonRequestAccess'),
        route: '/access-request',
        variant: 'outlined',
        startIcon: <PersonAddOutlined />,
      },
    ],
  };

  return <InfoCard card={data} reverse={false} />;
});
