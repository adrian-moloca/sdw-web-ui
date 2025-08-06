import { Chip, Stack, Typography } from '@mui/material';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import { useStoreCache } from 'hooks';
import { MasterData } from 'models';
import { getScheduleDate } from '../ScheduleDisplay';

type Props = {
  data: any;
  stageType?: string;
};
export const PhaseHeader = ({ data, stageType }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const round = getMasterDataValue(data?.round, MasterData.RoundType)?.value;
  const stageTypeFormat = stageType
    ? getMasterDataValue(stageType, MasterData.StageType)?.value
    : null;
  const status = getMasterDataValue(data?.resultStatus, MasterData.ResultStatus)?.value;

  const date = getScheduleDate(data);
  return (
    <Stack direction="row" spacing={1} alignItems={'center'}>
      <Stack>
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Typography variant="subtitle1" lineHeight={1.1}>
            {data.title}
          </Typography>
          {round && (
            <Chip
              size="small"
              variant="outlined"
              icon={<FiberManualRecord fontSize="small" color={'warning'} />}
              label={round.toUpperCase()}
              sx={{ py: 1, fontWeight: 400 }}
            />
          )}
          {stageTypeFormat && (
            <Chip
              size="small"
              variant="outlined"
              icon={<FiberManualRecord fontSize="small" color={'info'} />}
              label={stageTypeFormat.toUpperCase()}
              sx={{ fontWeight: 400 }}
            />
          )}
          {status && <Chip size="small" label={status.toUpperCase()} sx={{ fontWeight: 400 }} />}
        </Stack>
        {date && (
          <Typography variant="body2" lineHeight={1.3}>
            {date}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
