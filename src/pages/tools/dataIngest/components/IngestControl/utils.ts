import dayjs from 'dayjs';
import get from 'lodash/get';
import { ColumnData } from 'models';

export const valueGetter = (column: ColumnData, row: any) => {
  const totalCompetitions = get(row, 'totalCompetitions');
  switch (column.dataKey) {
    case 'type':
      return get(row, 'category');
    case 'numRecords':
      return totalCompetitions > 0
        ? `${get(row, 'totalRecords').toLocaleString()}/${get(row, 'totalCompetitions').toLocaleString()}`
        : `${get(row, 'totalRecords').toLocaleString()}`;
    case 'elapsed':
      return get(row, 'elapsedTime');
    case 'file':
      return row.fileNames?.join(', ') ?? '-';
    case 'date':
      return dayjs(get(row, 'startTime')).format('DD/MM/YY HH:mm:ss');
    default:
      return get(row, column.dataKey);
  }
};
