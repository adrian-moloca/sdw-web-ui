import { Badge, BadgeProps, styled } from '@mui/material';

export const TableStyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -8,
    top: 14,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
