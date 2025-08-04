import './assets/scss/main.scss';
import './assets/scss/global.css';
import { useDispatch } from 'react-redux';
import { AppDispatch, authActions } from './store';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect } from 'react';
import { DialogsProvider, NotificationsProvider } from '@toolpad/core';
import { toolpadTheme } from 'themes/tool.theme';
import AppRoutes from 'layout/app.routes';
import appConfig from 'config/app.config';
import { useAuth } from 'hooks/useAuth';
import { useStoreCache } from 'hooks';
import { useTranslation } from 'react-i18next';

type ToolpadMode = 'dark' | 'light' | null;

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n } = useTranslation();
  const { session } = useAuth();
  const { handleMasterDataInfo } = useStoreCache();

  useEffect(() => {
    const fetchData = async () => {
      await handleMasterDataInfo();
    };
    fetchData();
  }, [i18n.language]);
  useEffect(() => {
    dispatch(authActions.decodeToken());
  }, []);
  useEffect(() => {
    dispatch(authActions.decodeToken());
  }, []);
  const toolpadMode = localStorage.getItem('toolpad-mode') as ToolpadMode;

  return (
    <NotificationsProvider>
      <DialogsProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider
              defaultMode={toolpadMode ?? 'light'}
              theme={toolpadTheme}
              noSsr
              modeStorageKey={`${appConfig.forgeRockRealm}${session?.user?.email}-theme`}
            >
              <AppRoutes />
            </ThemeProvider>
          </StyledEngineProvider>
        </LocalizationProvider>
      </DialogsProvider>
    </NotificationsProvider>
  );
}
export default App;
