import { t } from 'i18next';

export function getChipLabel(flag: string, value: boolean): string {
  if (flag == 'canUseProduction' || flag == 'shouldUseProduction') {
    return value ? t('common.yes') : t('common.no');
  }
  if (flag == 'isViewSyncActive' || flag == 'isDataIngestActive' || flag == 'isDataWriteActive') {
    return value ? t('common.running') : t('common.not_running');
  }
  return value ? t('general.enabled') : t('general.disabled');
}
export function getChipColor(
  flag: string,
  value: boolean
): 'primary' | 'success' | 'error' | 'warning' | 'secondary' {
  if (flag == 'canUseProduction' || flag == 'shouldUseProduction') {
    return value ? 'success' : 'error';
  }
  if (flag == 'isViewSyncActive' || flag == 'isDataIngestActive' || flag == 'isDataWriteActive') {
    return value ? 'primary' : 'secondary';
  }
  return value ? 'success' : 'warning';
}
