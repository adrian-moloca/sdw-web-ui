import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';

export const SpinningRefresh = styled(RefreshIcon)(() => ({
  animation: 'spin 2s linear infinite',
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}));
