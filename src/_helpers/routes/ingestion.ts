import { Loadable } from 'components/Loadable';
import { EntityType, IConfigProps } from 'models';
import { lazy } from 'react';

const OdfIngestPage = Loadable(lazy(() => import('pages/ingestion/index/OdfIngestPage')));
const UsdfIngestPage = Loadable(lazy(() => import('pages/ingestion/index/UsdfIngestPage')));
const OdfIngestDetailsPage = Loadable(
  lazy(() => import('pages/ingestion/details/OdfIngestDetailsPage'))
);
const UsdfIngestDetailsPage = Loadable(
  lazy(() => import('pages/ingestion/details/UsdfIngestDetailsPage'))
);

export const getIngestEntities = (modelConfig: Record<EntityType, IConfigProps>) => ({
  [EntityType.OdfIngest]: {
    path: modelConfig[EntityType.OdfIngest].path,
    pages: {
      index: OdfIngestPage,
      view: OdfIngestDetailsPage,
      create: null,
    },
  },
  [EntityType.UsdfIngest]: {
    path: modelConfig[EntityType.UsdfIngest].path,
    pages: {
      index: UsdfIngestPage,
      view: UsdfIngestDetailsPage,
      create: null,
    },
  },
});
