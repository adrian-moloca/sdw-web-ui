import { t } from 'i18next';
import { Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useAuth } from 'hooks';

export const HeaderDisclaimer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuth();

  if (isMobile)
    return (
      <Tooltip title={t('main.header.disclaimer')}>
        <WarningAmberOutlinedIcon color="warning" />
      </Tooltip>
    );

  return (
    <Typography
      color="text.secondary"
      marginLeft="8px"
      variant="body2"
      maxWidth={isMobile && isAuthenticated ? '405px' : 'auto'}
      width="100%"
    >
      {t('main.header.disclaimer')}
    </Typography>
  );
};
