import { Typography } from '@mui/material';
import baseConfig from 'baseConfig';
import dayjs from 'dayjs';
import get from 'lodash/get';

export const StartDateChip = (param: { data: any; format?: string }) => {
  let startDate = get(param.data, `startDate`);
  startDate ??= get(param.data, `roundsResult.startDate`);
  startDate ??= get(param.data, `competition.startDate`);
  startDate ??= get(param.data, `recordDate`);
  if (!startDate) return <>-</>;
  return (
    <Typography>
      {dayjs(startDate)
        .format(param.format ? param.format : baseConfig.dayDateFormat)
        .toUpperCase()}
    </Typography>
  );
};

export const FinishDateChip = (param: { data: any; format?: string }) => {
  const finishDate = get(param.data, `finishDate`);
  if (!finishDate) return <>-</>;
  return (
    <Typography>
      {dayjs(finishDate)
        .format(param.format ? param.format : baseConfig.dayDateFormat)
        .toUpperCase()}
    </Typography>
  );
};
