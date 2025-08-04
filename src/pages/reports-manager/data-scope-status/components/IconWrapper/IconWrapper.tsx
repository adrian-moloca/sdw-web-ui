import type { ReactNode } from 'react';
import { Box } from '@mui/material';

type Props = {
  icon: ReactNode;
  color: string;
  backgroundColor: string;
};

export const IconWrapper = ({ icon, color, backgroundColor }: Props) => {
  return (
    <Box
      sx={{
        color,
        backgroundColor,
        borderRadius: '4px',
        position: 'absolute',
        width: '32px',
        height: '32px',
        top: 10,
        right: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icon}
    </Box>
  );
};
