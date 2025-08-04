import { useTheme, Divider, List, ListItem, ListItemText } from '@mui/material';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { ListItemWrapper, NotificationCard } from './notification.card';
import { IMessageProps } from 'models';
import orderBy from 'lodash/orderBy';
import { t } from 'i18next';

const NotificationList = () => {
  const theme = useTheme();
  const notifications = useSelector((x: RootState) => x.notification.notifications);
  return (
    <List
      sx={{
        width: 400,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 400,
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 20,
        },
        '& .MuiDivider-root': {
          my: 0,
        },
        '& .list-container': {
          pl: 7,
        },
      }}
    >
      <Divider />
      {notifications && notifications.length > 0 ? (
        orderBy(notifications, (x) => x.dateOccurred, 'desc').map((e: IMessageProps, i: number) => (
          <NotificationCard data={e} key={i} />
        ))
      ) : (
        <>
          <ListItemWrapper>
            <ListItem alignItems="center" sx={{ px: 3 }}>
              <ListItemText primary={t('message.no-messages-available')} />
            </ListItem>
          </ListItemWrapper>
          <Divider />
        </>
      )}
    </List>
  );
};

export default NotificationList;
