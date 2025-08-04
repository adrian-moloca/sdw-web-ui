import { Loadable } from 'components/Loadable';
import { EntityType, IConfigProps } from 'models';
import { lazy } from 'react';

const CompetitionPage = Loadable(lazy(() => import('pages/explorer/index/CompetitionPage')));
const HorsePage = Loadable(lazy(() => import('pages/explorer/index/HorsePage')));
const NocPage = Loadable(lazy(() => import('pages/explorer/index/NocPage')));
const OrganizationPage = Loadable(lazy(() => import('pages/explorer/index/OrganizationPage')));
const PersonPage = Loadable(lazy(() => import('pages/explorer/index/PersonPage')));
const TeamPage = Loadable(lazy(() => import('pages/explorer/index/TeamPage')));
const VenuePage = Loadable(lazy(() => import('pages/explorer/index/VenuePage')));

const CompetitionDetailsPage = Loadable(
  lazy(() => import('pages/explorer/details/CompetitionDetailsPage'))
);
const DisciplineDetailsPage = Loadable(
  lazy(() => import('pages/explorer/details/DisciplineDetailsPage'))
);
const EventDetailsPage = Loadable(lazy(() => import('pages/explorer/details/EventDetailsPage')));
const HorseDetailsPage = Loadable(lazy(() => import('pages/explorer/details/HorseDetailsPage')));
const NocDetailsPage = Loadable(lazy(() => import('pages/explorer/details/NocDetailsPage')));
const OrganisationDetailsPage = Loadable(
  lazy(() => import('pages/explorer/details/OrganisationDetailsPage'))
);
const PersonDetailsPage = Loadable(lazy(() => import('pages/explorer/details/PersonDetailsPage')));
const TeamDetailsPage = Loadable(lazy(() => import('pages/explorer/details/TeamDetailsPage')));
const VenueDetailsPage = Loadable(lazy(() => import('pages/explorer/details/VenueDetailsPage')));

export const getExplorerEntities = (modelConfig: Record<EntityType, IConfigProps>) => ({
  [EntityType.Competition]: {
    path: modelConfig[EntityType.Competition].path,
    pages: {
      index: CompetitionPage,
      view: CompetitionDetailsPage,
      create: null,
    },
  },
  [EntityType.Horse]: {
    path: modelConfig[EntityType.Horse].path,
    pages: {
      index: HorsePage,
      view: HorseDetailsPage,
      create: null,
    },
  },
  [EntityType.Person]: {
    path: modelConfig[EntityType.Person].path,
    pages: {
      index: PersonPage,
      view: PersonDetailsPage,
      create: null,
    },
  },
  [EntityType.Team]: {
    path: modelConfig[EntityType.Team].path,
    pages: {
      index: TeamPage,
      view: TeamDetailsPage,
      create: null,
    },
  },
  [EntityType.Venue]: {
    path: modelConfig[EntityType.Venue].path,
    pages: {
      index: VenuePage,
      view: VenueDetailsPage,
      create: null,
    },
  },
  [EntityType.Organization]: {
    path: modelConfig[EntityType.Organization].path,
    pages: {
      index: OrganizationPage,
      view: OrganisationDetailsPage,
      create: null,
    },
  },
  [EntityType.Noc]: {
    path: modelConfig[EntityType.Noc].path,
    pages: {
      index: NocPage,
      view: NocDetailsPage,
      create: null,
    },
  },
  [EntityType.Discipline]: {
    path: modelConfig[EntityType.Discipline].path,
    pages: {
      index: null,
      view: DisciplineDetailsPage,
      create: null,
    },
  },
  [EntityType.Event]: {
    path: modelConfig[EntityType.Event].path,
    pages: {
      index: null,
      view: EventDetailsPage,
      create: null,
    },
  },
});
