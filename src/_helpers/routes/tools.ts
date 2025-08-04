import { Loadable } from 'components/Loadable';
import { EntityType, IConfigProps } from 'models';
import { lazy } from 'react';

const CategoryDetailsPage = Loadable(lazy(() => import('pages/tools/details/CategoryDetailsPage')));
const MergeRequestDetailsPage = Loadable(
  lazy(() => import('pages/tools/details/MergeRequestDetailsPage'))
);
const CategoryPage = Loadable(lazy(() => import('pages/tools/index/CategoryPage')));
const MergeRequestPage = Loadable(lazy(() => import('pages/tools/index/MergeRequestPage')));

export const getToolsEntities = (modelConfig: Record<EntityType, IConfigProps>) => ({
  [EntityType.MergeRequest]: {
    path: modelConfig[EntityType.MergeRequest].path,
    pages: {
      index: MergeRequestPage,
      view: MergeRequestDetailsPage,
      create: null,
    },
  },
  [EntityType.Category]: {
    path: modelConfig[EntityType.Category].path,
    pages: {
      index: CategoryPage,
      view: CategoryDetailsPage,
      create: null,
    },
  },
});
