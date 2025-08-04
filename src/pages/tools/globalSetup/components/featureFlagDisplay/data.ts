import { t } from 'i18next';
import { FlagMeta } from '../types';

export const getFlagDescriptions = (): Record<string, FlagMeta> => ({
  analyticModeEnabled: {
    label: t('flags.analyticModeEnabled.label'),
    description: t('flags.analyticModeEnabled.description'),
    group: t('global-setup.data-mode'),
    editable: true,
    order: 1,
  },
  productionModeEnabled: {
    label: t('flags.productionModeEnabled.label'),
    description: t('flags.productionModeEnabled.description'),
    group: t('global-setup.data-mode'),
    editable: true,
    order: 2,
  },
  automaticModeEnabled: {
    label: t('flags.automaticModeEnabled.label'),
    description: t('flags.automaticModeEnabled.description'),
    group: t('global-setup.data-mode'),
    editable: true,
    order: 3,
  },
  // canUseProduction: {
  //   label: t('flags.canUseProduction.label'),
  //   description: t('flags.canUseProduction.description'),
  //   group: t('global-setup.indicators'),
  //   editable: false,

  // },
  // shouldUseProduction: {
  //   label: t('flags.shouldUseProduction.label'),
  //   description: t('flags.shouldUseProduction.description'),
  //   group: t('global-setup.indicators'),
  //   editable: false,
  // },
  isViewSyncActive: {
    label: t('flags.isViewSyncActive.label'),
    description: t('flags.isViewSyncActive.description'),
    editable: false,
    group: t('global-setup.data-activity'),
    order: 4,
  },

  isDataIngestActive: {
    label: t('flags.isDataIngestActive.label'),
    description: t('flags.isDataIngestActive.description'),
    editable: false,
    group: t('global-setup.data-activity'),
    order: 5,
  },
  isDataWriteActive: {
    label: t('flags.isDataWriteActive.label'),
    description: t('flags.isDataWriteActive.description'),
    group: t('global-setup.data-activity'),
    editable: false,
    order: 6,
  },
  isGlobalViewSyncEnabled: {
    label: t('flags.isGlobalViewSyncEnabled.label'),
    description: t('flags.isGlobalViewSyncEnabled.description'),
    editable: true,
    group: t('global-setup.data-setup'),
    order: 7,
  },
  isDataWriteEnabled: {
    label: t('flags.isDataWriteEnabled.label'),
    description: t('flags.isDataWriteEnabled.description'),
    group: t('global-setup.data-setup'),
    editable: true,
    order: 8,
  },
  usdmCacheEnabled: {
    label: t('flags.usdmCacheEnabled.label'),
    description: t('flags.usdmCacheEnabled.description'),
    group: t('global-setup.data-setup'),
    editable: true,
    order: 9,
  },
  dataWriteAge: {
    label: t('flags.dataWriteAge.label'),
    description: t('flags.dataWriteAge.description'),
    group: t('global-setup.age-timespan'),
    moreThanMinutes: 5,
    lessThanMinutes: 5,
    editable: false,
    order: 10,
  },
  viewSyncCheckpointAge: {
    label: t('flags.viewSyncCheckpointAge.label'),
    description: t('flags.viewSyncCheckpointAge.description'),
    group: t('global-setup.age-timespan'),
    moreThanMinutes: 5,
    editable: false,
    order: 11,
  },

  viewEventAge: {
    label: t('flags.viewEventAge.label'),
    description: t('flags.viewEventAge.description'),
    group: t('global-setup.age-timespan'),
    editable: false,
    lessThanMinutes: 5,
    order: 12,
  },
});
