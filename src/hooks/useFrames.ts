import { GridColDef, GridRowsProp } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import { isNumber, uniq } from 'lodash';
import get from 'lodash/get';
import { useExtendedInformation } from './useExtendedInformation';
import { isNullOrEmpty, parseTimeToSeconds } from '_helpers';
import { FrameChartData, FrameTable } from 'pages/explorer/components';

interface Props {
  parseIndexToFrameName: (index: number, name: string) => string;
  parseToFrameName: (index: number, discipline: string) => string;
  getFrameTitle: (index: number, discipline: string) => string;
  preferredValue: (index: number, discipline: string) => 'value' | 'totalValue';
  shouldShowFrames: (discipline: string) => boolean;
  shouldShowTotal: (discipline: string) => boolean;
  createFrameSeries: (frameTable: any, filterType: string) => any;
  getDynamicDataGridData: (
    frames: any[],
    pivotTableInfo: any,
    discipline: string,
    type: string,
    threshold: number
  ) => DataGridData;
}
interface DataGridData {
  columns: GridColDef[];
  rows: GridRowsProp;
}
export function useFrames(): Props {
  const { getLabels } = useExtendedInformation();
  const parseIndexToFrameName = (index: number, name: string) => {
    if (index === 0) {
      return `1st ${name}`;
    } else if (index === 1) {
      return `2nd ${name}`;
    }
    return `${name} Extra-Time ${index + 1 - 2}`;
  };
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

  const parseOrderedSet = (index: number, name: string): string => {
    const number = index + 1;
    const suffix = getOrdinalSuffix(number);
    return `${number}${suffix} ${name}`;
  };
  const parseToFrameName = (index: number, discipline: string) => {
    switch (discipline) {
      case 'SDIS$HOC':
        if (index > 3) return t('frame-names.shoot-out');
        return `Q${index + 1}`;
      case 'SDIS$BKB':
        if (index > 3) return `OT${index + 1 - 4}`;
        return `Q${index + 1}`;
      default:
        return `Q${index + 1}`;
    }
  };
  const preferredValue = (index: number, discipline: string) => {
    switch (discipline) {
      case 'SDIS$HOC':
        if (index > 3) return 'value';
        return 'totalValue';
      case 'SDIS$TEN':
      case 'SDIS$SRF':
      case 'SDIS$SBD':
        return 'totalValue';
      default:
        return 'value';
    }
  };
  const getFrameTitle = (index: number, discipline: string) => {
    switch (discipline) {
      case 'SDIS$VVO':
      case 'SDIS$VBV':
        return `${t('frame-names.set')} ${index + 1}`;
      case 'SDIS$TEN':
        return parseOrderedSet(index, t('frame-names.set'));
      case 'SDIS$WPO':
        return parseOrderedSet(index, t('frame-names.period'));
      case 'SDIS$FBL':
        if (index === 0) {
          return t('frame-names.half-time');
        } else if (index === 1) {
          return t('frame-names.regular-time');
        }
        return `${t('frame-names.half')} Extra-Time ${index + 1 - 2}`;

      case 'SDIS$RU7':
      case 'SDIS$RUG':
      case 'SDIS$HBL':
        return parseIndexToFrameName(index, t('frame-names.half'));
      case 'SDIS$BOX':
        return parseIndexToFrameName(index, t('frame-names.round'));
      case 'SDIS$BKG':
      case 'SDIS$FEN':
      case 'SDIS$TKW':
      case 'SDIS$WRE':
        return `${t('frame-names.round')} ${index + 1}`;
      case 'SDIS$BDM':
      case 'SDIS$TTE':
        return `${t('frame-names.game')} ${index + 1}`;
      default:
        return parseToFrameName(index, discipline);
    }
  };
  const shouldShowFrames = (discipline: string) => {
    return 'SDIS$BK3' !== discipline;
  };
  const shouldShowTotal = (discipline: string) => {
    return 'SDIS$VBV' !== discipline;
  };

  const getMaxTextWidth = (field: string, title: string, rows: any[], charWidth = 9): number => {
    const maxLength = Math.max(
      ...rows.map((row) => row[field]?.toString().length ?? 0),
      title.length
    );
    return Math.max(60, maxLength * charWidth) + 10; // 120 is the minimum width
  };
  const transformToPivotedLayout = (
    frames: any[],
    pivotTableInfo: any,
    discipline: string,
    type: string = 'ALL'
  ): DataGridData => {
    const FrameFieldLabels = getLabels('', false, discipline);
    const formatFrames = flattenExtensionsToArray(frames);
    const formatHeaders =
      type !== 'ALL'
        ? pivotTableInfo.headers.filter((header: any) => header.type === type)
        : pivotTableInfo.headers;
    const formatProperties = [
      ...flatFrameProperties(pivotTableInfo.properties, formatFrames.flattenedData),
      ...formatFrames.addedFields.map((x) => ({ name: x, title: x })),
    ];

    const rows: any[] = [];

    formatProperties.forEach((field: any, index: number) => {
      const rowId = `${field.name}_cel_${index}`;
      const newRow: any = {
        id: rowId,
        property:
          FrameFieldLabels[field.name] ?? FrameFieldLabels[field.name.toUpperCase()] ?? field.title,
      };
      formatHeaders.forEach((frame: any, headerIndex: number) => {
        const originalValue = get(formatFrames.flattenedData?.[headerIndex]?.result, field.name);
        if (typeof originalValue === 'string') {
          newRow[`cel_${frame.title}`] = originalValue.replace('"', '').replace('"', '');
        } else {
          newRow[`cel_${frame.title}`] = originalValue;
        }
      });
      rows.push(newRow);
    });

    const columns: GridColDef[] = [
      { field: 'property', headerName: '', width: 150, sortable: false, filterable: false },
    ];
    formatHeaders.forEach((frame: any) => {
      columns.push({
        field: `cel_${frame.title}`,
        headerName: frame.title,
        width: 150, // getMaxTextWidth(`cel_${frame.title}`, frame.title,rows),
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
      });
    });

    return { columns, rows };
  };
  /**
   * Filters an array of property objects, excluding those with the names 'extensions' or 'pos',
   * and retaining only properties that have a non-null, non-empty value in at least one of the provided formatFrames.
   *
   * @param properties - The array of property objects to filter.
   * @param formatFrames - An optional array of frame objects used to determine if a property should be included based on its value.
   * @returns An array of filtered property objects that meet the criteria.
   */
  const flatFrameProperties = (properties: any[], formatFrames?: any[]): any[] => {
    const filterProperties = properties.filter(
      (property: any) =>
        property.name !== 'extensions' &&
        property.name !== 'pos' &&
        formatFrames?.some((frame: any) => {
          const value = frame?.result?.[property.name];
          if (value !== null && value !== undefined) {
            const stringValue = String(value);
            return !isNullOrEmpty(stringValue.replace('"', '').replace('"', ''));
          }
          return false;
        })
    );
    return filterProperties;
  };
  const transformToHorizontalLayout = (
    frames: any[],
    pivotTableInfo: any,
    discipline: string,
    type: string = 'ALL'
  ): DataGridData => {
    const columns: GridColDef[] = [
      {
        field: 'headerTitle',
        headerName: t('general.frames'),
        width: getMaxTextWidth('title', t('general.frames'), pivotTableInfo.headers),
        sortable: false,
        filterable: false,
      },
    ];
    const formatFrames = flattenExtensionsToArray(frames);
    const formatProperties = [
      ...flatFrameProperties(pivotTableInfo.properties, formatFrames.flattenedData),
      ...formatFrames.addedFields.map((x) => ({ name: x, title: x })),
    ];
    const FrameFieldLabels = getLabels('', false, discipline);
    const rows: any[] = pivotTableInfo.headers
      .map((header: any, index: number) => {
        const row: any = {
          id: `${header.title}_cel_${index}`,
          headerTitle: header.title,
        };
        if (type !== 'ALL' && header.type !== type) {
          return null;
        }
        formatProperties.forEach((field: any, fieldIndex: number) => {
          const columnField = `${field.name}_cel_${fieldIndex}`;
          const originalValue = get(formatFrames.flattenedData?.[index].result, field.name);

          if (typeof originalValue === 'string') {
            row[columnField] = originalValue.replace('"', '').replace('"', '');
          } else {
            row[columnField] = originalValue;
          }
        });
        return row;
      })
      .filter(Boolean);
    formatProperties.forEach((field: any, index: number) => {
      const columnField = `${field.name}_cel_${index}`;
      const columnTitle =
        FrameFieldLabels[field.name] ?? FrameFieldLabels[field.name.toUpperCase()] ?? field.title;
      columns.push({
        field: columnField,
        headerName: columnTitle,
        width: getMaxTextWidth(columnField, columnTitle, rows),
        headerAlign: 'right',
        align: 'right',
        sortable: false,
        filterable: false,
      });
    });

    return { columns, rows };
  };

  /**
   * Generates dynamic data for a data grid based on the number of frames and a threshold.
   *
   * If the number of frames is less than or equal to the threshold, the data is transformed
   * into a pivoted layout. Otherwise, it is transformed into a horizontal layout.
   *
   * @param frames - An array of frame objects to be processed.
   * @param pivotTableInfo - Information required for pivot table transformation.
   * @param discipline - The discipline context for the transformation.
   * @param threshold - The maximum number of frames to use the pivoted layout (default is 6).
   * @returns The transformed data grid data.
   */
  const getDynamicDataGridData = (
    frames: any[],
    pivotTableInfo: any,
    discipline: string,
    type: string = 'ALL',
    threshold: number = 6
  ): DataGridData => {
    const originalFrames = frames; // Using 'columns' from your JSON as 'frames'
    if (originalFrames.length <= threshold) {
      return transformToPivotedLayout(originalFrames, pivotTableInfo, discipline, type);
    }
    return transformToHorizontalLayout(originalFrames, pivotTableInfo, discipline, type);
  };

  const createFrameSeries = (frameTable: FrameTable, filterType: string = 'ALL') => {
    const chartData: FrameChartData[] = [];
    frameTable.table.columns.forEach((col) => {
      const title = col.header.title;
      if (col.header.type === filterType) {
        if (col.cells?.[0]?.result !== undefined) {
          const rawValue =
            get(col.cells[0].result, 'value') ??
            get(col.cells[0].result, 'value2') ??
            get(col.cells[0].result, 'totalValue') ??
            '';
          let parsedValue: number | null = null;
          let isTimeValue = false;
          if (typeof rawValue === 'string' && rawValue.includes(':')) {
            const timeVal = parseTimeToSeconds(rawValue);
            if (timeVal !== null) {
              parsedValue = timeVal;
              isTimeValue = true;
            }
          }
          if (parsedValue === null && isNumber(rawValue)) {
            parsedValue = parseFloat(rawValue);
          }

          if (parsedValue !== null && !isNaN(parsedValue)) {
            chartData.push({
              header: title,
              value: parsedValue,
              isTime: isTimeValue,
            });
          }
        }
      }
    });
    return chartData;
  };
  /**
   * Flattens the 'extensions.extended' array into top-level fields.
   *
   * @param {object} data The original data object with a 'result' property.
   * @returns {object} A new object with flattened extension fields.
   */
  const flattenExtensions = (data: any) => {
    if (!data?.result?.extensions?.extended) {
      return { addedFields: [], flattenedData: data };
    }
    const excludedCodes = ['LAST'];
    const { result } = data;
    const { extensions, ...restOfResult } = result;
    const { extended } = extensions;

    const flattenedExtensions: { [key: string]: string | string[] } = {};
    const categorizedEntries = new Map<string, { positioned: string[]; unpositioned: string[] }>();
    const newlyAddedFieldNames = new Set<string>();
    extended.forEach((item: any) => {
      const { code, value, pos } = item;
      if (!categorizedEntries.has(code)) {
        categorizedEntries.set(code, { positioned: [], unpositioned: [] });
      }
      const entry = categorizedEntries.get(code)!; // Non-null assertion is safe here

      if (pos) {
        entry.positioned.push(value);
      } else {
        entry.unpositioned.push(value);
      }
    });
    Array.from(categorizedEntries)
      .filter(([code]) => !excludedCodes.includes(code))
      .forEach(([code, dataForCode]) => {
        if (dataForCode.positioned.length > 1) {
          flattenedExtensions[code] = dataForCode.positioned;
          newlyAddedFieldNames.add(code);
        } else if (dataForCode.positioned.length === 1) {
          flattenedExtensions[code] = dataForCode.positioned[0];
          newlyAddedFieldNames.add(code);
        } else if (dataForCode.unpositioned.length > 0) {
          flattenedExtensions[code] = dataForCode.unpositioned[dataForCode.unpositioned.length - 1];
          newlyAddedFieldNames.add(code);
        }
      });

    const finalFlattenedData = {
      ...data,
      result: {
        ...restOfResult,
        ...flattenedExtensions,
      },
    };

    return {
      flattenedData: finalFlattenedData,
      addedFields: Array.from(newlyAddedFieldNames), // Convert Set to Array
    };
  };
  const flattenExtensionsToArray = (inputDataArray: any[]) => {
    const flattenedDataList: any[] = [];
    const allAddedFields = new Set<string>();

    if (!Array.isArray(inputDataArray)) {
      return { flattenedDataList: [], addedFields: [] };
    }

    inputDataArray.forEach((item) => {
      const flattenedResult = flattenExtensions(item);
      flattenedDataList.push(flattenedResult.flattenedData);
      flattenedResult.addedFields.forEach((key) => {
        allAddedFields.add(key);
      });
    });

    return {
      flattenedData: flattenedDataList,
      addedFields: uniq(Array.from(allAddedFields)),
    };
  };

  return {
    parseIndexToFrameName,
    createFrameSeries,
    parseToFrameName,
    getFrameTitle,
    preferredValue,
    shouldShowFrames,
    shouldShowTotal,
    getDynamicDataGridData,
  };
}
