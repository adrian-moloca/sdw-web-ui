import {
  Badge,
  Button,
  Chip,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Transitions } from 'components/Transitions';
import { MainCard } from 'components/cards/MainCard';
import { AppDispatch, notificationActions, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import NotificationList from './notification.list';
import { t } from 'i18next';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import { useRef, useState, useEffect } from 'react';
import { ThemeSwitcher } from '@toolpad/core';
import { IconLanguageSwitcher } from 'components/IconLanguageSwitcher';

export const SmallNotification = () => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconLanguageSwitcher />
      <ThemeSwitcher />
    </Stack>
  );
};
const Notification = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((x: RootState) => x.notification.notifications);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        color="inherit"
        onClick={handleToggle}
        ref={anchorRef}
        aria-label={t('main.notifications.toggle')}
      >
        <Badge color="info" badgeContent={notifications.length} variant="dot">
          <NotificationsActive color="primary" />
        </Badge>
      </IconButton>
      <ThemeSwitcher />
      <IconLanguageSwitcher />
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="fade"
            position={matchesXs ? 'top' : 'top-right'}
            direction="up"
            in={open}
            {...TransitionProps}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Grid container direction="column" spacing={2}>
                    <Grid size={12}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ pt: 2, px: 2 }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Typography variant="h6">{t('main.notifications.title')}</Typography>
                          <Chip
                            size="small"
                            label={notifications.length}
                            sx={{
                              color: theme.palette.background.default,
                              bgcolor: theme.palette.info.light,
                              alignSelf: 'center',
                            }}
                          />
                        </Stack>
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => dispatch(notificationActions.purgeNotification())}
                        >
                          {t('main.notifications.actionMarkRead')}
                        </Button>
                      </Stack>
                    </Grid>
                    <Grid size={12}>
                      <PerfectScrollbar
                        style={{
                          height: '100%',
                          maxHeight: 'calc(100vh - 205px)',
                          overflowX: 'hidden',
                        }}
                      >
                        <NotificationList />
                      </PerfectScrollbar>
                    </Grid>
                  </Grid>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Stack>
  );
};
export default Notification;
