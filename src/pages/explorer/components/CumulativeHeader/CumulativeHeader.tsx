import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useStoreCache } from 'hooks';
import { MasterData } from 'models';
import { getScheduleDate } from '../ScheduleDisplay';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
type Props = { data: any };

export const CumulativeAvatar = ({ data }: Props) => {
  return (
    <Avatar
      sx={{
        height: 30,
        width: 30,
        bgcolor: blue[600],
        fontSize: '12px',
        fontWeight: 500,
      }}
    >{`C${data.order ?? '0'}`}</Avatar>
  );
};
export const CumulativeHeader = ({ data }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const status = getMasterDataValue(data?.resultStatus, MasterData.ResultStatus)?.value;
  const type = getMasterDataValue(data?.type, MasterData.StageType)?.value;
  const date = getScheduleDate(data);
  return (
    <Stack direction="row" spacing={1} alignItems={'center'}>
      <Stack>
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Typography variant="subtitle1" lineHeight={1.1}>
            {data.title}
          </Typography>
          {data.type && (
            <Chip
              size="small"
              variant="outlined"
              icon={<FiberManualRecord fontSize="small" color={'error'} />}
              label={type.toUpperCase()}
              sx={{ fontWeight: 400 }}
            />
          )}
          {data.resultStatus && (
            <Chip size="small" label={status.toUpperCase()} sx={{ fontWeight: 400 }} />
          )}
        </Stack>
        {data.venue && (
          <Typography variant="body1" lineHeight={1.1} color="text.secondary" sx={{ mb: 0.5 }}>
            {data.venue.title}
          </Typography>
        )}
        {date && (
          <Typography variant="body2" lineHeight={1.3}>
            {date}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
