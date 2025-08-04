import { Stack, Typography } from '@mui/material';
import type { MedalType, KpiDataProps } from 'types/explorer';
import { MedalAvatarMap } from 'components';

type Props = {
  data: KpiDataProps;
  field: MedalType;
};

export const MedalCard = ({ data, field }: Props) => {
  return (
    <Stack direction="row" spacing={1} alignItems={'center'} sx={{ my: 1 }}>
      {MedalAvatarMap[field](26)}
      <Typography variant="h6" sx={{ lineHeight: 1 }}>
        {data.value}
      </Typography>
    </Stack>
  );
};
