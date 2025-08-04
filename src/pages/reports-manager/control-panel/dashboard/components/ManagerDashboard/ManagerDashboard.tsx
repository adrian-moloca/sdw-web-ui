import Grid from '@mui/material/Grid';
import { useStoreCache } from 'hooks';
import get from 'lodash/get';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import {
  CategoryStats,
  DataQualityStats,
  DeliveryTracking,
  ManagerCompletion,
  ManagerDate,
  PeriodStats,
  QuotaStats,
  ReportsDetails,
} from '../index';
import { t } from 'i18next';

export const ManagerDashboard = () => {
  const { managerSetup } = useStoreCache();

  return (
    <Grid container spacing={2} size={12}>
      <Grid size={12}>
        <Stack direction={'row'} spacing={1}>
          <Typography>{t('general.current-edition')}</Typography>
          <Typography sx={{ fontWeight: 600 }}>
            {get(managerSetup, 'currentEdition.name')}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <ManagerCompletion
          data={managerSetup}
          mode="execution"
          field="rate"
          title={t('general.completion-rate')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <ManagerCompletion
          data={managerSetup}
          mode="delivery"
          field="deliveryRate"
          title={t('general.delivery-completion-rate')}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ManagerDate
          date={get(managerSetup, 'initialDelivery')!}
          color="primary"
          title={t('general.initialDelivery')}
          percentage="20"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ManagerDate
          date={get(managerSetup, 'nextDelivery')!}
          color="warning"
          title={t('general.nextDelivery')}
          percentage="20"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <ManagerDate
          date={get(managerSetup, 'finalDelivery')!}
          color="error"
          title={t('general.finalDelivery')}
          percentage="5"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 8 }}>
        <CategoryStats mode="standard" />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
        <PeriodStats />
      </Grid>
      <Grid container size={{ xs: 12, sm: 12, md: 6 }}>
        <Grid size={12}>
          <ManagerCompletion
            data={managerSetup}
            mode="execution"
            field="dataRate"
            title={t('general.data-completion-rate')}
          />
        </Grid>
        <Grid size={12}>
          <DataQualityStats />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <QuotaStats />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <CategoryStats mode="n20" />
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <DeliveryTracking />
      </Grid>
      <Grid size={12}>
        <ReportsDetails />
      </Grid>
    </Grid>
  );
};
