import get from 'lodash/get';
import { Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useStoreCache } from 'hooks';
import { MasterData } from 'models';
import baseConfig from 'baseConfig';

type Props = {
  data: any;
  inline?: boolean;
  children?: React.ReactElement;
};
export function getScheduleDate(data: any): string | undefined {
  const startDateTime = get(data, 'schedule.startDateTime');
  const startDate = get(data, 'schedule.startDate') ?? get(data, 'startDate');
  if (startDateTime)
    return dayjs(startDateTime).format(baseConfig.dateTimeDateFormat).toUpperCase();
  if (startDate) return dayjs(startDate).format(baseConfig.dayDateFormat).toUpperCase();
  return undefined;
}
interface ChipProps {
  data: any;
}
export const ScheduleStatusChip: React.FC<ChipProps> = ({ data }) => {
  const { getMasterDataValue } = useStoreCache();
  const schedule = get(data, 'schedule');
  const statusValue = get(schedule, 'status') ?? get(data, 'scheduleStatus');
  const status = getMasterDataValue(statusValue, MasterData.ScheduleStatus)?.value;

  if (!status) return null;

  return <Chip size="small" variant="outlined" label={status.toUpperCase()} />;
};
export const ScheduleDisplay = ({ data, inline, children }: Props) => {
  const date = getScheduleDate(data);
  return (
    <Stack
      spacing={inline ? 0.5 : 0.3}
      sx={{ alignItems: inline ? 'center' : 'end' }}
      direction={inline ? 'row' : 'column'}
    >
      {date && (
        <Typography variant="body1" lineHeight={1.1}>
          {date}
        </Typography>
      )}
      <ScheduleStatusChip data={data} />
      {children}
    </Stack>
  );
};
