import { pink } from '@mui/material/colors';
import { Avatar, Chip, Typography } from '@mui/material';
import { useStoreCache } from 'hooks';
import { MasterData } from 'models';
import { MainCard } from 'components';
import { normalizeTitle } from '../../utils/event-rounds';

type Props = {
  data: any;
  discipline: any;
};

export const PhaseNode = ({ data }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const type = getMasterDataValue(data?.type, MasterData.PhaseType)?.value;

  return (
    <MainCard
      content={false}
      headerSX={{ p: 1, height: 50 }}
      border={false}
      divider={false}
      title={
        <Typography textAlign="left" lineHeight={1.1}>
          {normalizeTitle(data.title)}
        </Typography>
      }
      avatar={
        <Avatar
          variant="rounded"
          sx={{ height: '28px', width: '36px', bgcolor: pink[600], fontSize: '14px' }}
        >{`P${data.order ?? 'X'}`}</Avatar>
      }
      secondary={
        <>
          {type && (
            <Chip
              size="small"
              variant="outlined"
              label={type?.toUpperCase()}
              sx={{ fontWeight: 400 }}
            />
          )}
        </>
      }
    />
  );
};
