import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18next';
import { AppDispatch, RootState, authActions } from 'store';
import useAppRoutes from 'hooks/useAppRoutes';
import { SESSION_STORAGE } from 'constants/config';
import SessionStorage from '_helpers/session-storage';
import { MainCard } from 'components/cards/MainCard';
import { GenericLoadingPanel } from 'components';
import { asyncStates } from 'models';
import authService from 'services/auth';
import { Logger } from '_helpers';

const AuthCallback = () => {
  const location = useLocation();
  const navigation = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);
  const { baseRoutes } = useAppRoutes();

  useEffect(() => {
    const handleLogin = async () => {
      dispatch(authActions.setAuthorizationCode(authorizationCode));
      try {
        const tokenInfo = await authService.getAccessToken();
        dispatch(authActions.setAuthorizationToken(tokenInfo));
      } catch {
        Logger.warn('Error on getAccessToken');
      }
      // Redirect to the dashboard after successful login
      const goto = SessionStorage.getItem(SESSION_STORAGE.GO_TO_LINK);
      if (goto && goto.indexOf('auth') < 0) {
        window.location.href = goto;
      } else {
        navigation(baseRoutes.Home);
      }
    };
    const queryParams = queryString.parse(location.search);
    const authorizationCode = queryParams.code as string;

    if (authorizationCode && (status === asyncStates.idle || status === asyncStates.rejected)) {
      handleLogin();
    }
  }, [location.search, history]);

  return (
    <MainCard
      boxShadow={true}
      border={false}
      title={t('common.authentication')}
      subtitle={t('common.authentication_message')}
      divider={false}
    >
      <GenericLoadingPanel loading={true} />
    </MainCard>
  );
};

export default AuthCallback;
