import { styled, Tab } from '@mui/material';

export const StyledTabCell = styled(Tab)(({ theme }) => ({
  fontFamily: 'Olympic Headline',
  fontSize: theme.typography.h5.fontSize,
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    lineHeigh: 'normal',
  },
}));
