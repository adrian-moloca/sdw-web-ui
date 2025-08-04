import { Card, styled } from '@mui/material';
import { olympicsDesignColors } from 'themes/colors';
import { layout } from 'themes/layout';

interface StyleMainCardProps {
  border?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  shadow?: string;
}
export const StyleMainCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'border', // Avoid passing border to DOM
})<StyleMainCardProps>(({ theme, border, fullWidth, fullHeight, shadow }) => ({
  borderRadius: layout.radius.sm,
  ...(border && {
    border: '1px solid',
    borderColor: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      borderBottom: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
    }),
  }),
  ...(fullWidth && {
    width: '100%',
  }),
  ...(fullHeight && {
    height: '100%',
  }),
  ':hover': {
    boxShadow: shadow ? layout.shadows.md : 'inherit',
  },
}));
