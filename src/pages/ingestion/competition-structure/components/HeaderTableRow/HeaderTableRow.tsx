import { styled, TableRow } from '@mui/material';

export const HeaderTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '& td': {
    fontSize: theme.typography.body2.fontSize,
  },
  '& th': {
    fontSize: theme.typography.body2.fontSize,
  },
}));
