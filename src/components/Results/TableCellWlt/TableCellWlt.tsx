import { Chip } from '@mui/material';
import { useStoreCache } from 'hooks';
import { MasterData } from 'models';

export const getWltChipColor = (value: string) => {
  switch (value) {
    case 'SC_WLT$L':
    case 'SC_QUMARK$DNF':
    case 'LOST':
      return 'error';
    case 'SC_WLT$W':
    case 'WON':
      return 'success';
    default:
      return 'secondary';
  }
};

export const WltChip = (param: { value: string }) => {
  const { getMasterDataValue } = useStoreCache();
  if (!param.value) return <>-</>;
  const wlt = getMasterDataValue(param.value, MasterData.Wlt)?.value;
  return (
    <Chip
      component={'span'}
      size="small"
      sx={{ borderRadius: '4px', color: 'white' }}
      color={getWltChipColor(param.value)}
      label={wlt.toUpperCase() ?? '-'}
    />
  );
};
