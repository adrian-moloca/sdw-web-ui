import React, { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Branding, type Navigation, NavigationItem } from '@toolpad/core';
import { IConfigProps, MenuFlagEnum, EntityType, EditionMode } from 'models';
import { RootState } from 'store';
import { RouteObject } from 'react-router-dom';
import { t } from 'i18next';
import AuthCallback from 'pages/general/auth/AuthCallback';
import GridViewIcon from '@mui/icons-material/GridView';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import ControlCameraOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import BedroomBabyOutlined from '@mui/icons-material/BedroomBabyOutlined';
import BusinessOutlined from '@mui/icons-material/BusinessOutlined';
import CallMergeOutlined from '@mui/icons-material/CallMergeOutlined';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import MilitaryTechOutlined from '@mui/icons-material/MilitaryTechOutlined';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import UpcomingOutlined from '@mui/icons-material/UpcomingOutlined';
import ViewInArOutlined from '@mui/icons-material/ViewInArOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import LogoSection from 'layout/components/logo.section';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import useModelDefinition from 'models/model.config';
import { Loadable, LazyLoader, ProtectedRoute } from 'components';
import { GridRowId } from '@mui/x-data-grid-pro';
import {
  getNMDashboardEntities,
  getBiographyEntities,
  getExplorerEntities,
  getIngestEntities,
  getToolsEntities,
} from '_helpers/routes';
import appConfig from 'config/app.config';

interface Props {
  navigation: Navigation;
  branding: Branding;
  appRoutes: Array<RouteObject>;
  baseRoutes: any;
  getIndexRoute: (type: EntityType) => string;
  getCreateRoute: (type: EntityType) => string;
  getDetailRoute: (type: EntityType, id: GridRowId) => string;
  getRoute: (type: EntityType, mode: EditionMode) => string | null;
}

const ReportDetailsPage = Loadable(
  lazy(() => import('pages/tools/reports/details/ReportDetailsPage'))
);
const ReportLiveViewerPage = Loadable(
  lazy(() => import('pages/tools/reports/liveGenerator/ReportLiveDetailsPage'))
);
const ReportLivePage = Loadable(
  lazy(() => import('pages/tools/reports/liveGenerator/ReportLivePage'))
);
const CompetitionStructurePage = Loadable(
  lazy(() => import('pages/ingestion/competition-structure/CompetitionStructurePage'))
);
const DataExtractionTool = Loadable(
  lazy(() => import('pages/reports-manager/extraction-tool/ParticipationTool'))
);
const NocExtractionTool = Loadable(
  lazy(() => import('pages/reports-manager/extraction-tool/NocTool'))
);
const StatisticsPage = Loadable(lazy(() => import('pages/explorer/index/StatisticsPage')));

const ReportsSettings = Loadable(
  lazy(() => import('pages/reports-manager/settings/ReportsSettings'))
);
const ReportPage = Loadable(lazy(() => import('pages/reports-manager/index/ReportPage')));
const DataScopeStatusPage = Loadable(
  lazy(() => import('pages/reports-manager/data-scope-status/DataScopeStatusPage'))
);
const InitMergeRequestPage = Loadable(
  lazy(() => import('pages/tools/consolidation/InitMergeRequestPage'))
);
const DataIngestPage = Loadable(lazy(() => import('pages/tools/dataIngest/DataIngestPage')));
const EslPage = Loadable(lazy(() => import('pages/biographies-manager/esl/StartListPage')));
const TermsPage = Loadable(lazy(() => import('pages/general/terms/TermsPage')));
const AccessRequestPage = Loadable(
  lazy(() => import('pages/tools/securityManager/components/AccessRequestPage/AccessRequestPage'))
);
const LicensePage = Loadable(lazy(() => import('pages/general/license/LicensePage')));
const SecurityInfoPage = Loadable(lazy(() => import('pages/general/security/SecurityInfoPage')));
const GlobalSetupPage = Loadable(lazy(() => import('pages/tools/globalSetup')));
const SecurityManager = Loadable(lazy(() => import('pages/tools/securityManager')));
const LandingPage = Loadable(lazy(() => import('pages/general/landing-page/LandingPage')));
const DocPage = Loadable(lazy(() => import('pages/general/docs/DocPage')));
const HelpPage = Loadable(lazy(() => import('pages/general/help/HelpPage')));
const SupportPage = Loadable(lazy(() => import('pages/general/support/SupportPage')));

