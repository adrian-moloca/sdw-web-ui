import type { KeyValue } from './types';

export const not = (a: readonly KeyValue[], b: readonly KeyValue[]) => {
  return a.filter((value) => b.findIndex((item) => item.key === value.key) === -1);
};

export const intersection = (a: readonly KeyValue[], b: readonly KeyValue[]) => {
  return a.filter((value) => b.some((item) => item.key === value.key));
};
