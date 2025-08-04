import React from 'react';

import logoWhite from 'assets/images/logo-white-small.svg';
import logoDark from 'assets/images/logo-black-small.svg';
import { t } from 'i18next';
import { Box, Stack, Typography, useColorScheme } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="secondary" align="center">
      {'Copyright © '}
      <a href="https://olympics.com/">
        {t('main.project.company')} {t('main.project.slogan')}
      </a>{' '}
      {new Date().getFullYear()}
      {'. '}
      <i>{t('main.footer.slogan')}</i>
    </Typography>
  );
}

export const MasterFooter = (): React.ReactElement => {
  const { mode } = useColorScheme();
  return (
    <Box component="footer" sx={{ py: 2, mt: 'auto', width: '100%' }}>
      <Stack direction={'row'} spacing={1} justifyContent={'space-between'} alignItems={'center'}>
        <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
          <img
            src={mode == 'light' ? logoDark : logoWhite}
            alt={t('main.project.name')}
            style={{ height: 30, marginRight: 4 }}
          />
          <Copyright />
        </Stack>
      </Stack>
    </Box>
  );
};
