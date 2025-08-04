import { Router, Session } from '@toolpad/core';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch, authActions, RootState } from 'store';
import avatar from 'assets/images/avatar/avatar.png';
import { asyncStates, MenuFlagEnum } from 'models';
import authService from 'services/auth';

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthorized, user, status, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const router: Router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (url: string | URL) => navigate(url),
  };
  const hasPermission = (flag: MenuFlagEnum) => (profile.flags & flag) !== 0;
  function decodeJwt(jwtToken: string) {
    const [, payload] = jwtToken.split('.');
    return JSON.parse(atob(payload));
  }
  const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeJwt(token);
    if (decodedToken?.exp) {
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      return expirationTime < currentTime;
    }
    return true;
  };
  const checkPermission = (flag: MenuFlagEnum) => {
    if (!hasPermission(flag)) navigate('/');
  };

  const getSession = (): Session | null => {
    if (user)
      return {
        user: {
          id: user.loginName,
          name: user.fullName,
          email: user.email,
          image: avatar,
        },
      };
    return {
      user: {
        id: '',
        name: 'Visitor',
        email: 'Visitor',
        image: avatar,
      },
    };
  };

  const isAuthenticated = useMemo(() => isAuthorized, [isAuthorized]);
  const isResolved = useMemo(() => status === asyncStates.resolved, [status]);

  return {
    session: getSession(),
    profile: user,
    signOut: () => {
      dispatch(authActions.logout());
      authService.login();
      navigate('/');
    },
    signIn: () => {
      authService.login();
    },
    status,
    decodeJwt,
    isTokenExpired,
    isAuthenticated,
    isResolved,
    error,
    router,
    checkPermission,
  };
}
