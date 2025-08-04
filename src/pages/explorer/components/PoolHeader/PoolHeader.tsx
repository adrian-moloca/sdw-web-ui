import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useStoreCache } from 'hooks';
import { MasterData } from 'models';
import { getScheduleDate } from '../ScheduleDisplay';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';

type Props = {
  data: any;
};
export const PoolAvatar = ({ data }: Props) => {
  return (
    <Avatar
      sx={{
        height: 30,
        width: 30,
        bgcolor: purple[600],
        fontSize: '12px',
        fontWeight: 500,
      }}
    >{`P${data.order ?? '0'}`}</Avatar>
  );
};
export const PoolHeader = ({ data }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const status = getMasterDataValue(data?.resultStatus, MasterData.ResultStatus)?.value;
  const date = getScheduleDate(data);
  return (
    <Stack direction="row" spacing={1} alignItems={'center'}>
      {/* <PoolAvatar data={data} /> */}
      <Stack>
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Typography variant="subtitle1" lineHeight={1.1}>
            {data.title}
          </Typography>
          <Chip
            size="small"
            variant="outlined"
            icon={<FiberManualRecord fontSize="small" color={'info'} />}
            label="POOL"
            sx={{ fontWeight: 400 }}
          />
          {status && <Chip size="small" label={status.toUpperCase()} sx={{ fontWeight: 400 }} />}
        </Stack>
        {date && (
          <Typography variant="body1" lineHeight={1.1}>
            {date}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
