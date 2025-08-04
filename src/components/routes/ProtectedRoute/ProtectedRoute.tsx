import { GenericLoadingPanel } from 'components/views';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import authService from 'services/auth';
import { AppDispatch, authActions, RootState } from 'store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useSelector((x: RootState) => x.auth);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuthorization = async () => {
      const isValid = await authService.checkAuth();
      setIsAuthorized(isValid && auth.isAuthorized);
    };
    dispatch(authActions.decodeToken());
    checkAuthorization();
  }, [auth.isAuthorized]);

  if (isAuthorized === null) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />; // Redirect to login page
  }

  return <>{children}</>;
};
