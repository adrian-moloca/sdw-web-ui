import { Typography } from '@mui/material';
import { MasterData } from 'models';
import { TypographyTooltip } from 'components';
import { formatMasterCode } from '_helpers';
import { useStoreCache } from 'hooks';

export const RankResultChip = (param: {
  value: string;
  valueType: string;
  irm: string;
  rank?: string;
}) => {
  const { getMasterDataValue } = useStoreCache();
  if (param.irm)
    return (
      <TypographyTooltip
        typoSize="body1"
        value={formatMasterCode(param.value)}
        sx={{ textAlign: 'right' }}
        tooltip={getMasterDataValue(param.irm, MasterData.Irm)?.value}
      />
    );
  if (param.valueType === 'IRM' || param.value?.indexOf('SC_IRM$') > -1)
    return (
      <TypographyTooltip
        typoSize="body1"
        value={formatMasterCode(param.value)}
        sx={{ textAlign: 'right' }}
        tooltip={getMasterDataValue(param.irm, MasterData.Irm)?.value}
      />
    );
  if (!param.value) return <>{}</>;
  return (
    <Typography variant="body1" sx={{ lineHeight: 1.1 }} textAlign={'right'}>
      {param.rank ? `${param.value}  (${param.rank})` : (param.value ?? '-')}
    </Typography>
  );
};
