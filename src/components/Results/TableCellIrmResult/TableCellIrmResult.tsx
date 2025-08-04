import { Stack, Typography, useMediaQuery } from '@mui/material';
import { MasterData } from 'models';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { cleanTimeIfNeeded, formatMasterCode } from '_helpers';
import { TypographyTooltip } from 'components';
import { useResults, useStoreCache } from 'hooks';
export const IrmResultChip = (param: {
  value: string;
  valueType: string;
  irm: string;
  lastRound?: string;
  subResults?: any[];
  inline: boolean;
}) => {
  const { getMasterDataValue } = useStoreCache();
  const { formatLastRound } = useResults();
  const roundName = formatLastRound(param.lastRound, param.inline);
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const hasIrm = param.irm || param.valueType === 'IRM' || param.value?.indexOf('SC_IRM$') > -1;
  if (matchDownSM) {
    if (hasIrm)
      return (
        <TypographyTooltip
          typoSize="body1"
          value={formatMasterCode(param.irm ?? param.value)}
          tooltip={getMasterDataValue(param.irm ?? param.value, MasterData.Irm)?.value}
        />
      );
    return <Typography variant="body1">{param.value ?? roundName ?? '-'}</Typography>;
  }
  if (hasIrm)
    return (
      <>
        <Stack
          direction={'row'}
          spacing={1}
          alignItems={'center'}
          justifyContent={'end'}
          component={'span'}
        >
          <TypographyTooltip
            typoSize="body1"
            value={formatMasterCode(param.irm ?? param.value)}
            tooltip={getMasterDataValue(param.irm ?? param.value, MasterData.Irm)?.value}
          />
          <RemoveCircleOutlineOutlinedIcon style={{ fontSize: '12px', color: '#DF0024' }} />
          {param.inline && roundName && (
            <Typography variant="body2" color="textSecondary">
              {roundName}
            </Typography>
          )}
        </Stack>
        {!param.inline && roundName && (
          <Typography variant="body2" color="textSecondary">
            {roundName}
          </Typography>
        )}
      </>
    );
  if (!param.value)
    return (
      <Typography variant="body2" color="textSecondary" textAlign={'right'}>
        {roundName ?? '-'}
      </Typography>
    );
  return (
    <>
      <Stack
        direction={'row'}
        spacing={1}
        alignItems={'center'}
        justifyContent={'end'}
        component={'span'}
      >
        <Typography variant="body1">{cleanTimeIfNeeded(param.value ?? '-')}</Typography>
        {param.inline && roundName && (
          <Typography variant="body2" color="textSecondary">
            {roundName}
          </Typography>
        )}
      </Stack>
      {!param.inline && roundName && (
        <Typography variant="body2" color="textSecondary">
          {roundName}
        </Typography>
      )}
    </>
  );
};
