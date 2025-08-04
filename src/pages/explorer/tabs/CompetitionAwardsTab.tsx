import { t } from 'i18next';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import { Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { ErrorPanel, GenericLoadingPanel } from 'components';
import type { IPanelTabProps } from 'types/views';
import { SectionCard } from 'components/cards/SectionCard';
import {
  AwardAthleteChart,
  AwardDisciplineChart,
  AwardEventChart,
  AwardTeamChart,
  MedalsByNoc,
} from '../components';

export const CompetitionAwardsTab = ({
  data: inputData,
  parameter,
  parameters,
  readOnly,
  includeHeader,
}: IPanelTabProps) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(parameter.type);

  const url = `${config.apiNode}/${parameter.id}/awards`;
  const { data, error, isLoading } = useQuery({
    queryKey: [parameter.id, 'awards'],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const [selectedChart, setSelectedChart] = useState('NOC');
  const handleToggle = (_event: React.MouseEvent<HTMLElement>, newGoal: string | null) => {
    if (newGoal !== null) {
      setSelectedChart(newGoal);
    }
  };

  if (isLoading) return <GenericLoadingPanel loading={true} />;

  if (error) return <ErrorPanel error={error} />;

  if (dataContent.length === 0) {
    if (includeHeader) return <></>;

    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.medals').toLowerCase())}
      </Alert>
    );
  }

  const renderMedalLists = () => {
    return (
      <Grid container size={12} spacing={1}>
        <Grid size={12} display={'flex'} alignItems="center" justifyContent="center">
          <ToggleButtonGroup
            value={selectedChart}
            exclusive
            onChange={handleToggle}
            aria-label="Evaluation Goals"
            size="small"
          >
            <ToggleButton
              value="NOC"
              aria-label={t('charts.medals-by-noc')}
              sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
            >
              {t('charts.medals-by-noc').toUpperCase()}
            </ToggleButton>
            <ToggleButton
              value="DISCIPLINE"
              aria-label={t('charts.medals-by-discipline')}
              sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
            >
              {t('charts.medals-by-discipline').toUpperCase()}
            </ToggleButton>
            <ToggleButton
              value="ATHLETE"
              aria-label={t('charts.medals-by-athlete')}
              sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
            >
              {t('charts.medals-by-athlete').toUpperCase()}
            </ToggleButton>
            <ToggleButton
              value="TEAM"
              aria-label={t('charts.medals-by-team')}
              sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
            >
              {t('charts.medals-by-team').toUpperCase()}
            </ToggleButton>
            <ToggleButton
              value="EVENT"
              aria-label={t('charts.medals-by-event')}
              sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
            >
              {t('charts.medals-by-event').toUpperCase()}
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {selectedChart === 'DISCIPLINE' && (
          <Grid size={12}>
            <AwardDisciplineChart data={data} />
          </Grid>
        )}
        {selectedChart === 'EVENT' && (
          <Grid size={12}>
            <AwardEventChart data={data} config={config} />
          </Grid>
        )}
        {selectedChart === 'ATHLETE' && (
          <Grid size={12}>
            <AwardAthleteChart data={data} />
          </Grid>
        )}
        {selectedChart === 'TEAM' && (
          <Grid size={12}>
            <AwardTeamChart data={data} />
          </Grid>
        )}
        {selectedChart === 'NOC' && (
          <Grid container size={12}>
            <MedalsByNoc
              parameter={parameter}
              data={inputData}
              parameters={parameters}
              includeHeader={includeHeader}
              readOnly={readOnly}
            />
          </Grid>
        )}
      </Grid>
    );
  };

  if (includeHeader) {
    return (
      <Grid size={12}>
        <SectionCard title={t('general.medals')} icon={WorkspacePremiumOutlined}>
          {renderMedalLists()}
        </SectionCard>
      </Grid>
    );
  }
  return renderMedalLists();
};
