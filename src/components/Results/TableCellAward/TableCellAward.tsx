import { Box, Stack, Typography } from '@mui/material';
import get from 'lodash/get';
import { MedalType } from 'types/explorer';
import { BronzeAvatar, GoldAvatar, MedalAvatarMap, SilverAvatar } from 'components';

export const AwardChip = (param: { data: any; includeSpacing?: boolean }) => {
  const awardSubclass = get(param.data, 'subClass') ?? get(param.data, 'awardCode');
  if (!awardSubclass && param.includeSpacing === true)
    return <Box sx={{ width: 21, height: 21 }}></Box>;
  if (
    awardSubclass === 'AWSB$ME_GOLD' ||
    awardSubclass === 'AWSB$GOLD' ||
    awardSubclass === 'GOLD_MEDAL'
  )
    return <GoldAvatar />;
  if (
    awardSubclass === 'AWSB$ME_SILVER' ||
    awardSubclass === 'AWSB$SILVER' ||
    awardSubclass === 'SILVER_MEDAL'
  )
    return <SilverAvatar />;
  if (
    awardSubclass === 'AWSB$ME_BRONZE' ||
    awardSubclass === 'AWSB$BRONZE' ||
    awardSubclass === 'BRONZE_MEDAL'
  )
    return <BronzeAvatar />;
  return param.includeSpacing === true ? <Box sx={{ width: 21, height: 21 }}></Box> : null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BuildMedalChip = (field: MedalType, value: number, _title?: string) => {
  if (value > 1)
    return (
      <Stack direction={'row'} spacing={0.2} sx={{ alignItems: 'center' }}>
        {MedalAvatarMap[field](21)}
        <Typography variant="body1">{value}</Typography>
      </Stack>
    );
  return <>{MedalAvatarMap[field](21)} </>;
};
