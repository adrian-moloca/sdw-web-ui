import { Stack } from '@mui/material';
import { formatAthleteName } from '_helpers';
import { hasUniform, TypographyLink, UniformChip } from 'components';
import useAppRoutes from 'hooks/useAppRoutes';
import get from 'lodash/get';
import { EntityType } from 'models';
import { RCProps } from 'types/explorer';

export const CompetitorChip: React.FC<RCProps> = ({ data }: RCProps) => {
  const displayName = formatAthleteName(data);
  const withUniform = hasUniform(data);
  const id = get(data, 'participantId') ?? get(data, 'id');
  const type = id?.startsWith('IND') ? EntityType.Person : EntityType.Team;
  const { getDetailRoute } = useAppRoutes();
  if (withUniform)
    return (
      <Stack direction="row" spacing={1} alignItems={'center'}>
        <TypographyLink
          value={displayName}
          typoSize="body1"
          route={id ? getDetailRoute(type, id) : undefined}
        />
        <UniformChip data={data} />
        <UniformChip data={data} code="uniformGoalkeeper" />
      </Stack>
    );
  return (
    <TypographyLink
      value={displayName}
      typoSize="body1"
      route={id ? getDetailRoute(type, id) : undefined}
    />
  );
};
