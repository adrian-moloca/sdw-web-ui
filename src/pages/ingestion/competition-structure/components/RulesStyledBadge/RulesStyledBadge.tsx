import { Badge, BadgeProps, styled } from '@mui/material';

export const RulesStyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 5,
  },
}));
