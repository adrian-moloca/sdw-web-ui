import React from 'react';
import logoWhite from 'assets/images/logo-white-small.svg';
import { t } from 'i18next';
import { Box, Stack, Typography } from '@mui/material';
import { olympicsDesignColors } from 'themes/colors';

function Copyright() {
  return (
    <Typography
      variant="body1"
      align="center"
      sx={{ color: olympicsDesignColors.base.neutral.grey100 }}
    >
      {'Copyright © '}
      <a href="https://olympics.com/" style={{ color: 'inherit', textDecoration: 'none' }}>
        {t('main.project.company')} {t('main.project.slogan')}
      </a>{' '}
      {new Date().getFullYear()}
      {'. '}
      <i>{t('main.footer.slogan')}</i>
    </Typography>
  );
}

export const MasterFooter = (): React.ReactElement => {
  return (
    <Box
      component="footer"
      sx={{
        p: 4,
        mt: 8,
        width: '100%',
        backgroundColor: olympicsDesignColors.base.neutral.grey900,
      }}
    >
      <Stack direction={'row'} spacing={1} justifyContent={'space-between'} alignItems={'center'}>
        <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
          <img
            src={logoWhite}
            alt={t('main.project.name')}
            style={{ height: 30, marginRight: 4 }}
          />
          <Copyright />
        </Stack>
      </Stack>
    </Box>
  );
};
