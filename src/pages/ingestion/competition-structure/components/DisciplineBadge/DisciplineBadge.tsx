import { Badge, BadgeProps, styled } from '@mui/material';

export const DisciplineBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
