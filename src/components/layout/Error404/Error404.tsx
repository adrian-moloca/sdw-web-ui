import useAppRoutes from 'hooks/useAppRoutes';
import React from 'react';
import { Link } from 'react-router-dom';

export const Error404 = (): React.ReactElement => {
  const { baseRoutes } = useAppRoutes();
  return (
    <div className="container pt-4">
      <div>
        <h4 className="font-weight-normal">404 Page not found</h4>
        <Link to={baseRoutes.Home} className="btn btn-primary">
          Home
        </Link>
      </div>
    </div>
  );
};
