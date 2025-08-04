import { GridColDef } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import {
  BreakdownItem,
  CodeNameDefinition,
  PointBreakdownData,
  PointPropertyDefinition,
} from './types';
import get from 'lodash/get';

interface RowItem {
  id: string;
  code: string;
  [key: string]: any; // Allows for dynamic properties like round.code
}

export const getPointsBreakdownTableData = (
  pointsBreakdown: PointBreakdownData
): { columns: GridColDef[]; rows: RowItem[] } => {
  if (!pointsBreakdown) return { columns: [], rows: [] };
  const hasRounds = pointsBreakdown.rounds && pointsBreakdown.rounds.length > 0;
  const hasCategories = pointsBreakdown.categories && pointsBreakdown.categories.length > 0;

  if (hasRounds && !hasCategories) {
    const columns: GridColDef[] = [
      {
        field: 'code',
        headerName:
          pointsBreakdown.type == 'ROUTINE' || pointsBreakdown.type == 'SPEED'
            ? ''
            : t('general.points'),
        width: 100,
        sortable: false,
      },
      ...pointsBreakdown.rounds.map((round: CodeNameDefinition) => ({
        field: round.code,
        headerName: round.title,
        width: 80,
        sortable: false,
      })),
    ];

    const rows = pointsBreakdown.properties.map((row: PointPropertyDefinition) => {
      const item: RowItem = {
        id: row.field,
        code: row.title,
      };
      pointsBreakdown.breakdown.forEach((e: BreakdownItem) => {
        item[e.round ?? e.category ?? 'code'] = get(e, row.field) ?? undefined;
      });
      return item;
    });
    return { columns, rows };
  } else if (!hasRounds && hasCategories) {
    const columns: GridColDef[] = [
      {
        field: 'code',
        headerName:
          pointsBreakdown.type == 'ROUTINE' || pointsBreakdown.type == 'SPEED'
            ? ''
            : t('general.apparatus'),
        width: 140,
        flex: pointsBreakdown.type == 'ROUTINE' ? undefined : 1,
        sortable: false,
      },
      ...pointsBreakdown.properties.map((property: PointPropertyDefinition) => ({
        field: property.field,
        headerName: property.title,
        width: getColumnWidth(property.title),
        sortable: false,
      })),
    ];
    const rows = pointsBreakdown.categories.map((category: CodeNameDefinition) => {
      const item: RowItem = {
        id: category.code,
        code: category.title,
      };
      pointsBreakdown.properties.forEach((e: PointPropertyDefinition) => {
        const itemValue = pointsBreakdown.breakdown.find(
          (b: BreakdownItem) => b.category === category.code
        );
        item[e.field] = get(itemValue, e.field) ?? undefined;
      });
      return item;
    });
    return { columns, rows };
  }
  return { columns: [], rows: [] };
};

export const getColumnWidth = (
  field: string,
  charWidth: number = 10,
  minWidth: number = 80,
  extraWidth: number = 0
): number => {
  const maxLength = field.length;
  return Math.max(minWidth, maxLength * charWidth) + extraWidth;
};
