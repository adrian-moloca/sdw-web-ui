export const LOAD = 'home/LOAD';
export const SESSION_STORAGE = {
  GO_TO_LINK: 'GO_TO_LINK',
  CODE_VERIFIER: 'CODE_VERIFIER',
  AUTHORIZATION_USER_KEY: 'AUTHORIZATION_USER_KEY',
  AUTHORIZATION_CODE: 'AUTHORIZATION_CODE',
  AUTHORIZATION_USER_TOKEN: 'AUTHORIZATION_USER_TOKEN',
};

export enum SECURITY_SCOPE {
  CONSOLIDATION = 'CONSOLIDATION_SERVICE',
  INGEST = 'INGEST_SERVICE',
  READER = 'DATA_READER',
  DATA = 'DATA_SERVICE',
}
export enum SECURITY_GROUP {
  SDW_ADMIN = 'SDW_ADMIN',
  SDW_VIEWER = 'SDW_VIEWER',
  SDW_EDITOR = 'SDW_EDITOR',
  SDW_INGEST = 'SDW_INGEST',
  GDS_VIEWER = 'SDW_GDS_VIEWER',
  GDS_EDITOR = 'SDW_GDS_EDITOR',
  GDS_ADMIN = 'SDW_GDS_ADMIN',
}

// File type to download in out system (user in tracking system)
export const FILE_TYPES = {
  XML: 'xml',
  JSON: 'json',
  TXT: 'txt',
};

// Server keys
export const EXTERNAL_KEYS = {
  INGEST_ORGANISATION: 'ingestOrganisation',
  ID_TYPE: 'idType',
  ID_NUMBER: 'idNumber',
};
export const TRACKING_SYSTEM_INGEST_TYPE = {
  ODF: 'ODF',
  USDF: 'USDF',
};
// INGEST TYPE user in tracking system
export const INGEST_TYPE = {
  ODF: 'ODF',
  USDF: 'USDF',
};
// Ingest file types
export const INGEST_TYPE_FILE_TYPES = {
  [INGEST_TYPE.ODF]: FILE_TYPES.XML,
  [INGEST_TYPE.USDF]: FILE_TYPES.JSON,
};
// Server Layers used in Tracking system
export const LAYER = {
  EXTERNAL: 'EXTERNAL',
  PRODUCTION: 'PRODUCTION',
};

// Server Layers Names used in Tracking system
export const LAYER_NAME = {
  [LAYER.EXTERNAL]: 'EXT',
  [LAYER.PRODUCTION]: 'PROD',
};

export const TRIGGER_LOADING = 'loading/TRIGGER';
export const SHOW = 'loading/SHOW';
export const HIDE = 'loading/HIDE';
