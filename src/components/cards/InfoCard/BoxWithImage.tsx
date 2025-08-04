import React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

type Props = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  isCritical?: boolean;
  sx?: SxProps<Theme>;
};

const BoxWithImageComponent = ({ src, alt, width, height, isCritical, sx }: Props) => {
  return (
    <Box
      component="img"
      src={src} // Fallback for older browsers
      srcSet={`${src} 1x, ${src} 2x`}
      alt={alt}
      aria-label={alt}
      width={width}
      height={height}
      sx={{ objectFit: 'contain', ...sx }}
      loading={isCritical === true ? 'eager' : 'lazy'}
    />
  );
};

export const BoxWithImage = React.memo(BoxWithImageComponent);
