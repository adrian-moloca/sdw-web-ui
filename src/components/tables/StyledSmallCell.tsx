import { styled, TableCell, tableCellClasses } from '@mui/material';

export const StyledSmallCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontFamily: 'Olympic Headline',
    fontSize: '0.875rem',
    fontWeight: 500,
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[900],
    }),
    [theme.breakpoints.down('md')]: {
      fontSize: '0.875rem',
      lineHeigh: 'normal',
    },
  },
}));
