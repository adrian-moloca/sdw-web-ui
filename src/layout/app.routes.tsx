import useAppRoutes from 'hooks/useAppRoutes';
import { useRoutes } from 'react-router-dom';
import { AppLayout } from './app.layout';

export default function AppRoutes() {
  const { appRoutes } = useAppRoutes();
  return useRoutes([{ path: '/', element: <AppLayout />, children: appRoutes }]);
}
