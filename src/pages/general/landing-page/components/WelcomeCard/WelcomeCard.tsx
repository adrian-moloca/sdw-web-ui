import Login from '@mui/icons-material/Login';
import PersonAddOutlined from '@mui/icons-material/PersonAddOutlined';
import { t } from 'i18next';
import { memo } from 'react';
import { Typography, Button, Stack } from '@mui/material';
import { Grid, useMediaQuery, Container } from '@mui/system';
import authService from 'services/auth';

export const WelcomeCard = memo(() => {
  const content = t('landing.welcome-intro', { returnObjects: true }) as string[];
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ py: isMobile ? 6 : 16 }}>
        <Grid size={isMobile ? 12 : 5}>
          <Typography variant="h3" gutterBottom>
            {t('general.welcome')}
          </Typography>
          <Typography variant="h1" gutterBottom>
            {t('landing.welcome')}
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            {content[0]}
          </Typography>
        </Grid>
        <Grid size={isMobile ? 12 : 7}>
          {content.slice(1).map((text, index) => (
            <Typography
              key={`${text}-${index}`}
              component={'div'}
              gutterBottom
              variant="subtitle1"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
          <Stack spacing={2} direction="row" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<Login />}
              onClick={() => authService.login()}
            >
              {t('actions.buttonLogin')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonAddOutlined />}
              component="a"
              href="/access-request"
            >
              {t('actions.buttonRequestAccess')}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
});
