export const UI_RELEASE_VERSION = import.meta.env.VITE_VERSION as string;
export const apiConfig = {
  clientId: 'sdw_ui',
  version: import.meta.env.VITE_VERSION ?? '1.9.1',
  edition: 'OG2026',
  apiEndPoint: import.meta.env.VITE_API_HOST as string,
  masterDataEndPoint: `${import.meta.env.VITE_API_HOST}/md`,
  sandboxEndpoint: `${import.meta.env.VITE_API_HOST}/cm-service`,
  consolidationEndPoint: `${import.meta.env.VITE_API_HOST}/usdm-consolidation`,
  consolidationSignalREndPoint: `${import.meta.env.VITE_API_HOST}/usdm-consolidation/hubs/consolidation`,
  usdmModelEndPoint: `${import.meta.env.VITE_API_HOST}/usdm-model`,
  reportEndPoint: `${import.meta.env.VITE_API_HOST}/sdw-reports`,
  reportManagerEndPoint: `${import.meta.env.VITE_API_HOST}/sdw-reports/api/manager`,
  extractorEndPoint: `${import.meta.env.VITE_API_HOST}/sdw-reports/api`,
  biographiesManagerEndPoint: `${import.meta.env.VITE_API_HOST}/sdw-reports/api/biographies`,
  reportSignalREndPoint: `${import.meta.env.VITE_API_HOST}/sdw-reports/hubs/reports`,
  apiUsdmEndPoint: `${import.meta.env.VITE_API_HOST}/usdm/v1`,
  ingestSignalREndPoint: `${import.meta.env.VITE_API_HOST}/data-ingest/hubs/data-ingest`,
  toolsEndPoint: `${import.meta.env.VITE_API_HOST}/tools`,
  gdsUsdmEndpoint: `${import.meta.env.VITE_GDS_API}/usdm-model`,
  gdsReportEndpoint: `${import.meta.env.VITE_GDS_API}/reports/v${import.meta.env.VITE_GDS_VERSION}`,
  gdsEndpoint: import.meta.env.VITE_GDS_API as string,
  webEndpoint: import.meta.env.VITE_WEB_HOST as string,
  authEndpoint: `${import.meta.env.VITE_API_HOST}/xauth`,
  forgeRockRealm: import.meta.env.VITE_FORGEROCK_REALM as string,
  disciplinesIconEndPoint:
    'https://gstatic.olympics.com/s1/t_1-1_64/static/light/pictograms/2022/{0}.svg',
  flagIso2EndPoint: 'https://gstatic.olympics.com/s1/f_auto//static/flag/4x3/{0}.svg',
  flagIso3EndPoint: 'https://gstatic.olympics.com/s3/noc/oly/3x2/{0}.png',
};
const editorProps = {
  environmentIsProduction:
    apiConfig.forgeRockRealm.toLowerCase() == 'production' ||
    apiConfig.forgeRockRealm.toLowerCase() == 'prod' ||
    apiConfig.forgeRockRealm.toLowerCase() == 'pro',
  environmentWithoutGds:
    apiConfig.forgeRockRealm.toLowerCase() == 'live' ||
    apiConfig.forgeRockRealm.toLowerCase() == 'ee2' ||
    apiConfig.forgeRockRealm.toLowerCase() == 'ee3' ||
    apiConfig.forgeRockRealm.toLowerCase() == 'og2024',
  AUTH_PATH: `/auth/oauth2/realms/root/realms/${apiConfig.forgeRockRealm}/access_token`,
  AUTH_REDIRECT: `/auth/oauth2/realms/root/realms/${apiConfig.forgeRockRealm}/authorize`,
  AUTH_REDIRECT_XUI: `/auth/XUI/?realm=/${apiConfig.forgeRockRealm}&goto=${apiConfig.apiEndPoint}/auth/oauth2/authorize`,
  AUTH_USER_SETTINGS: `${apiConfig.apiEndPoint}/auth/XUI/?realm=/${apiConfig.forgeRockRealm}`,
  AUTH_LOGOUT: '/auth/json/sessions?_action=logout',
  SESSIONS_URL: '/json/realms/sdw/sessions',
  AUTH_TOKEN_KEY: 'Authorization',
  AUTH_TOKEN_COOKIE_NAME: 'iPlanetDirectoryPro',
  CONSOLIDATION: '/usdm-consolidation',
  CONSOLIDATION_EDIT_FIELDS: '/edit-fields',
  CONSOLIDATION_UPSTREAMS: '/consolidation-requests/upstreams',
  CONSOLIDATION_MERGE_REQUESTS: '/consolidation-requests',
  CONSOLIDATION_MERGE_REQUESTS_CREATE: '/consolidation-requests',
  CONSOLIDATION_MERGE_REQUESTS_CONFIRM: '/consolidation-requests/confirm',
  CONSOLIDATION_MERGE_REQUESTS_UPDATE: '/consolidation-requests/update',
  CONSOLIDATION_MERGE_REQUESTS_REJECT: '/consolidation-requests/reject',
  CONSOLIDATION_MERGE_REQUESTS_APPROVE: '/consolidation-requests/approve',
  CONSOLIDATION_MERGE_REQUESTS_DEDUPLICATION: '/deduplication/processor',
  CONSOLIDATION_HARMONIZE: '/harmonize',
  CONSOLIDATION_MERGE_REQUESTS_CANCEL: '/consolidation-requests/cancel/',
  CONSOLIDATION_MERGE_REQUESTS_DETACH: '/consolidation-requests/detach/',
  CONSOLIDATION_MERGE_REQUESTS_SPLIT: '/request/split',
  TRACKING_SYSTEM_INGEST_ODF: '/log-service/odf',
  TRACKING_SYSTEM_INGEST_ODF_STATS: '/log-service/v1/stats/odf',
  TRACKING_SYSTEM_INGEST_USDF: '/log-service/usdf',
  TRACKING_SYSTEM_INGEST_USDM: '/log-service/v1/usdm',
  TRACKING_SYSTEM_INGEST_USDF_Output: '/log-service/v1/usdf',
  TRACKING_SYSTEM_ENTITY: '/log-service/entities',
  TRACKING_SYSTEM_DOWNLOAD_LOG: '/log-service/v1/logs/{0}/download',
  EVENT_BREAKDOWN: '/usdf/v2/events/{0}/breakdown',
  EVENT_EXTENDED: '/usdf/v2/events/{0}/extended',
};

const props = {
  ...editorProps,
  DEFAULT_LOCALE: 'en',
  CONSOLIDATION_REQUEST_CRUD: '/consolidation-requests/',
  CONSOLIDATION_ROOT: '/usdm-consolidation',
  CONSOLIDATION_MERGE_CONFLICT_CHECK: '/consolidation-requests/entity/:ids',
  LOGOUT_URL: '/auth/XUI/logout/',
  CHANGE_PASSWORD_URL: '/auth/XUI/#profile/password',
};

const appConfig = {
  ...props,
  ...apiConfig,
};

export default appConfig;
