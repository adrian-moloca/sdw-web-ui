import { styled } from '@mui/system';
import { ToolbarButton } from '@mui/x-data-grid-pro';
import { colors } from 'themes/colors';

type OwnerState = {
  expanded: boolean;
};

export const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    transition: theme?.transitions?.create(['opacity']),
    backgroundColor: colors.neutral.white,
    color: colors.font.darkSoft,
    border: '1px solid',
    borderColor: colors.neutral[300],
    '&:hover': {
      backgroundColor: colors.blue[100],
    },
    ...theme.applyStyles('dark', {
      backgroundColor: colors.neutral[600],
      color: colors.neutral.white,
      borderColor: colors.neutral[500],
      '&:hover': {
        backgroundColor: colors.blue[400],
      },
    }),
  })
);

export const StyledToolbarButtonBase = styled(ToolbarButton)(({ theme }) => ({
  gridArea: '1 / 1',
  width: 'min-content',
  height: 'min-content',
  zIndex: 1,
  backgroundColor: colors.neutral.white,
  color: colors.font.darkSoft,
  border: '1px solid',
  borderColor: colors.neutral[300],
  '&:hover': {
    backgroundColor: colors.blue[100],
  },
  ...theme.applyStyles('dark', {
    backgroundColor: colors.neutral[600],
    color: colors.neutral.white,
    borderColor: colors.neutral[500],
    '&:hover': {
      backgroundColor: colors.blue[400],
    },
  }),
}));
