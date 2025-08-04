import { Box, Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { MainCard } from 'components/cards/MainCard';
import { useState } from 'react';
import { t } from 'i18next';
import { PeriodStatsChart } from '../PeriodStatsChart';

export const PeriodStats = () => {
  const [slot, setSlot] = useState('week');

  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">{t('general.activity')}</Typography>
        </Grid>
        <Grid>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              size="small"
              onClick={() => setSlot('month')}
              color={slot === 'month' ? 'primary' : 'secondary'}
              variant={slot === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setSlot('week')}
              color={slot === 'week' ? 'primary' : 'secondary'}
              variant={slot === 'week' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <PeriodStatsChart />
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
};
