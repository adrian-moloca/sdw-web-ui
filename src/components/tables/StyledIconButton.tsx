import { IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from 'themes/colors';

type Props = {
  width?: string;
  height?: string;
};

export const StyledIconButton = styled(IconButton)<Props>(
  ({ theme, width = 'min-content', height = 'min-content' }) => ({
    backgroundColor: colors.neutral.white,
    color: colors.font.darkSoft,
    width,
    height,
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
