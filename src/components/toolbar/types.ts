import { IQueryProps, IWhereProps, ManagerDataCategory, MasterDataCategory } from 'models';

export type Props = {
  value: any;
  dataSource?: IQueryProps;
  where?: IWhereProps[];
  limitTags?: number;
  onChange: (value: any) => void;
};

export interface FilterProps extends Props {
  category: MasterDataCategory | ManagerDataCategory;
  filters?: Array<string>;
  isLoading?: boolean;
  added?: any;
}
