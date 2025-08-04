import { t } from 'i18next';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Box, Chip, Grid, Typography, useTheme } from '@mui/material';
import { profileTitle } from '_helpers/utils';

export const WelcomeUserCard = memo(() => {
  const auth = useSelector((x: RootState) => x.auth);
  const theme = useTheme();
  const userName = auth.user?.fullName ?? auth.user?.loginName;
  const content = t('landing.welcome-intro', { returnObjects: true }) as string[];
  return (
    <>
      <Grid container size={4}>
        <Box sx={{ px: 4, py: 8 }}>
          <Typography variant="h3" gutterBottom>
            {t('general.hello')}
          </Typography>
          <Typography variant="h1">{userName}</Typography>
          <Typography gutterBottom variant="subtitle1">
            {content[0]}
          </Typography>
          <Typography gutterBottom variant="body1" sx={{ pt: 2 }}>
            {t('messages.your-profile')}
          </Typography>
          <Chip
            label={profileTitle(auth)}
            color="primary"
            sx={{ fontSize: theme.typography.body1.fontSize, borderRadius: 0 }}
          />
        </Box>
      </Grid>
      <Grid container size={8}>
        <Box sx={{ px: 4, py: 16 }}>
          {content.slice(1).map((text, index) => (
            <Typography
              key={`${text}-${index}`}
              component={'div'}
              gutterBottom
              variant="subtitle1"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </Box>
      </Grid>
    </>
  );
});
