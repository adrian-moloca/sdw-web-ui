import type { MedalType } from 'types/explorer';
import { Stack, Typography } from '@mui/material';
import { MedalAvatarMap } from 'components';

type Props = {
  field: MedalType;
  value: string | number;
};

export const MedalStack = ({ field, value }: Props) => {
  return (
    <Stack direction="row" spacing={0.2} sx={{ alignItems: 'center' }}>
      {MedalAvatarMap[field](21)}
      <Typography variant="body1">{value}</Typography>
    </Stack>
  );
};
