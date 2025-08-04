import { Stack, Typography } from '@mui/material';
import { MedalAvatarMap } from 'components/AwardAvatar';

type Props = {
  field: 'golden' | 'silver' | 'bronze' | 'total';
  value?: number;
  size?: number;
};

export const MedalNumberDisplay = ({ field, value, size = 21 }: Props) => {
  if (!value || value <= 0) return '-';
  return (
    <Stack direction={'row'} spacing={1} alignItems="center">
      {MedalAvatarMap[field](size)}
      <Typography sx={{ lineHeight: 1 }}>{value}</Typography>
    </Stack>
  );
};
