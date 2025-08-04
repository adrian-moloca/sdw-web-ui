import { Typography } from '@mui/material';
import { useStoreCache } from 'hooks';
import get from 'lodash/get';
import { MasterData } from 'models';

export const ResultStatusChip = (param: { data: any }) => {
  const { getMasterDataValue } = useStoreCache();
  const status = get(param.data, 'status');
  if (!status) return <>-</>;
  return <Typography>{getMasterDataValue(status, MasterData.ResultStatus)?.value}</Typography>;
};
