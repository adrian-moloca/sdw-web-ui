import { useQuery } from '@tanstack/react-query';
import type { TCardProps } from 'types/explorer';
import useApiService from 'hooks/useApiService';
import { apiConfig } from 'config/app.config';
import { ErrorPanel, GenericLoadingPanel, RoundCard } from 'components';
import { UnitHeader } from '../UnitHeader';
import { ScheduleStatusChip } from '../ScheduleDisplay';
import { CompetitorTable } from '../CompetitorTable';
import { UnitSubUnits } from '../UnitSubUnits';

export const UnitDisplay = ({ data: sourceData, discipline }: TCardProps) => {
  const apiService = useApiService();

  const url = `${apiConfig.apiUsdmEndPoint}/units/${sourceData.id}`;
  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiService.fetch(url),
  });

  const unit = isLoading ? {} : (data?.data ?? {});

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  const hasSubunits = unit.subunits && unit.subunits.length > 0;
  const hasCompetitors = unit.competitors && unit.competitors.length > 0;

  if (!hasCompetitors && !hasSubunits) return null;
  if (hasSubunits && !hasCompetitors) {
    return <UnitSubUnits data={unit.subunits} discipline={discipline} />;
  }
  return (
    <RoundCard title={<UnitHeader data={unit} />} secondary={<ScheduleStatusChip data={unit} />}>
      {hasCompetitors && (
        <CompetitorTable
          discipline={discipline}
          data={unit.competitors}
          officials={unit.officials}
        />
      )}
      {hasSubunits && <UnitSubUnits data={unit.subunits} discipline={discipline} />}
    </RoundCard>
  );
};
