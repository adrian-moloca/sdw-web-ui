import { Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import sortBy from 'lodash/sortBy';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { ErrorPanel, GenericLoadingPanel } from 'components';
import type { IPanelTabProps } from 'types/views';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { AwardCard } from '../components';

export const EventAwardsTab = (props: IPanelTabProps) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();

  const config = getConfig(props.parameter.type);

  const url = `${config.apiNode}/${props.parameter.id}/awards`;
  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_awards`],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);

  if (isLoading) return <GenericLoadingPanel loading={true} />;

  if (error) return <ErrorPanel error={error} />;

  const medalOrder: Record<string, number> = { AWSB$GOLD: 1, AWSB$SILVER: 2, AWSB$BRONZE: 3 };

  if (dataContent.length === 0) {
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.awards').toLowerCase())}
      </Alert>
    );
  }

  const sortedParticipants = sortBy(dataContent, (p: any) => medalOrder[p.subClass || ''] ?? 99);
  return (
    <Grid container spacing={2}>
      {sortedParticipants.map((row: any, i: number) => (
        <Grid size={{ xs: 12, md: 4 }} key={i}>
          <AwardCard data={row} />
        </Grid>
      ))}
    </Grid>
  );
};
