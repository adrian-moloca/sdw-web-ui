import { styled, Table, tableCellClasses, tableClasses, tableRowClasses } from '@mui/material';

export const BorderedTable = styled(Table)(({ theme }) => ({
  '& *::-webkit-scrollbar:horizontal': {
    height: '4px',
  },
  [`&.${tableClasses.root}`]: {
    marginTop: 1,
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '4px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.2rem',
    lineHeigh: 'normal',
  },
  [`.${tableRowClasses.root}`]: {
    '&:last-child td': {
      borderBottom: 0,
    },
  },
  [`.${tableCellClasses.root}`]: {
    '&:last-child td': {
      borderBottom: 0,
    },
  },
}));
