import { t } from 'i18next';
import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
import { Avatar, useTheme } from '@mui/material';
import { MainCard } from 'components/cards/MainCard';

const HelpPage = () => {
  const theme = useTheme();

  return (
    <MainCard
      border={false}
      title={t('navigation.Help')}
      avatar={
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.largeAvatar,
            color: theme.palette.grey[100],
            bgcolor: theme.palette.primary.main,
          }}
        >
          <SupportTwoToneIcon fontSize="large" />
        </Avatar>
      }
    />
  );
};

export default HelpPage;
