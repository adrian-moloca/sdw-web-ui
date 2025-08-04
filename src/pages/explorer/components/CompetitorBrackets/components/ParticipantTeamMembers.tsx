import { Box, Collapse, darken, Stack, useTheme } from '@mui/material';
import { TypographyLink } from 'components/TypographyLink';
import { formatAthleteName } from '_helpers';
import useAppRoutes from 'hooks/useAppRoutes';
import get from 'lodash/get';
import { EntityType } from 'models';
import { olympicsDesignColors } from 'themes/colors';

export const ParticipantTeamMembers: React.FC<{
  data: any[];
  textAlign: 'left' | 'right';
  open: boolean;
}> = ({ data, textAlign, open }) => {
  const theme = useTheme();
  const { getDetailRoute } = useAppRoutes();
  const isLeft = textAlign === 'left';
  const isRight = textAlign === 'right';

  return (
    <Collapse in={open}>
      <Box
        sx={{
          borderLeft: isRight ? `3px solid ${theme.palette.primary.main}` : undefined,
          borderRight: isLeft ? `3px solid ${theme.palette.primary.main}` : undefined,
          pl: 1.5,
          pr: 1.5,
          ml: isLeft ? 0 : 'auto',
          mr: isRight ? 'auto' : 0,
        }}
      >
        <Stack>
          {data.map((e: any, index: number) => {
            const id = get(e, 'id');
            const type = id?.startsWith('IND') ? EntityType.Person : EntityType.Team;
            const displayName = e.bib
              ? isLeft
                ? ` ${e.bib} ${formatAthleteName(e)}`
                : `${formatAthleteName(e)} ${e.bib}`
              : formatAthleteName(e);
            return (
              <TypographyLink
                value={displayName}
                typoSize="body2"
                sx={{
                  textAlign: textAlign == 'left' ? 'right' : 'left',
                  lineHeight: 1.2,
                  color: darken(olympicsDesignColors.base.neutral.white, 0.1),
                }}
                key={index}
                route={getDetailRoute(type, id)}
              />
            );
          })}
        </Stack>
      </Box>
    </Collapse>
  );
};
