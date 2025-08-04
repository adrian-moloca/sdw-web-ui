import dayjs from 'dayjs';
import { EnumType } from 'models';
import { Box, Typography } from '@mui/material';
import { EnumTemplate, LinearProgress } from 'components';
import get from 'lodash/get';

export const renderPlanTooltip = (eventData: any): React.ReactElement | undefined => {
  const data = eventData.extendedProps;

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h5">{eventData.title}</Typography>
      <Typography variant="body2">
        {dayjs(get(data, 'scheduleDate')).format('dddd, Do MMMM YYYY')}
      </Typography>
      {data.type && <EnumTemplate value={data.type} type={EnumType.DeliveryType} withText={true} />}
      <EnumTemplate value={data.status} type={EnumType.DeliveryStatus} withText={true} />
      <LinearProgress value={data.rate} />
      <LinearProgress value={data.dataRate} />
    </Box>
  );
};
