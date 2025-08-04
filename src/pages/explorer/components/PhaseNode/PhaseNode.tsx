import { Typography } from '@mui/material';
import { MainCard } from 'components';
import { normalizeTitle } from '../../utils/event-rounds';
import { useStoreCache } from 'hooks';
import { MasterData } from 'models';

type Props = {
  data: any;
};

export const PhaseNode = ({ data }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  return (
    <MainCard
      content={false}
      border={false}
      divider={false}
      size="small"
      title={
        <Typography variant="subtitle1" fontWeight={'500'}>
          {data.round
            ? getMasterDataValue(data.round, MasterData.RoundType)?.value
            : normalizeTitle(data.title)}
        </Typography>
      }
    />
  );
};
