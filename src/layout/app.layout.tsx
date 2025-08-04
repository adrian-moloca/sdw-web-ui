import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { DashboardLayout, useNotifications, AppProvider } from '@toolpad/core';
import Notification, { SmallNotification } from './notifications';
import { getSeverity } from './notifications/notification.card';
import appConfig from 'config/app.config';
import { setupSignalRConnection } from 'services';
import { IMessageProps } from 'models';
import { useSecurityProfile } from 'hooks';
import SharedDrawer from './components/shared.drawer';
import useAppRoutes from 'hooks/useAppRoutes';
import AccountPopUp from './components/account.popup';
import { toolpadTheme } from 'themes/tool.theme';
import { useAuth } from 'hooks/useAuth';
import { AppDispatch, notificationActions } from 'store';
import MiniNavItem from 'components/MiniNav/MiniNavItem';

export function AppLayout() {
  const { navigation, branding } = useAppRoutes();
  const notifications = useNotifications();
  const { hasPermission } = useSecurityProfile();
  const dispatch = useDispatch<AppDispatch>();
  const { session, router, signOut, signIn, isAuthenticated } = useAuth();

  const authentication = React.useMemo(() => ({ signIn, signOut }), [signIn, signOut]);

  const isConsolidationEnabled = false; // hasPermission(...) && isAuthenticated;
  const isAdminEnabled = false; // hasPermission(...) && isAuthenticated;

  useEffect(() => {
    if (isConsolidationEnabled) {
      setupSignalRConnection(
        'SdwBroadcast',
        appConfig.consolidationSignalREndPoint,
        (message: IMessageProps) => {
          if (message.type !== 4) {
            notifications.show(message.title, {
              key: message.title,
              severity: getSeverity(message),
              autoHideDuration: 3000,
            });
          }
          dispatch(notificationActions.addNotification(message));
        }
      );
    }
    if (isAdminEnabled) {
      setupSignalRConnection(
        'SdwBroadcast',
        appConfig.ingestSignalREndPoint,
        (message: IMessageProps) => {
          notifications.show(message.title, {
            key: message.title,
            severity: getSeverity(message),
            autoHideDuration: 3000,
          });
          dispatch(notificationActions.addNotification(message));
        }
      );
    }
  }, [dispatch, notifications, hasPermission]);
  if (!isAuthenticated) {
    return (
      <AppProvider
        navigation={navigation}
        branding={branding}
        authentication={authentication}
        router={router}
        theme={toolpadTheme}
      >
        <DashboardLayout
          defaultSidebarCollapsed
          hideNavigation
          renderPageItem={(item, { mini }) => <MiniNavItem item={item} mini={mini} />}
          slots={{
            toolbarActions: SmallNotification,
            toolbarAccount: AccountPopUp,
          }}
        >
          <Outlet />
        </DashboardLayout>
      </AppProvider>
    );
  }
  return (
    <AppProvider
      navigation={navigation}
      branding={branding}
      authentication={authentication}
      session={session}
      router={router}
      theme={toolpadTheme}
    >
      <DashboardLayout
        defaultSidebarCollapsed
        renderPageItem={(item, { mini }) => <MiniNavItem item={item} mini={mini} />}
        slots={{
          toolbarActions: Notification,
          toolbarAccount: AccountPopUp,
        }}
      >
        <Outlet />
      </DashboardLayout>
      <SharedDrawer />
    </AppProvider>
  );
}
