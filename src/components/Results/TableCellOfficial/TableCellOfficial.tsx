import { Stack } from '@mui/material';
import { formatAthleteName } from '_helpers';
import { OrganisationChip, TypographyLink } from 'components';
import useAppRoutes from 'hooks/useAppRoutes';
import get from 'lodash/get';
import { EntityType } from 'models';

interface Props {
  data: any;
  variant: 'body1' | 'body2';
}
export const OfficialChip = (param: Props) => {
  const displayName = formatAthleteName(param.data);
  const id = get(param.data, 'id');
  const { getDetailRoute } = useAppRoutes();
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
        sx={{ fontWeight: 300 }}
        route={getDetailRoute(EntityType.Person, id)}
      />
    </Stack>
  );
};
