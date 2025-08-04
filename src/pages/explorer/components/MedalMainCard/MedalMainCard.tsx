import { Stack, Typography } from '@mui/material';
import type { KpiDataProps, MedalType } from 'types/explorer';
import { MainCard, MedalAvatarMap } from 'components';

type Props = {
  data: KpiDataProps;
  field: MedalType;
};

export const MedalMainCard = ({ data, field }: Props) => {
  return (
    <MainCard
      content={false}
      divider={false}
      border={false}
      title={
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          {MedalAvatarMap[field](21)}
          <Typography variant="h4" sx={{ lineHeight: 1 }}>
            {data.value}
          </Typography>
        </Stack>
      }
      superHeader={
        <Typography variant="body2" sx={{ lineHeight: 1 }}>
          {data.title}
        </Typography>
      }
    />
  );
};
