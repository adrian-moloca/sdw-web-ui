import { t } from 'i18next';
import { memo } from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';

export const WhatCard = memo(() => {
  const content = t('landing.what-content', { returnObjects: true }) as string[];
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  return (
    <Container maxWidth="lg">
      <Box sx={{ px: 4, py: isMobile ? 8 : 12 }}>
        <Typography variant="h2" gutterBottom>
          {t('landing.what')}
        </Typography>
        {content.map((text, index) => (
          <Typography
            key={`${text}-${index}`}
            component={'div'}
            gutterBottom
            variant="subtitle1"
            sx={{ mb: 4 }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </Box>
    </Container>
  );
});
