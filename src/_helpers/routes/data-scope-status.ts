import { Loadable } from 'components/Loadable';
import { EntityType, IConfigProps } from 'models';
import { lazy } from 'react';

const DataScopeStatusPage = Loadable(
  lazy(() => import('pages/reports-manager/data-scope-status/DataScopeStatusPage'))
);

export const getNMDashboardEntities = (modelConfig: Record<EntityType, IConfigProps>) => {
  return {
    [EntityType.GdsDashboard]: {
      path: modelConfig[EntityType.GdsDashboard].path,
      pages: {
        index: DataScopeStatusPage,
        view: null,
        create: null,
      },
    },
  };
};
