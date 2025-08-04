import { Box } from '@mui/material';
import type { Props } from './types';

export const CircularImageWithGradient = ({ imageUrl, size, borderRadius }: Props) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius, // Makes it circular
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={imageUrl}
        alt="Circular"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Ensures the image covers the entire circle
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)', // Gradient effect
          pointerEvents: 'none', // Prevents the overlay from blocking interaction
        }}
      />
    </Box>
  );
};
