import { Chip, Stack, Typography } from '@mui/material';
import { MasterData } from 'models';
import { getScheduleDate } from '../ScheduleDisplay';
import { useStoreCache } from 'hooks';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
type Props = {
  data: any;
  phaseType?: string;
};
export const UnitHeader = ({ data, phaseType }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const status = getMasterDataValue(data?.resultStatus, MasterData.ResultStatus)?.value;
  const type = getMasterDataValue(data?.type, MasterData.UnitType)?.value;
  const round = phaseType
    ? phaseType.startsWith(MasterData.PhaseType)
      ? getMasterDataValue(phaseType, MasterData.PhaseType)?.value
      : getMasterDataValue(phaseType, MasterData.StageType)?.value
    : null;
  const date = getScheduleDate(data);
  return (
    <Stack direction="row" spacing={1}>
      <Stack>
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Typography variant="subtitle1">{data.title}</Typography>
          {phaseType && (
            <Chip
              size="small"
              variant="outlined"
              icon={<FiberManualRecord fontSize="small" color={'success'} />}
              label={round?.toUpperCase()}
              sx={{ fontWeight: 400 }}
            />
          )}
          {data?.type && (
            <Chip
              size="small"
              variant="outlined"
              icon={<FiberManualRecord fontSize="small" color={'info'} />}
              label={type?.toUpperCase()}
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
          <Typography variant="body2" lineHeight={1.1}>
            {date}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
