import { Avatar, Chip, Stack, Typography, useTheme } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { MasterData, medalColors } from 'models';
import { getScheduleDate } from '../ScheduleDisplay';
import { useStoreCache } from 'hooks';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import { formatMasterCode } from '_helpers';
type Props = {
  data: any;
  phaseType?: string;
};
export const UnitAvatar = ({ data }: Props) => {
  const theme = useTheme();
  const isGolden = data.title.toLowerCase().includes('gold');
  const isBronze = data.title.toLowerCase().includes('bronze');
  return (
    <Avatar
      sx={{
        height: 30,
        width: 30,
        bgcolor: isGolden ? medalColors.golden : isBronze ? medalColors.bronze : cyan[700],
        color: isGolden || isBronze ? theme.palette.common.black : theme.palette.common.white,
        fontSize: '12px',
        fontWeight: 500,
      }}
    >{`U${data.order ?? '0'}`}</Avatar>
  );
};
export const UnitHeader = ({ data, phaseType }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const status = getMasterDataValue(data?.resultStatus, MasterData.ResultStatus)?.value;
  const date = getScheduleDate(data);
  return (
    <Stack direction="row" spacing={1}>
      <Stack>
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Typography variant="subtitle1" lineHeight={1.1}>
            {data.title}
          </Typography>
          {phaseType && (
            <Chip
              size="small"
              variant="outlined"
              icon={<FiberManualRecord fontSize="small" color={'warning'} />}
              label={formatMasterCode(phaseType)}
              sx={{ fontWeight: 400 }}
            />
          )}
          {data?.type && (
            <Chip
              size="small"
              variant="outlined"
              icon={<FiberManualRecord fontSize="small" color={'info'} />}
              label={formatMasterCode(data?.type)}
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
