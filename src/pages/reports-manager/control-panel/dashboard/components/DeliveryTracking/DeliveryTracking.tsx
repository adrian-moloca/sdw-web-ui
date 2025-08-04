import { List, Typography } from '@mui/material';
import { useModelConfig, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import { EntityType } from 'models';
import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import { MainCard } from 'components/cards/MainCard';
import { t } from 'i18next';
import { BuildDeliveryCard } from './utils';

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none',
};

export const DeliveryTracking = () => {
  const apiService = useApiService();
  const { getDataSource } = useModelConfig();
  const { managerSetup, dataInfo } = useStoreCache();
  const variables: any = {
    enablePagination: true,
    rows: 5,
    start: 0,
    editionId: managerSetup?.currentEdition?.id,
    sort: [{ column: 'scheduleDate', operator: 'asc' }],
  };

  const { data } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => apiService.post(getDataSource(EntityType.DeliveryPlan).url, variables),
  });

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">{t('general.delivery-plans-tracking')}</Typography>
        </Grid>
        <Grid />
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <List
          component="nav"
          sx={{
            px: 0,
            py: 0,
            '& .MuiListItemButton-root': {
              py: 1.5,
              '& .MuiAvatar-root': avatarSX,
              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
            },
          }}
        >
          {data?.content?.map((plan: any, index: number) => (
            <BuildDeliveryCard key={index} data={plan} dataInfo={dataInfo?.categories} />
          ))}
        </List>
      </MainCard>
    </>
  );
};
