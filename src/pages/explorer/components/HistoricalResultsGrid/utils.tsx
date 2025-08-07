import { isNullOrEmpty } from '_helpers';
import baseConfig from 'baseConfig';
import { t } from 'i18next';
import get from 'lodash/get';
import { ColumnData } from 'models';

export function getHistoricalResultsColumnData(
  data: any[],
  canEdit: boolean,
  hideCompetition?: boolean
): ColumnData[] {
  const hasMedal = data.some((item) => !isNullOrEmpty(get(item, 'roundsResult.medal')));
  const hasTeam = data.some((item) => get(item, 'roundsResult.competitorType') === 'TEAM');
  const hasStatus = data.some((item) => !isNullOrEmpty(get(item, 'roundsResult.result.status')));
  const hasResult = data.some(
    (item) =>
      !isNullOrEmpty(get(item, 'roundsResult.result.value')) ||
      !isNullOrEmpty(get(item, 'roundsResult.result.irm'))
  );
  const resultColumn: ColumnData = {
    width: 100,
    label: t('general.result'),
    dataKey: 'result',
    align: 'right',
  };
  const columns: ColumnData[] = [
    { width: 440, label: t('general.competition'), dataKey: 'competition', flex: 1 },
    { width: 100, label: t('general.noc'), dataKey: 'organisation' },
    { width: 210, label: t('general.event'), dataKey: 'event' },
    { width: hasMedal ? 70 : 60, label: t('general.rank'), dataKey: 'rank', align: 'right' },
    ...(hasResult ? [resultColumn] : []),
    { width: 160, label: t('general.date'), dataKey: 'date' },
    ...(hasTeam ? [{ width: 160, label: t('general.team'), dataKey: 'team' }] : []),
    { width: 180, label: t('general.location'), dataKey: 'location' },
    ...(hasStatus ? [{ width: 100, label: t('common.status'), dataKey: 'status' }] : []),
  ];
  if (canEdit) columns.push({ width: 90, label: '', command: true, dataKey: 'edit' });
  if (hideCompetition === true) return columns.slice(1);
  return columns;
}
export function calculatedHeight(totalRows: number): number | undefined {
  const result =
    totalRows * (baseConfig.defaultRowHeight ?? 36) + (baseConfig.defaultColumnHeaderHeight ?? 40);
  return result < 900 ? undefined : 800;
}
