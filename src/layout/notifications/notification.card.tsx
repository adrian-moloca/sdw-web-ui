import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  SxProps,
  Theme,
  Button,
  ListItem,
  IconButton,
  Box,
  AlertColor,
} from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { AppDispatch, notificationActions } from 'store';
import { useState } from 'react';
import { IMessageProps } from 'models';
import { LinearProgress } from 'components';
import 'dayjs/locale/es';
import { t } from 'i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
import PendingOutlined from '@mui/icons-material/PendingOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import PestControlOutlined from '@mui/icons-material/PestControlOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ClearOutlined from '@mui/icons-material/ClearOutlined';

interface Props {
  data: IMessageProps;
}
export const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 8,
  '&:hover': {
    background: theme.palette.divider,
  },
  '& .MuiListItem-root': {
    padding: 0,
  },
}));

const getMessageIcon = (message: IMessageProps) => {
  switch (message.type) {
    case 4:
      return <PendingOutlined />;
    case 0:
      return <InfoOutlined />;
    case 2:
      return <WarningAmberOutlined />;
    case 3:
      return <PestControlOutlined />;
    default:
      return <CheckCircleOutlined />;
  }
};
const getSxProps = (message: IMessageProps): SxProps<Theme> => {
  switch (message.type) {
    case 4:
      return { bgcolor: 'white', color: 'primary.main' };
    case 0:
      return { bgcolor: 'white', color: 'secondary.main' };
    case 2:
      return { bgcolor: 'white', color: 'warning.main' };
    case 3:
      return { bgcolor: 'white', color: 'error.main' };
    default:
      return { bgcolor: 'white', color: 'success.main' };
  }
};
export const getSeverity = (message: IMessageProps): AlertColor => {
  if (!message.type) return 'success';
  switch (message.type as number) {
    case 0:
      return 'info';
    case 2:
      return 'warning';
    case 3:
      return 'error';
    default:
      return 'success';
  }
};

export const NotificationCard = ({ data }: Props) => {
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  dayjs.locale('es');
  dayjs.extend(relativeTime);
  const delay = dayjs(data.dateOccurred).locale('es').fromNow();
  return (
    <>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disableGutters
          disablePadding
          secondaryAction={
            <IconButton
              aria-label={t('main.notifications.actionMarkRead')}
              onClick={() => dispatch(notificationActions.dismissNotification(data.id))}
            >
              <ClearOutlined fontSize="small" />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar sx={getSxProps(data)}>{getMessageIcon(data)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ maxWidth: 290 }}
            primary={
              <Typography variant="body1" sx={{ lineHeight: 1 }}>
                {data.title}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="textSecondary">
                {delay}
              </Typography>
            }
          />
        </ListItem>
        <Grid container direction="column" className="list-container" spacing={1}>
          {data.type === 4 && (
            <Grid size={12} sx={{ pb: 1 }}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress value={data.progress} />
              </Box>
            </Grid>
          )}
          <Grid size={12} sx={{ py: 0 }}>
            {data.message && (
              <Button
                variant={'outlined'}
                color="inherit"
                size={'small'}
                sx={{ lineHeight: 1.6, fontSize: '0.8rem' }}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? t('actions.showLess') : t('actions.showMore')}
              </Button>
            )}
          </Grid>
          {showMore && data.message && Array.isArray(data.message) && (
            <Grid size={12}>
              {data.message.map((e: any, i: number) => (
                <Typography
                  variant="body2"
                  key={i}
                  component={'span'}
                  color="inherit"
                  sx={{
                    lineHeight: 1,
                    '& p': {
                      margin: 0,
                    },
                    ol: {
                      margin: 0,
                    },
                    ul: {
                      margin: 0,
                      padding: 0,
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: e,
                  }}
                ></Typography>
              ))}
            </Grid>
          )}
          {showMore && data.message && !Array.isArray(data.message) && (
            <Grid size={12}>
              <Typography
                variant="body2"
                component={'div'}
                color="inherit"
                sx={{ lineHeight: 1.3, mt: 1 }}
                dangerouslySetInnerHTML={{
                  __html: data.message,
                }}
              ></Typography>
            </Grid>
          )}
        </Grid>
      </ListItemWrapper>
      <Divider />
    </>
  );
};
