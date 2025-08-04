type ConfigItem = {
  id: string;
  key: string;
  ts_: number;
};

type Flags = {
  analyticModeEnabled: boolean;
  isViewSyncActive: boolean;
  isGlobalViewSyncEnabled: boolean;
  dataWriteAge: string;
  viewSyncCheckpointAge: string;
  isDataWriteActive: boolean;
  viewEventAge: string;
};

export type GlobalSetup = {
  config: ConfigItem[];
  ingest: ConfigItem[];
  flags: Flags;
};
export type FlagMeta = {
  label: string;
  description: string;
  link?: string;
  group?: string;
  moreThanMinutes?: number;
  lessThanMinutes?: number;
  editable: boolean;
  order: number;
};
export type ProgressItem = {
  id: string;
  key: string;
  value: string;
  ts_: number;
};

export type ParsedValue = {
  done: boolean;
  config: {
    mode: string;
    noCache: boolean;
  };
  current: string;
};
