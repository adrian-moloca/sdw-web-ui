import { TextField } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from 'themes/colors';
import { layout } from 'themes/layout';

type OwnerState = {
  expanded: boolean;
};

export const StyledTextField = styled(TextField)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    transition: theme?.transitions?.create(['width', 'opacity']),
    backgroundColor: colors.neutral.white,
    borderRadius: layout.radius.md,
    color: colors.font.dark,
    ...theme.applyStyles('dark', {
      backgroundColor: colors.neutral[600],
      color: colors.neutral.white,
    }),
  })
);
