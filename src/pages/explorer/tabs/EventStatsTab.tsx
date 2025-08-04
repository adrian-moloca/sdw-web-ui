import { Box } from '@mui/material';
import { EventInfo } from 'components';
import { IPanelTabProps } from 'types/views';

export const EventStatsTab = (props: IPanelTabProps) => {
  return (
    <Box sx={{ py: 2 }}>
      <EventInfo data={props.data} discipline={props.data.discipline.code} />
    </Box>
  );
};
