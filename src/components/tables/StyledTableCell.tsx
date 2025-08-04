import { styled, TableCell, tableCellClasses } from '@mui/material';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '& *::-webkit-scrollbar:horizontal': {
    height: '8px',
  },
  [`&.${tableCellClasses.head}`]: {
    fontFamily: 'Olympic Sans',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 500,
    alignContent: 'center',
    borderLeft: '0.5px solid',
    padding: '4px 6px',
    borderColor: theme.palette.divider,
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
      lineHeigh: 'normal',
    },
  },
}));
