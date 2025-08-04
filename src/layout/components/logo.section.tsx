import { Stack, Typography, useColorScheme, useTheme } from '@mui/material';
import logo from 'assets/images/logo.svg';
import logoBlack from 'assets/images/logo-white-small.svg';
import { t } from 'i18next';
import { HeaderDisclaimer } from 'components';

const LogoSection = () => {
  const { mode, systemMode } = useColorScheme();
  const theme = useTheme();
  const isLightMode = mode === 'light' || systemMode === 'light';

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <img src={isLightMode ? logo : logoBlack} alt="SDW UI Logo" />
      <Typography
        component={'h1'}
        variant="h3"
        sx={{ mr: theme.spacing(4), fontFamily: theme.typography.h1.fontFamily }}
        color={isLightMode ? theme.palette.grey[900] : theme.palette.grey[100]}
      >
        {t('main.project.name')}
      </Typography>
      <HeaderDisclaimer />
    </Stack>
  );
};

export default LogoSection;
