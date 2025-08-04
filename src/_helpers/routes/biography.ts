import { lazy } from 'react';
import { Loadable } from 'components/Loadable';
import { EntityType, IConfigProps } from 'models';

const HeadToHeadPage = Loadable(
  lazy(() => import('pages/biographies-manager/index/HeadToHeadPage'))
);
const HorseBiographyPage = Loadable(
  lazy(() => import('pages/biographies-manager/index/HorseBiographyPage'))
);
const PersonBiographyPage = Loadable(
  lazy(() => import('pages/biographies-manager/index/PersonBiographyPage'))
);
const TeamBiographyPage = Loadable(
  lazy(() => import('pages/biographies-manager/index/TeamBiographyPage'))
);
const NocBiographyPage = Loadable(
  lazy(() => import('pages/biographies-manager/index/NocBiographyPage'))
);
const QualifiedAthletePage = Loadable(
  lazy(() => import('pages/biographies-manager/index/QualifiedAthletePage'))
);
const QualifiedTeamPage = Loadable(
  lazy(() => import('pages/biographies-manager/index/QualifiedTeamPage'))
);
const QualifiedHorsePage = Loadable(
  lazy(() => import('pages/biographies-manager/index/QualifiedHorsePage'))
);
const HeadToHeadDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/HeadToHeadDetailsPage'))
);
const HorseBiographyDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/HorseBiographyDetailsPage'))
);
const HorseBiographyCreatePage = Loadable(
  lazy(() => import('pages/biographies-manager/details/HorseBiographyCreatePage'))
);
const PersonBiographyDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/PersonBiographyDetailsPage'))
);
const PersonBiographyCreatePage = Loadable(
  lazy(() => import('pages/biographies-manager/details/PersonBiographyCreatePage'))
);
const TeamBiographyDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/TeamBiographyDetailsPage'))
);
const TeamBiographyCreatePage = Loadable(
  lazy(() => import('pages/biographies-manager/details/TeamBiographyCreatePage'))
);
const NocBiographyDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/NocBiographyDetailsPage'))
);
const NocBiographyCreatePage = Loadable(
  lazy(() => import('pages/biographies-manager/details/NocBiographyCreatePage'))
);
const QualifiedAthleteDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/QualifiedAthleteDetailsPage'))
);
const QualifiedTeamDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/QualifiedTeamDetailsPage'))
);
const QualifiedHorseDetailsPage = Loadable(
  lazy(() => import('pages/biographies-manager/details/QualifiedHorseDetailsPage'))
);

export const getBiographyEntities = (modelConfig: Record<EntityType, IConfigProps>) => ({
  [EntityType.HeadToHead]: {
    path: modelConfig[EntityType.HeadToHead].path,
    pages: {
      index: HeadToHeadPage,
      view: HeadToHeadDetailsPage,
      create: null,
    },
  },
  [EntityType.PersonBiography]: {
    path: modelConfig[EntityType.PersonBiography].path,
    pages: {
      index: PersonBiographyPage,
      view: PersonBiographyDetailsPage,
      create: PersonBiographyCreatePage,
    },
  },
  [EntityType.HorseBiography]: {
    path: modelConfig[EntityType.HorseBiography].path,
    pages: {
      index: HorseBiographyPage,
      view: HorseBiographyDetailsPage,
      create: HorseBiographyCreatePage,
    },
  },
  [EntityType.TeamBiography]: {
    path: modelConfig[EntityType.TeamBiography].path,
    pages: {
      index: TeamBiographyPage,
      view: TeamBiographyDetailsPage,
      create: TeamBiographyCreatePage,
    },
  },
  [EntityType.NocBiography]: {
    path: modelConfig[EntityType.NocBiography].path,
    pages: {
      index: NocBiographyPage,
      view: NocBiographyDetailsPage,
      create: NocBiographyCreatePage,
    },
  },
  [EntityType.QualifiedAthlete]: {
    path: modelConfig[EntityType.QualifiedAthlete].path,
    pages: {
      index: QualifiedAthletePage,
      view: QualifiedAthleteDetailsPage,
      create: null,
    },
  },
  [EntityType.QualifiedTeam]: {
    path: modelConfig[EntityType.QualifiedTeam].path,
    pages: {
      index: QualifiedTeamPage,
      view: QualifiedTeamDetailsPage,
      create: null,
    },
  },
  [EntityType.QualifiedHorse]: {
    path: modelConfig[EntityType.QualifiedHorse].path,
    pages: {
      index: QualifiedHorsePage,
      view: QualifiedHorseDetailsPage,
      create: null,
    },
  },
});
