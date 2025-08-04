import { Button, TextField } from '@mui/material';
import { QuickFilter } from '@mui/x-data-grid-pro';
import { styled } from '@mui/material/styles';

export const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
});

export const StyledTextField = styled(TextField)<{ ownerState: { expanded: boolean } }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
  })
);

export const StyledFilterButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));
