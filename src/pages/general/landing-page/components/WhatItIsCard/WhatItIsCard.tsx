import { t } from 'i18next';
import { memo } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { olympicsDesignColors } from 'themes/colors';

export const WhatItIsCard = memo(() => {
  const content = t('landing.what-it-is-content', { returnObjects: true }) as string[];
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  return (
    <Box
      sx={[
        (theme) => ({
          px: isMobile ? theme.spacing(4) : theme.spacing(30),
          py: theme.spacing(20),
          background: theme.palette.background.paper,
        }),
        (theme) =>
          theme.applyStyles('dark', {
            px: isMobile ? theme.spacing(4) : theme.spacing(30),
            py: theme.spacing(20),
            background: olympicsDesignColors.dark.general.background,
          }),
      ]}
    >
      {content.map((text, index) => (
        <Typography
          key={`${text}-${index}`}
          component={'div'}
          variant="quote"
          textAlign={'center'}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ))}
    </Box>
  );
});
