import type { Props } from './types';
import { Box } from '@mui/material';

export const CircularImageCard = ({ imageUrl, size, borderRadius }: Props) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        zIndex: -1,
        borderRadius, // Makes it circular
        position: 'absolute',
        top: '-25%',
        right: '-50px', // Position image to the right of the card, partially overlapping
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
          //background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)', // Gradient effect
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};
