import { Stack } from '@mui/material';
import { OrganisationChip, TypographyLink } from 'components';
import { formatAthleteName } from '_helpers';
import get from 'lodash/get';
import useAppRoutes from 'hooks/useAppRoutes';
import { EntityType } from 'models';

export const ParticipantChip = (param: {
  data: any;
  extended?: boolean;
  variant: 'body1' | 'body2';
}) => {
  const displayName = formatAthleteName(param.data);
  const id = get(param.data, 'id');
  const type = id?.startsWith('IND') ? EntityType.Person : EntityType.Team;
  const { getDetailRoute } = useAppRoutes();

  if (param.extended)
    return (
      <Stack
        spacing={1}
        direction={'row'}
        alignContent={'center'}
        sx={{ alignItems: 'center' }}
        component={'span'}
      >
        <OrganisationChip
          data={get(param.data, 'organisation')}
          extended={false}
          variant={param.variant}
        />
        <TypographyLink
          value={displayName}
          typoSize={param.variant}
          route={getDetailRoute(type, id)}
        />
      </Stack>
    );
  return (
    <TypographyLink value={displayName} typoSize={param.variant} route={getDetailRoute(type, id)} />
  );
};
