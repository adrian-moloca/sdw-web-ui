import { styled, TableCell, tableCellClasses } from '@mui/material';
import { OlympicColors } from 'themes/colors';

export const OlympicHeaderTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    //backgroundColor: lightenHexColor(theme.palette.primary.dark, 0.9),
    backgroundColor: OlympicColors.YELLOW,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[900],
    }),
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    fontWeight: 400,
  },
}));
