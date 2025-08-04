import { Typography } from '@mui/material';
import { MainCard, MedalAvatarMap } from 'components';
import { medalColors } from 'models';
import type { MedalType, KpiDataProps } from 'types/explorer';

type Props = {
  data: KpiDataProps;
  field: MedalType;
};

export const MedalKpiCard = ({ data, field }: Props) => {
  return (
    <MainCard
      avatar={MedalAvatarMap[field](36)}
      title={
        <Typography variant="h4" sx={{ lineHeight: 1 }}>
          {data.value}
        </Typography>
      }
      subHeader={
        <Typography variant="body2" sx={{ lineHeight: 1 }} color="text.secondary">
          {data.title}
        </Typography>
      }
      headerSX={{ py: 1 }}
      border={false}
      content={false}
      sx={{
        background: `radial-gradient(circle at top right, ${medalColors[field]} 40%, transparent  10%)`,
      }}
    />
  );
};
