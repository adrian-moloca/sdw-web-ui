import { Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ErrorPanel, GenericLoadingPanel, RoundCard } from 'components';
import useApiService from 'hooks/useApiService';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { t } from 'i18next';
import { UnitMatchNavigation } from '../UnitMatchNavigation';
import { useTranslation } from 'react-i18next';

type Props = {
  data: any;
  discipline: string;
  showTitle: boolean;
  link: string;
};
export const PhaseUnitsDisplay = ({ data: sourceData, showTitle, discipline, link }: Props) => {
  const apiService = useApiService();
  const { i18n } = useTranslation();
  const { data, error, isLoading } = useQuery({
    queryKey: [link, i18n.language],
    queryFn: () => apiService.fetch(link.replace('?trim=3', '') + '?languageCode=' + i18n.language),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const units = Array.isArray(dataContent)
    ? dataContent
    : dataContent.units && Array.isArray(dataContent.units)
      ? dataContent.units
      : [];

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  const totalUnits = units?.length ?? 0;

  if (totalUnits == 0) return null;

  if (showTitle)
    return (
      <RoundCard
        title={
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Typography variant="body1">{`${totalUnits} ${t('general.rounds')}`}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('action.open-for-more-details')}
            </Typography>
          </Stack>
        }
        icon={GridViewOutlinedIcon}
      >
        <UnitMatchNavigation
          data={units}
          discipline={discipline}
          phaseType={sourceData.stageType ?? sourceData.phaseType}
        />
      </RoundCard>
    );
  return (
    <UnitMatchNavigation
      data={units}
      discipline={discipline}
      phaseType={sourceData.stageType ?? sourceData.phaseType}
    />
  );
};
