import { lighten, styled, Tab, TabProps } from '@mui/material';
import { olympicsDesignColors } from 'themes/colors';
interface CustomTabProps extends TabProps {
  fontSize?: string | number;
  minWidth?: number;
}
export const ButtonTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'fontSize',
})<CustomTabProps>(({ theme, fontSize, minWidth }) => ({
  lineHeight: '1.1',
  borderRadius: '20px',
  padding: '6px 16px!important',
  textTransform: 'none',
  marginRight: theme.spacing(1),
  minHeight: 30,
  [theme.breakpoints.up('sm')]: {
    minWidth: minWidth ?? 140,
  },
  [theme.breakpoints.down('md')]: {
    minWidth: minWidth ?? 50,
    padding: '8px 4px',
  },
  fontWeight: 400,
  fontSize: fontSize ?? theme.typography.body1.fontSize,
  fontFamily: theme.typography.body1.fontFamily,
  backgroundColor: theme.palette.grey[200],
  border: '1px solid',
  borderColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  ...theme.applyStyles('dark', {
    color: theme.palette.common.white,
    borderColor: olympicsDesignColors.dark.general.divider,
    backgroundColor: olympicsDesignColors.dark.general.background,
  }),
  '&.Mui-selected': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    borderColor: theme.palette.grey[700],
    ...theme.applyStyles('dark', {
      color: theme.palette.common.white,
      borderColor: olympicsDesignColors.dark.general.divider,
      backgroundColor: olympicsDesignColors.dark.general.surface,
    }),
  },
  '&:not(.Mui-selected):hover': {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
  },
}));

export const ButtonTabPrimary = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'fontSize',
})<CustomTabProps>(({ theme, fontSize, minWidth }) => ({
  lineHeight: '1.1',
  textTransform: 'none',
  minWidth: minWidth ?? 'undefined',
  [theme.breakpoints.down('sm')]: {
    whiteSpace: 'wrap',
  },
  fontSize: fontSize ?? theme.typography.body1.fontSize,
  fontFamily: theme.typography.body1.fontFamily,
}));

export const ButtonTabMenu = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'fontSize',
})<CustomTabProps>(({ theme, fontSize, minWidth }) => ({
  lineHeight: '1.1',
  borderRadius: '5px',
  textTransform: 'none',
  minWidth: minWidth ?? 200,
  [theme.breakpoints.down('sm')]: {
    minWidth: minWidth ?? 160,
  },
  fontSize: fontSize ?? theme.typography.body1.fontSize,
  fontFamily: theme.typography.body1.fontFamily,
  marginRight: theme.spacing(0.5),
  border: '1px solid',
  borderColor: theme.palette.grey[900],
  color: theme.palette.text.primary,
  ...theme.applyStyles('dark', {
    color: theme.palette.common.white,
    borderColor: theme.palette.common.white,
  }),
  '&.Mui-selected': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[600],
      color: theme.palette.common.white,
    }),
  },
  '&:not(.Mui-selected):hover': {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.grey[200],
  },
}));

export const ButtonTabHeader = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'fontSize',
})<CustomTabProps>(({ theme, fontSize }) => ({
  lineHeight: '1.1',
  textTransform: 'none',
  fontSize: fontSize ?? theme.typography.body1.fontSize,
  fontFamily: theme.typography.body1.fontFamily,
}));

export const RadioTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'fontSize',
})<CustomTabProps>(({ theme, fontSize }) => ({
  lineHeight: '1.1',
  whiteSpace: 'pre-wrap',
  borderRadius: '5px',
  padding: '5px 10px',
  textTransform: 'none',
  border: '1px solid',
  fontSize: fontSize ?? theme.typography.body2.fontSize,
  fontFamily: theme.typography.body2.fontFamily,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  width: 120,
  transition: 'background-color 0.3s ease-in-out',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.grey[400],
  }),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '&:not(.Mui-selected):hover': {
    backgroundColor: lighten(theme.palette.primary.light, 0.4),
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));