const useAppRoutes = (): Props => {
  const { modelConfig } = useModelDefinition();
  const currentProfile = useSelector((state: RootState) => state.auth.profile);
  const baseRoutes = {
    Home: '',
    Help: 'help',
    Support: 'support',
    AuthCallback: 'auth',
    BiographiesManager: 'biographies-manager',
    AccessRequest: 'access-request',
    Biographies: 'biographies-manager/biographies',
    Esl: 'biographies-manager/start-lists',
    Qualifiers: 'biographies-manager/qualifiers',
    ReportsManager: 'reports-manager',
    ReportsManagerSettings: 'reports-manager/settings',
    ReportControlPanel: 'reports-manager/control-panel',
    DataExtraction: 'reports-manager/extractor/participations',
    DataExtractionNoc: 'reports-manager/extractor/noc',
    Statistics: 'explorer/statistics',
    Reports: 'reports-manager/reports',
    ReportViewer: 'reports-manager/reports/viewer/:report/:name/:id/:key',
    GdsDashboards: 'reports-manager/gds-dashboards',
    LiveReports: 'reports-manager/reports/live',
    LiveReportViewer: 'reports-manager/reports/live/:id',
    ReportSetup: 'reports-manager/setup',
    Docs: 'documents',
    DataIngest: 'reports-manager/data-ingest',
    Security: 'security',
    CompetitionStructure: 'odf/competition-structure',
    InitMerge: 'tools/merge-requests/:id/:type',
    GlobalSetup: 'tools/global-setup',
    SecurityManager: 'tools/security-manager',
    Terms: 'terms-of-use',
    License: 'license',
    Contact: 'contact',
    SecurityInfo: 'security-info',
  };
  const baseAppRoutes: Array<RouteObject> = [
    { path: baseRoutes.Home, element: <LazyLoader component={LandingPage} /> },
    { path: baseRoutes.AuthCallback, element: <LazyLoader component={AuthCallback} /> },
    {
      path: baseRoutes.Reports,
      element: (
        <ProtectedRoute>
          <ReportPage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.GdsDashboards,
      element: (
        <ProtectedRoute>
          <DataScopeStatusPage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.ReportViewer,
      element: (
        <ProtectedRoute>
          <ReportDetailsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.DataExtraction,
      element: (
        <ProtectedRoute>
          <DataExtractionTool />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.DataExtractionNoc,
      element: (
        <ProtectedRoute>
          <NocExtractionTool />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.Statistics,
      element: (
        <ProtectedRoute>
          <StatisticsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.ReportsManagerSettings,
      element: (
        <ProtectedRoute>
          <ReportsSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.LiveReports,
      element: (
        <ProtectedRoute>
          <ReportLivePage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.LiveReportViewer,
      element: (
        <ProtectedRoute>
          <ReportLiveViewerPage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.Esl,
      element: (
        <ProtectedRoute>
          <EslPage />
        </ProtectedRoute>
      ),
    },
    { path: baseRoutes.Docs, element: <DocPage /> },
    { path: baseRoutes.Help, element: <HelpPage /> },
    {
      path: baseRoutes.Security,
      element: (
        <ProtectedRoute>
          <SecurityInfoPage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.GlobalSetup,
      element: (
        <ProtectedRoute>
          <GlobalSetupPage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.SecurityManager,
      element: (
        <ProtectedRoute>
          <SecurityManager />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.DataIngest,
      element: (
        <ProtectedRoute>
          <DataIngestPage />
        </ProtectedRoute>
      ),
    },
    { path: baseRoutes.AccessRequest, element: <LazyLoader component={AccessRequestPage} /> },
    { path: baseRoutes.Support, element: <LazyLoader component={SupportPage} /> },
    { path: baseRoutes.Contact, element: <LazyLoader component={SupportPage} /> },
    {
      path: baseRoutes.CompetitionStructure,
      element: (
        <ProtectedRoute>
          <CompetitionStructurePage />
        </ProtectedRoute>
      ),
    },
    {
      path: baseRoutes.InitMerge,
      element: (
        <ProtectedRoute>
          <InitMergeRequestPage />
        </ProtectedRoute>
      ),
    },
    { path: baseRoutes.Terms, element: <LazyLoader component={TermsPage} /> },
    { path: baseRoutes.License, element: <LazyLoader component={LicensePage} /> },
    { path: baseRoutes.SecurityInfo, element: <LazyLoader component={SecurityInfoPage} /> },
  ];

  function getIndexRoute(type: EntityType): string {
    return `/${getRoute(type, EditionMode.None)}`;
  }
  function getCreateRoute(type: EntityType): string {
    return `/${getRoute(type, EditionMode.Create)}`;
  }
  function getDetailRoute(type: EntityType, id: GridRowId): string {
    return `/${getRoute(type)}/${id}`;
  }
  const formatRoute = React.useCallback(
    (route: string, mode: EditionMode = EditionMode.None): string => {
      switch (mode) {
        case EditionMode.Create:
          return `${route}/new`;
        case EditionMode.Detail:
          return `${route}/:id`;
        case EditionMode.Update:
          return `${route}/:id/:type`;
        default:
          return route;
      }
    },
    []
  );
  const getConfig = React.useCallback((type: EntityType): IConfigProps => {
    return modelConfig[type];
  }, []);

  const getRoute = React.useCallback(
    (type: EntityType, mode: EditionMode = EditionMode.None): string | null => {
      const config = getConfig(type);
      if (config) return formatRoute(config.path, mode);
      return null;
    },
    []
  );

  const getNavigation = React.useCallback((type: EntityType): string => {
    const route = getRoute(type);

    if (
      [EntityType.QualifiedAthlete, EntityType.QualifiedHorse, EntityType.QualifiedTeam].includes(
        type
      )
    ) {
      return route!.replace(`${baseRoutes.Qualifiers}/`, '');
    }

    if (
      [
        EntityType.PersonBiography,
        EntityType.HorseBiography,
        EntityType.TeamBiography,
        EntityType.NocBiography,
      ].includes(type)
    ) {
      return route!.replace(`${baseRoutes.Biographies}/`, '');
    }

    return route!;
  }, []);

  function BuildEntityAppRoutes(): Array<RouteObject> {
    const entityPageMap = {
      ...getExplorerEntities(modelConfig),
      ...getBiographyEntities(modelConfig),
      ...getIngestEntities(modelConfig),
      ...getToolsEntities(modelConfig),
      ...getNMDashboardEntities(modelConfig),
    };
    const result = Object.entries(entityPageMap).flatMap(([, { path, pages }]) => {
      const routes: Array<RouteObject> = [];
      if (pages.index) {
        routes.push({
          path: formatRoute(path),
          element: (
            <ProtectedRoute>
              <pages.index />
            </ProtectedRoute>
          ),
        });
      }
      if (pages.view) {
        routes.push({
          path: formatRoute(path, EditionMode.Detail),
          element: (
            <ProtectedRoute>
              <pages.view />
            </ProtectedRoute>
          ),
        });
      }

      return routes;
    });
    return result;
  }
  const appRoutes = React.useMemo(() => [...baseAppRoutes, ...BuildEntityAppRoutes()], []);

  function buildNavigation(): Navigation {
    const isAdmin = (currentProfile.flags & MenuFlagEnum.Administrator) !== 0;
    const isConsolidation = (currentProfile.flags & MenuFlagEnum.Consolidation) !== 0;
    const isReportsSetup = (currentProfile.flags & MenuFlagEnum.ReportsSetup) !== 0;
    const basicMenus: NavigationItem[] = [
      { kind: 'header', title: 'Home' },
      { segment: baseRoutes.Home, title: 'Home', icon: <HomeOutlined /> },
    ];
    const explorerMenus: NavigationItem[] = [
      { kind: 'header', title: t('general.explorer') },
      {
        segment: getRoute(EntityType.Competition)!,
        title: t('general.competitions'),
        icon: <EmojiEventsOutlined />,
      },
      {
        segment: getRoute(EntityType.Person)!,
        title: t('general.persons'),
        icon: <PersonOutline />,
      },
      {
        segment: getRoute(EntityType.Horse)!,
        title: t('general.horses'),
        icon: <BedroomBabyOutlined />,
      },
      {
        segment: getRoute(EntityType.Team)!,
        title: t('general.teams'),
        icon: <PeopleAltOutlined />,
      },
      {
        segment: getRoute(EntityType.Organization)!,
        title: t('general.organisations'),
        icon: <BusinessOutlined />,
      },
      {
        segment: getRoute(EntityType.Noc)!,
        title: t('general.nocs'),
        icon: <AccountBalanceOutlined />,
      },
      {
        segment: getRoute(EntityType.Venue)!,
        title: t('general.venues'),
        icon: <LocationOnOutlined />,
      },
      {
        segment: baseRoutes.Statistics,
        title: t('navigation.Statistics'),
        icon: <QueryStatsOutlinedIcon />,
      },
    ];
    const toolsMenus: NavigationItem[] = [
      { kind: 'divider' },
      { kind: 'header', title: t('navigation.Tools') },
      {
        segment: getRoute(EntityType.Category)!,
        title: t('navigation.MasterData'),
        icon: <ViewInArOutlined />,
      },
      ...(isConsolidation
        ? [
            {
              segment: getRoute(EntityType.MergeRequest)!,
              title: t('navigation.MergeRequests'),
              icon: <CallMergeOutlined />,
            },
          ]
        : []),
      ...(isAdmin
        ? [
            {
              segment: baseRoutes.DataIngest,
              title: t('navigation.DataIngest'),
              icon: <CloudUploadOutlined />,
            },
            {
              segment: baseRoutes.GlobalSetup,
              title: t('navigation.globalSetup'),
              icon: <ControlCameraOutlinedIcon />,
            },
            {
              segment: baseRoutes.SecurityManager,
              title: t('navigation.SecurityManager'),
              icon: <GppGoodOutlinedIcon />,
            },
          ]
        : []),
    ];
    const ingestMenus: NavigationItem[] = [
      { kind: 'divider' },
      { kind: 'header', title: t('navigation.Ingest') },
      {
        segment: getRoute(EntityType.OdfIngest)!,
        title: t('navigation.OdfTrackingSystem'),
        icon: <UpcomingOutlined />,
      },
      {
        segment: getRoute(EntityType.UsdfIngest)!,
        title: t('navigation.UsdfTrackingSystem'),
        icon: <UpcomingOutlined />,
      },
      {
        segment: baseRoutes.CompetitionStructure,
        title: t('navigation.CompetitionStructure'),
        icon: <AccountTreeOutlined />,
      },
    ];
    const extractorMenus: NavigationItem[] = [
      { kind: 'divider' },
      { kind: 'header', title: t('navigation.Extractions') },
      {
        segment: baseRoutes.DataExtraction,
        title: t('navigation.participations'),
        icon: <EmojiEventsOutlined />,
      },
      {
        segment: baseRoutes.DataExtractionNoc,
        title: t('general.nocInformation'),
        icon: <AccountBalanceOutlined />,
      },
    ];
    const gamesTimerMenus: NavigationItem[] = [
      { kind: 'divider' },
      { kind: 'header', title: t('navigation.GamesTimeData') },
      {
        segment: baseRoutes.Qualifiers,
        title: t('navigation.Qualifiers'),
        icon: <MilitaryTechOutlined />,
        children: [
          {
            segment: getNavigation(EntityType.QualifiedAthlete),
            title: t('navigation.Persons'),
            icon: <PersonOutline />,
          },
          {
            segment: getNavigation(EntityType.QualifiedTeam),
            title: t('navigation.Teams'),
            icon: <PeopleAltOutlined />,
          },
          {
            segment: getNavigation(EntityType.QualifiedHorse),
            title: t('navigation.Horses'),
            icon: <BedroomBabyOutlined />,
          },
        ],
      },
    ];

    const reportingMenus: NavigationItem[] = [
      { kind: 'divider' },
      { kind: 'header', title: t('navigation.ReportsManager') },
      ...(isReportsSetup
        ? [
            {
              segment: baseRoutes.ReportsManagerSettings,
              title: t('navigation.ReportSetup'),
              icon: <SettingsOutlined />,
            },
          ]
        : []),
      ...(appConfig.forgeRockRealm === 'prod'
        ? []
        : [
            {
              segment: baseRoutes.GdsDashboards,
              title: t('navigation.GDSDashboards'),
              icon: <GridViewIcon />,
            },
          ]),
    ];
    const menus: NavigationItem[] = basicMenus;
    if (currentProfile.flags & MenuFlagEnum.Explorer) {
      menus.push(...explorerMenus);
    }
    if (currentProfile.flags & MenuFlagEnum.Explorer) {
      menus.push(...toolsMenus);
    }
    if (currentProfile.flags & MenuFlagEnum.Extractor) {
      menus.push(...extractorMenus);
    }
    if (currentProfile.flags & MenuFlagEnum.ReportsSetup) {
      menus.push(...reportingMenus);
    }
    if (currentProfile.flags & MenuFlagEnum.Ingest) {
      menus.push(...ingestMenus);
    }
    if (currentProfile.flags & MenuFlagEnum.GamesTimeInfo) {
      menus.push(...gamesTimerMenus);
    }
    return menus;
  }

  return {
    navigation: buildNavigation(),
    appRoutes,
    branding: {
      logo: <LogoSection />,
      title: '',
      homeUrl: '/',
    },
    baseRoutes,
    getIndexRoute,
    getCreateRoute,
    getDetailRoute,
    getRoute,
  };
};
export default useAppRoutes;
