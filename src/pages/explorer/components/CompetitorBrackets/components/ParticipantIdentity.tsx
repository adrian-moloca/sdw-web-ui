import { Stack, useMediaQuery } from '@mui/material';
import { TypographyLink } from 'components/TypographyLink';
import { UniformChip } from 'components/UniformChip';
import useAppRoutes from 'hooks/useAppRoutes';
import get from 'lodash/get';
import { EntityType } from 'models';
import { olympicsDesignColors } from 'themes/colors';

export const ParticipantIdentity: React.FC<{
  data: any;
  textAlign: 'left' | 'right' | 'center';
  displayName: string;
}> = ({ data, textAlign, displayName }) => {
  const { getDetailRoute } = useAppRoutes();
  const isLeft = textAlign === 'left';
  const id = get(data, 'participantId');
  const type = id.startsWith('IND') ? EntityType.Person : EntityType.Team;
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const getDisplayName = () => {
    if (displayName.includes('/')) {
      return displayName.split('/');
    }
    return displayName;
  };
  if (textAlign === 'center') {
    return (
      <TypographyLink
        value={getDisplayName()}
        typoSize={isMobile ? 'subtitle1' : 'h5'}
        sx={{
          textAlign: 'center',
          color: olympicsDesignColors.base.neutral.white,
        }}
        route={getDetailRoute(type, id)}
      />
    );
  }
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 2 }}>
      {isLeft ? (
        <>
          <TypographyLink
            value={getDisplayName()}
            typoSize="h5"
            sx={{
              textAlign: 'right',
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
            value={getDisplayName()}
            typoSize="h5"
            sx={{
              textAlign: 'left',
              color: olympicsDesignColors.base.neutral.white,
            }}
            route={getDetailRoute(type, id)}
          />
        </>
      )}
    </Stack>
  );
};
