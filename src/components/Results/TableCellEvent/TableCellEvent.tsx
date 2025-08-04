import get from 'lodash/get';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { EntityType, MasterData } from 'models';
import { TypographyLink } from 'components';
import useAppRoutes from 'hooks/useAppRoutes';
import { useStoreCache } from 'hooks';

const EventInnerChip = (param: { data: any; withRoute: boolean }) => {
  const id = get(param.data, 'id');
  const eventTitle = get(param.data, 'title');
  const { getDetailRoute } = useAppRoutes();
  return (
    <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }} component={'span'}>
      {param.withRoute ? (
        <TypographyLink
          value={eventTitle}
          route={getDetailRoute(EntityType.Event, id)}
          typoSize="body1"
        />
      ) : (
        <Typography variant="body1">{eventTitle}</Typography>
      )}
    </Stack>
  );
};
export const EventChip = (param: { data: any; withRoute: boolean }) => {
  const { getMasterDataValue } = useStoreCache();
  const eventTitle = get(param.data, 'title');
  const eventType = get(param.data, 'type');
  const type = getMasterDataValue(eventType, MasterData.EventType)?.value;
  if (!type && !eventTitle) return <>-</>;
  return <EventInnerChip {...param} />;
};
