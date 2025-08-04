import { styled, TableCell, tableCellClasses } from '@mui/material';

export const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    //backgroundColor: lightenHexColor(theme.palette.primary.dark, 0.9),
    backgroundColor: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[900],
    }),
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    fontWeight: 400,
  },
}));
