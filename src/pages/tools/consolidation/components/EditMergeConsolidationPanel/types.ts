import type { EditProps } from 'types/tools';
import { IQueryProps, QueryFilterValue } from 'models';

export interface Props extends EditProps {
  tags?: Array<QueryFilterValue>;
  dataSource?: IQueryProps;
}
