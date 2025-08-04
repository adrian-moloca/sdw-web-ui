import { useCallback } from 'react';
import get from 'lodash/get';
import countBy from 'lodash/countBy';
import maxBy from 'lodash/maxBy';
import { ColumnData, ExtendedResultMetric, MasterData } from 'models';
import { t } from 'i18next';
import { formatMasterCode, isNullOrEmpty } from '_helpers';
import { useMediaQuery } from '@mui/material';
import { useStoreCache } from './useStoreCache';
import uniqBy from 'lodash/uniqBy';

interface ValidateResultParams {
  dataset: any[];
  field: string;
  direct?: boolean;
}

interface Props {
  getText: (type: string) => string;
  getDataSetText: (param: ValidateResultParams) => any;
  validateResult: (param: ValidateResultParams) => any;
  buildResultColumnData: (
    dataset: any[],
    discipline: string,
    field?: string,
    direct?: boolean,
    lastResult?: boolean
  ) => ColumnData[];
  buildExtendedColumnData: (dataset: Array<any>, field?: string) => ColumnData[];
  formatLastRound: (e: string | undefined, short: boolean) => string | null;
  hasExpandedResultsPanel: (dataset: Array<any>, isMobile: boolean) => boolean;
  hasExtendedResults: (
    data: any,
    isMobile: boolean
  ) => { hasExtended: boolean; justFewMetrics: boolean };
  getVisibleMetrics: (data: any, isMobile: boolean) => any[];
  extendedResultMetrics: ExtendedResultMetric[];
  supportsBrackets: (discipline: string) => boolean;
}
export function useResults(): Props {
  const { getMasterDataValue } = useStoreCache();
  const textMap: Record<string, string> = {
    TIME: t('general.time'),
    SC_REST$TIME: t('general.time'),
    DISTANCE: t('general.distance'),
    SC_REST$DISTANCE: t('general.distance'),
    SPEED: t('general.speed'),
    SC_REST$SPEED: t('general.speed'),
    WEIGHT: t('general.weight'),
    SC_REST$WEIGHT: t('general.weight'),
    RANK: t('general.rank'),
    SC_REST$RANK: t('general.rank'),
    IRM: t('general.irm'),
    SC_REST$IRM: t('general.irm'),
    SETS: t('general.sets'),
    SC_REST$SETS: t('general.sets'),
    POINTS: t('general.points'),
    SC_REST$POINTS: t('general.points'),
    SCORE: t('general.score'),
    SC_REST$SCORE: t('general.score'),
    STROKES: t('general.strokes'),
    SC_REST$STROKES: t('general.strokes'),
  };
  const getText = useCallback((value: string): string => {
    return textMap[value] ?? t('general.result');
  }, []);
  const getDataSetText = useCallback((param: ValidateResultParams): string => {
    const { dataset: data, field, direct } = param;
    const getPath = (suffix: string) => (direct ? suffix : `${field}.${suffix}`);
    const valueTypes = data
      .map((e) => getText(get(e, getPath('valueType'))))
      .filter((vt) => !vt.endsWith('IRM'));
    const mostCommonValueType =
      maxBy(Object.entries(countBy(valueTypes)), ([, count]) => count)?.[0] ?? '';
    return mostCommonValueType;
  }, []);
  const validateResult = useCallback((param: ValidateResultParams): any => {
    const { dataset: data, field, direct } = param;
    const getPath = (suffix: string) => (direct ? suffix : `${field}.${suffix}`);
    const subResultsCount = Math.max(
      ...data.map((e) => {
        const results = get(e, getPath('results'));
        return Array.isArray(results)
          ? results.filter((r) => r?.value !== undefined && r?.value !== null).length
          : 0;
      }),
      0
    );

    return {
      hasRank: data.some((e) => get(e, getPath('rank')) !== undefined),
      hasBib: data?.some((x) => x.bib),
      hasTeamPenalties: data.some(
        (e) => get(e, getPath('extensions.extendedResult.teamPenalties')) !== undefined
      ),
      hasLaps: data.some((e) => get(e, getPath('extensions.extendedResult.laps')) !== undefined),
      hasSpeed: data.some((e) => get(e, getPath('extensions.extendedResult.speed')) !== undefined),
      hasDistance: data.some(
        (e) => get(e, getPath('extensions.extendedResult.distance')) !== undefined
      ),
      hasResult: data.some(
        (e) =>
          get(e, getPath('value')) !== undefined ||
          get(e, getPath('extendedInfo.extendedRanking.value')) !== undefined ||
          get(e, getPath('extendedInfo.extendedResult.detailScore')) !== undefined
      ),
      isDetailScore: data.some(
        (e) =>
          get(e, getPath('value')) === undefined &&
          get(e, getPath('extendedInfo.extendedRanking.value')) === undefined &&
          get(e, getPath('extendedInfo.extendedResult.detailScore')) !== undefined
      ),
      hasIrm: data.some((e) => get(e, getPath('irm')) !== undefined),
      hasDiff: data.some((e) => get(e, getPath('diff'))),
      hasFor: data.some((e) => get(e, getPath('for'))),
      hasAgainst: data.some((e) => get(e, getPath('against'))),
      hasWlt: data.some((e) => get(e, getPath('wlt')) !== undefined),
      hasLost: data.some((e) => get(e, getPath('lost')) !== undefined),
      hasPlayed: data.some((e) => get(e, getPath('played')) !== undefined),
      hasWon: data.some((e) => get(e, getPath('won')) !== undefined),
      hasTied: data.some((e) => get(e, getPath('tied')) !== undefined),
      hasPenalty: data.some((e) => get(e, getPath('penalty')) !== undefined),
      hasSubResults: subResultsCount > 0 && subResultsCount < 5,
      hasParticipants: data.some((e) => (get(e, 'participants')?.length ?? 0) > 0),
      hasFrameResults: data.some((e) => get(e, getPath('frameTable')) !== undefined),
      hasRecords: data.some(
        (e) => Array.isArray(get(e, getPath('records'))) && get(e, getPath('records')).length > 0
      ),
      hasExtendedResults: data.some(
        (e) =>
          (Object.keys(get(e, getPath('extendedInfo.odfExtensions.extended')) ?? {}).length ?? 0) >
          0
      ),
      maxSubResultsLength: subResultsCount,
      hasQualification: data.some((e) => !isNullOrEmpty(get(e, getPath('qualificationMark')))),
      hasPoints: data.some(
        (e) => get(e, getPath('extensions.extendedResult.points')) !== undefined
      ),
      hasOverallPoints: data.some(
        (e) => get(e, getPath('extensions.extendedResult.overallPoints')) !== undefined
      ),
      hasOverallRank: data.some(
        (e) => get(e, getPath('extensions.extendedResult.overallRank')) !== undefined
      ),
      hasLastRound: data.some((e) => get(e, getPath('lastRound')) !== undefined),
    };
  }, []);
  const getOrdinalSuffix = (num: number): string => {
    const s = num % 10;
    const t = num % 100;

    if (s === 1 && t !== 11) {
      return 'st';
    }
    if (s === 2 && t !== 12) {
      return 'nd';
    }
    if (s === 3 && t !== 13) {
      return 'rd';
    }
    return 'th';
  };
  const getSubResultLabel = useCallback(
    (dataset: Array<any>, discipline: string, index: number, totalRounds: number) => {
      if (discipline == 'SDIS$SJP') {
        if (totalRounds - 1 === index) return `${t('general.final')} ${t('general.round')}`;
        return `${index + 1}${getOrdinalSuffix(index + 1)} ${t('general.round')}`;
      }
      if (discipline == 'SDIS$FSK') {
        const elements = get(dataset[0], 'result.results', []);
        const title =
          elements[index]?.unit.title.split('-').length > 1
            ? elements[index]?.unit.title.split('-')[1].trim()
            : '';
        if (title) return title;
        if (totalRounds - 1 === index) return `${t('general.final')} ${t('general.round')}`;
        return `${index + 1}${getOrdinalSuffix(index + 1)} ${t('general.round')}`;
      }
      return `${t('general.run')} ${index + 1}`;
    },
    [t]
  );
  const buildResultColumnData = (
    dataset: Array<any>,
    discipline: string,
    field?: string,
    direct?: boolean,
    lastResult?: boolean
  ): ColumnData[] => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const effectiveField = field ?? 'result';
    const definition = validateResult({ dataset: dataset ?? [], field: effectiveField, direct });
    const resultText = getDataSetText({ dataset: dataset ?? [], field: effectiveField, direct });

    type ColumnConfig = {
      condition: boolean;
      column: ColumnData;
    };

    const subResultConfigs: ColumnConfig[] =
      definition.hasSubResults && !isMobile
        ? Array.from({ length: definition.maxSubResultsLength }, (_, i) => ({
            condition: true,
            column: {
              width: discipline == 'SDIS$FSK' ? 140 : 120,
              label: getSubResultLabel(dataset, discipline, i, definition.maxSubResultsLength),
              dataKey: `round_${i + 1}`,
              align: 'right',
            },
          }))
        : [];

    const columnConfigs: ColumnConfig[] = [
      {
        condition: definition.hasRank,
        column: {
          width: dataset?.some((e) => e.award) ? 90 : 60,
          label: t('general.rank'),
          dataKey: 'rank',
          align: 'center',
        },
      },
      {
        condition: definition.hasBib,
        column: {
          width: discipline == 'SDIS$STK' || discipline == 'SDIS$SSK' ? 85 : 60,
          label:
            discipline == 'SDIS$STK' || discipline == 'SDIS$SSK'
              ? t('general.helmet-number')
              : t('general.bib'),
          dataKey: 'bib',
          align: 'right',
        },
      },
      {
        condition: true,
        column: { width: 100, label: t('general.noc'), dataKey: 'organisation' },
      },
      {
        condition: true,
        column: {
          width: 200,
          label: t('common.name'),
          dataKey: 'competitor',
          flex: 1,
          minWidth: 160,
        },
      },
      {
        condition: false,
        column: { dataKey: 'order', label: '#', width: 50, align: 'right' },
      },
      {
        condition: definition.hasLaps,
        column: { width: 60, label: t('general.laps'), dataKey: 'laps', align: 'right' },
      },
      {
        condition: definition.hasTeamPenalties,
        column: {
          width: 130,
          label: t('general.team-penalties'),
          dataKey: 'teamPenalties',
          align: 'right',
        },
      },
      ...subResultConfigs,
      {
        condition: definition.hasResult || definition.hasIrm,
        column: {
          width: definition.isDetailScore ? 220 : 120,
          label:
            lastResult === true
              ? t('general.result')
              : definition.isDetailScore
                ? t('general.score')
                : resultText,
          dataKey: 'result',
          align: 'right',
        },
      },
      {
        condition: definition.hasRecords,
        column: { width: 110, label: t('general.record'), dataKey: 'record' },
      },
      {
        condition: definition.hasPlayed,
        column: { width: 80, label: t('general.played'), dataKey: 'played', align: 'right' },
      },
      {
        condition: definition.hasWon,
        column: { width: 80, label: t('general.won'), dataKey: 'won', align: 'right' },
      },
      {
        condition: definition.hasTied,
        column: { width: 80, label: t('general.tied'), dataKey: 'tied', align: 'right' },
      },
      {
        condition: definition.hasLost,
        column: { width: 80, label: t('general.lost'), dataKey: 'lost', align: 'right' },
      },
      {
        condition: definition.hasFor,
        column: { width: 80, label: t('general.for'), dataKey: 'for', align: 'right' },
      },
      {
        condition: definition.hasAgainst,
        column: { width: 80, label: t('general.against'), dataKey: 'against', align: 'right' },
      },
      {
        condition: definition.hasDiff && !isMobile,
        column: { width: 100, label: t('general.diff'), dataKey: 'diff', align: 'right' },
      },
      {
        condition: definition.hasPoints,
        column: { width: 80, label: t('general.points'), dataKey: 'points', align: 'right' },
      },
      {
        condition: definition.hasPenalty,
        column: { width: 80, label: t('general.penalty'), dataKey: 'penalty', align: 'right' },
      },
      {
        condition: definition.hasWlt,
        column: { width: 75, label: t('general.wlt'), dataKey: 'wlt' },
      },
      {
        condition: definition.hasLastRound && !isMobile,
        column: { width: 120, label: t('general.last-round'), dataKey: 'lastRound' },
      },
      {
        condition: definition.hasOverallPoints,
        column: {
          width: 85,
          label: t('general.overallPoints'),
          dataKey: 'overallPoints',
          align: 'right',
        },
      },
      {
        condition: definition.hasOverallRank,
        column: {
          width: 85,
          label: t('general.overallRank'),
          dataKey: 'overallRank',
          align: 'right',
        },
      },
      {
        condition: definition.hasQualification,
        column: {
          width: 220,
          label: t('general.qualificationMark'),
          dataKey: 'qualificationMark',
        },
      },
    ];

    return columnConfigs.filter((config) => config.condition).map((config) => config.column);
  };
  const hasExpandedResultsPanel = useCallback((data: Array<any>, isMobile: boolean) => {
    if (!data || data.length === 0) return false;
    const pointsBreakdown = data.some(
      (e) =>
        get(e, 'result.extensions.pointsBreakdown') !== undefined ||
        get(e, 'result.extensions.scoreBreakdown') !== undefined
    );
    const judgeCriteria = data.some((e) => get(e, 'result.extensions.judgeCriteria') !== undefined);
    const judgeScore = data.some((e) => get(e, 'result.extensions.judgeScore') !== undefined);
    const frameTable = data.some((e) => get(e, 'frameTable') !== undefined);
    const participants = data.some((e) => get(e, 'participants') !== undefined);
    const metrics = data.some((e) => getVisibleMetrics(e, isMobile).length > 0);
    return pointsBreakdown || judgeCriteria || judgeScore || frameTable || participants || metrics;
  }, []);

  const hasExtendedResults = useCallback(
    (data: any, isMobile: boolean): { hasExtended: boolean; justFewMetrics: boolean } => {
      const pointsBreakdown =
        get(data, 'result.extensions.pointsBreakdown') ??
        get(data, 'result.extensions.scoreBreakdown');
      const judgeCriteria = get(data, 'result.extensions.judgeCriteria');
      const judgeScore = get(data, 'result.extensions.judgeScore');
      const metrics = getVisibleMetrics(data, isMobile);
      const hasExtended = pointsBreakdown || judgeCriteria || judgeScore || metrics.length > 0;

      const justFewMetrics =
        !pointsBreakdown &&
        !judgeCriteria &&
        !judgeScore &&
        metrics.length > 0 &&
        metrics.length < 3;

      return { hasExtended, justFewMetrics };
    },
    []
  );
  const supportsBrackets = useCallback((discipline: string): boolean => {
    return !['SDIS$SSK', 'SDIS$STK'].includes(discipline);
  }, []);

  const getMetricFormattedValue = useCallback((extendedResult: any, key: string): string => {
    const value = extendedResult[key] ?? '-';
    if (key === 'lastRound') {
      return getMasterDataValue(value, MasterData.RoundType)?.value ?? '-';
    }
    return value;
  }, []);
  const getVisibleMetrics = useCallback((data: any, isMobile: boolean): any[] => {
    const extendedResult = get(data, 'result.extensions.extendedResult');
    if (!extendedResult) return [];
    const metrics = isMobile
      ? Object.keys(extendedResult)
          .filter((key) => !key.startsWith('proper') && !key.startsWith('$'))
          .map((key) => {
            const metricProperty = extendedResult.properties.find((m: any) => m.field === key);
            return {
              key: key,
              label: metricProperty?.title || key,
              formattedValue: getMetricFormattedValue(extendedResult, key),
              l: metricProperty?.l,
            };
          })
          .filter(Boolean)
      : Object.keys(extendedResult)
          .filter((key) => !key.startsWith('proper') && !key.startsWith('$'))
          .map((key) => {
            const metric = extendedResultMetrics.find((m) => m.field === key);
            if (metric) return null;
            const metricProperty = extendedResult.properties.find((m: any) => m.field === key);
            return {
              key: key,
              label: metricProperty?.title || key,
              formattedValue: getMetricFormattedValue(extendedResult, key),
              l: metricProperty?.l,
            };
          })
          .filter(Boolean);
    return metrics;
  }, []);

  const buildExtendedColumnData = (dataset: Array<any>, field?: string): ColumnData[] => {
    const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
    const columns: ColumnData[] = [];
    const getPath = (suffix: string) => (!field ? suffix : `${field}.${suffix}`);

    if (isMobile) return columns;

    extendedResultMetrics.forEach(({ field, label, width }) => {
      const hasMetric = dataset.some(
        (e) => get(e, getPath(`result.extensions.extendedResult.${field}`)) !== undefined
      );
      if (hasMetric) {
        columns.push({
          label,
          dataKey: field,
          align: 'right',
          width: width ?? 80,
        });
      }
    });
    return uniqBy(columns, 'dataKey');
  };
  const extendedResultMetrics: ExtendedResultMetric[] = [
    //{ field: 'worldRank', label: t('general.worldRank'), width: 130 },
    //{ field: 'personalBest', label: t('general.personalBest'), width: 125 },
    //{ field: 'seasonBest', label: t('general.seasonBest'), width: 125 },
    { field: 'distance', label: t('general.distance'), width: 100 },
    { field: 'speed', label: t('general.speed'), width: 100 },
    { field: 'totalArrows', label: t('general.totalArrows'), width: 100 },
    { field: 'averageArrows', label: t('general.averageArrows'), width: 100 },
    { field: 'reactTime', label: t('general.reactTime'), width: 120 },
    { field: 'difficulty', label: t('general.difficulty'), width: 100 },
    { field: 'execution', label: t('general.execution'), width: 100 },
    { field: 'impression', label: t('general.impression'), width: 110 },
    { field: 'element', label: t('general.element'), width: 100 },
    { field: 'maxSpeed', label: t('general.maxSpeed'), width: 110 },
    { field: 'averageScore', label: t('general.averageScore'), width: 130 },
    { field: 'time', label: t('general.time'), width: 100 },
    { field: 'dressagePenalty', label: t('general.totalPenalty'), width: 90 },
    { field: 'complete', label: t('general.complete'), width: 100 },
    { field: 'averageSpeed', label: t('general.averageSpeed'), width: 120 },
    { field: 'score', label: t('general.score'), width: 100 },
    { field: 'penalty', label: t('general.penalty'), width: 100 },
    { field: 'votes', label: t('general.votes'), width: 80 },
    { field: 'runAwaySpeed', label: t('general.runAwaySpeed'), width: 130 },
    { field: 'offset', label: t('general.offset'), width: 80 },
    { field: 'roundsComplete', label: t('general.roundsComplete'), width: 120 },
    { field: 'bonus', label: t('general.bonus'), width: 60 },
    { field: 'movement', label: t('general.movement'), width: 100 },
    { field: 'toPar', label: t('general.turnover'), width: 70 },
    { field: 'qualificationPoints', label: t('general.qualificationPoints'), width: 120 },
    { field: 'totalPoints', label: t('general.totalScore'), width: 120 },
    { field: 'technicalPoints', label: t('general.technicalPoints'), width: 100 },
    { field: 'classPoints', label: t('general.classPoints'), width: 100 },
    { field: 'fisPoints', label: t('general.points'), width: 100 },
    { field: 'cupPoints', label: t('general.cupPoints'), width: 100 },
    { field: 'speed', label: t('general.speed'), width: 80 },
    { field: 'distance', label: t('general.distance'), width: 80 },
    { field: 'ippon', label: t('extendedInfo.ippon'), width: 70 },
    { field: 'shido', label: t('extendedInfo.shido'), width: 70 },
    { field: 'wazaAri', label: t('extendedInfo.wazaAri'), width: 70 },
    { field: 'tieBreak', label: t('general.tieBreak'), width: 70 },
    { field: 'homeAway', label: t('extendedInfo.homeAway'), width: 70 },
    { field: 'challengesRemain', label: t('extendedInfo.challengesRemain'), width: 70 },
  ];

  const formatLastRound = (e: string | undefined, short: boolean) => {
    if (!e) return null;
    if (e === 'none') return null;
    if (short) {
      if (e.startsWith(MasterData.RoundType)) return formatMasterCode(e);
      if (e.length > 5) return e.substring(0, 1);
      return e;
    }
    if (e.startsWith(MasterData.RoundType)) {
      const roundType = getMasterDataValue(e, MasterData.RoundType);
      return roundType?.value ?? formatMasterCode(e);
    }
    const roundType = getMasterDataValue(`${MasterData.RoundType}$${e}`, MasterData.RoundType);
    return roundType?.value ?? e;
  };
  return {
    getText,
    getDataSetText,
    formatLastRound,
    validateResult,
    buildResultColumnData,
    buildExtendedColumnData,
    hasExpandedResultsPanel,
    hasExtendedResults,
    getVisibleMetrics,
    supportsBrackets,
    extendedResultMetrics,
  };
}
