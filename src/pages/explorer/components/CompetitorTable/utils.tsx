import { Stack, Typography } from '@mui/material';
import { GridComparatorFn } from '@mui/x-data-grid-pro';
import { formatAthleteName } from '_helpers';
import {
  RankResultChip,
  IrmResultChip,
  LastRoundChip,
  WltChip,
  QualificationChip,
  AwardChip,
  RecordChip,
  OrganisationChip,
  CompetitorChip,
} from 'components';
import get from 'lodash/get';
import { ColumnData, ExtendedResultMetric } from 'models';

export const valueGetter = (
  col: ColumnData,
  row: any,
  extendedResultMetrics: ExtendedResultMetric[]
) => {
  const result = get(row, 'result');

  const subResults = get(result, 'results');
  if (col.dataKey.startsWith('round_')) {
    const match = /^round_(\d+)$/.exec(col.dataKey);
    const roundIndex = match ? parseInt(match[1], 10) - 1 : -1;
    return subResults?.[roundIndex]?.value;
  }
  const extendedData = get(result, 'extensions.extendedResult');
  if (extendedResultMetrics.some((x) => x.field === col.dataKey)) {
    return get(extendedData, col.dataKey);
  }
  switch (col.dataKey) {
    case 'rank':
      return get(result, 'rank') ?? get(result, `extensions.extendedResult.placement`);
    case 'record':
      return get(result, 'records')
        ?.map((record: any) => record.level)
        .join(', ');
    case 'result':
      return (
        get(result, 'value') ??
        get(result, `extensions.extendedResult.points`) ??
        get(result, `extensions.extendedResult.detailScore`)
      );
    case 'lastRound':
      return get(result, 'lastRound');
    case 'teamPenalties':
      return get(result, 'extensions.extendedResult.teamPenalties');
    case 'laps':
      return get(result, 'extensions.extendedResult.laps');
    case 'speed':
      return get(result, 'extensions.extendedResult.speed');
    case 'distance':
      return get(result, 'extensions.extendedResult.distance');
    case 'wlt':
      return get(result, 'wlt');
    case 'qualificationMark':
      return get(result, 'qualificationMark');
    case 'overallPoints':
      return get(row, 'extensions.extendedResult.overallPoints');
    case 'overallRank':
      return get(row, 'extensions.extendedResult.overallRank');
    case 'points':
      return get(row, 'extensions.extendedResult.points');
    case 'award':
      return get(row, 'award');
    case 'organisation':
      return get(row, 'organisation.country');
    case 'competitor':
      return formatAthleteName(row);
    default:
      return get(result, col.dataKey) ?? get(row, col.dataKey);
  }
};

export const valueRender = (
  col: ColumnData,
  row: any,
  discipline: string,
  extendedResultMetrics: ExtendedResultMetric[]
) => {
  const result = get(row, 'result');
  const subResults = get(result, 'results');
  const valueType = get(result, 'valueType');
  const irm = get(result, 'irm');
  if (col.dataKey.startsWith('round_')) {
    const match = /^round_(\d+)$/.exec(col.dataKey);
    const roundIndex = match ? parseInt(match[1], 10) - 1 : -1;
    return (
      <RankResultChip
        irm=""
        value={subResults?.[roundIndex]?.value ?? null}
        rank={subResults?.[roundIndex]?.rank ?? null}
        valueType={valueType}
      />
    );
  }
  const displayValue = valueGetter(col, row, extendedResultMetrics) ?? '-';
  if (extendedResultMetrics.some((x) => x.field === col.dataKey)) {
    return <Typography textAlign={'right'}>{displayValue}</Typography>;
  }
  switch (col.dataKey) {
    case 'organisation':
      return <OrganisationChip data={row.organisation} extended={false} variant="body1" />;
    case 'competitor':
      return <CompetitorChip data={row} discipline={discipline} />;
    case 'result':
      return <IrmResultChip irm={irm} value={displayValue} valueType={valueType} inline />;
    case 'lastRound':
      return <LastRoundChip value={displayValue} short={false} />;
    case 'record':
      return <RecordChip value={get(result, 'records')} />;
    case 'wlt':
      return <WltChip value={displayValue} />;
    case 'qualificationMark':
      return <QualificationChip value={displayValue} />;
    case 'rank':
      return (
        <Stack direction={'row'} spacing={2} justifyContent={'center'}>
          <Typography>{displayValue}</Typography>
          <AwardChip data={get(row, 'award')} includeSpacing={true} />
        </Stack>
      );
    default:
      return <Typography textAlign={'right'}>{displayValue}</Typography>;
  }
};
/**
 * Helper function to extract the numeric part from a value.
 * Handles strings starting with '+' and standard numbers/numeric strings.
 * @param value The cell value (string or number).
 * @returns The numeric representation of the value, or NaN if not parsable.
 */
const extractNumericValue = (value: string | number): number => {
  if (typeof value === 'string' && value.startsWith('=')) {
    return parseFloat(value.substring(1));
  }
  return parseFloat(String(value));
};
/**
 * Custom sort comparator for ranking columns that may contain a '+' prefix.
 * Sorts based on the numeric value after stripping the '+' if present.
 * Handles NaN values by placing them at the end of the sort order.
 */
export const numericPrefixSortComparator: GridComparatorFn<string | number> = (v1, v2) => {
  const num1 = extractNumericValue(v1);
  const num2 = extractNumericValue(v2);
  if (isNaN(num1) && isNaN(num2)) {
    return 0; // Treat both as equal if neither are valid numbers
  }
  if (isNaN(num1)) {
    return 1; // Put NaN values at the end (for ascending sort)
  }
  if (isNaN(num2)) {
    return -1; // Put NaN values at the end (for ascending sort)
  }
  return num1 - num2; // Standard numeric comparison for ascending order
};
