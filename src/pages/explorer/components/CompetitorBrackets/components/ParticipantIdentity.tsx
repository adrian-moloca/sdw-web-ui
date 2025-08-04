import { Stack } from '@mui/material';
import { TypographyLink } from 'components/TypographyLink';
import { UniformChip } from 'components/UniformChip';
import useAppRoutes from 'hooks/useAppRoutes';
import get from 'lodash/get';
import { EntityType } from 'models';
import { olympicsDesignColors } from 'themes/colors';

export const ParticipantIdentity: React.FC<{
  data: any;
  textAlign: 'left' | 'right';
  displayName: string;
}> = ({ data, textAlign, displayName }) => {
  const { getDetailRoute } = useAppRoutes();
  const isLeft = textAlign === 'left';
  const id = get(data, 'participantId');
  const type = id.startsWith('IND') ? EntityType.Person : EntityType.Team;
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
      {isLeft ? (
        <>
          <TypographyLink
            value={displayName}
            typoSize="subtitle1"
            sx={{
              textAlign,
              lineHeight: 1,
              color: olympicsDesignColors.base.neutral.white,
            }}
            route={getDetailRoute(type, id)}
          />
          <UniformChip data={data} />
          <UniformChip data={data} code="uniformGoalkeeper" />
        </>
      ) : (
        <>
          <UniformChip data={data} code="uniformGoalkeeper" />
          <UniformChip data={data} />
          <TypographyLink
            value={displayName}
            typoSize="subtitle1"
            sx={{
              textAlign,
              lineHeight: 1,
              color: olympicsDesignColors.base.neutral.white,
            }}
            route={getDetailRoute(type, id)}
          />
        </>
      )}
    </Stack>
  );
};
