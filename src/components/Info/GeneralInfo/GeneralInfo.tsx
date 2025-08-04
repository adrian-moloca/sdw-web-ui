import get from 'lodash/get';
import { DisplayTable } from './DisplayTable';

export const GeneralInfo = (param: { data: any }) => {
  const info = get(param.data, 'Info') ?? get(param.data, 'Info') ?? get(param.data, 'Place');
  if (!info) return null;
  return DisplayTable(info);
};
