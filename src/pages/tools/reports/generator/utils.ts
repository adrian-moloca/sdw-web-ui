import split from 'lodash/split';

export const decodeTittle = (str: string, data: Array<any>): string => {
  if (!str) return '';

  const values = split(str, '|');
  const title = data.find((x: any) => x.key == values[0]).title;
  return title;
};

export const decodeReport = (str: string): string => {
  if (!str) return '';

  const values = split(str, '|');
  return values[0];
};

export const decodeSubtitle = (str: string, text: string): string | undefined => {
  if (!str) return undefined;

  const values = split(str, '|');
  if (values.length > 1) {
    return text;
  }

  return undefined;
};

export const validSubCode = (str: string): boolean => {
  if (!str) return false;

  const values = split(str, '|');
  return values.length > 1;
};

export const validKey = (str: string): boolean => {
  if (!str) return false;

  return str.length > 2;
};

export const getViewerKey = (id: string, reportInfo?: any[]) => {
  if (id.startsWith('N24')) return id;

  if (id.startsWith('C24')) return id;

  const key = reportInfo?.find((x: any) => x.key == id)?.next?.key ?? `${id}|S`;
  return key;
};

export const getSelectorKey = (id: string, reportInfo?: any[]) => {
  if (id.startsWith('N24')) return 'N24|D:GEN|N:GEN';

  const key = reportInfo?.find((x: any) => x.key == id)?.next?.key ?? `${id}|S`;
  return key;
};

export const skipReportCodes = (id: string): boolean => {
  if (id.startsWith('N24')) return true;

  return false;
};
