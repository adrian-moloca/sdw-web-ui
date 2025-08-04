import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import { Alert, List, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Grid from '@mui/material/Grid';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import { t } from 'i18next';
import { ErrorPanel, GenericLoadingPanel, MainCard, SectionCard } from 'components';
import type { IPanelTabProps } from 'types/views';
import type { MedalType } from 'types/explorer';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import {
  MedalKpiCard,
  MedalCompetition,
  MedalCompetitionChartDetails,
  MedalDisciplineChartDetails,
  MedalEventChartDetails,
  MedalEvolutionChartDetails,
} from 'pages/explorer/components';

const BuildList = (param: { dataContent: Array<any>; field: MedalType; title: string }) => {
  const hasItem = sumBy(param.dataContent, param.field);

  if (hasItem === 0) return null;

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <MainCard content={false} border={false} boxShadow={false} sx={{ height: '100%' }}>
        <Grid container spacing={1}>
          <Grid size={12}>
            <MedalKpiCard
              field={param.field}
              data={{ value: sumBy(param.dataContent, param.field).toString(), title: param.title }}
            />
          </Grid>
          <Grid size={12}>
            <List sx={{ py: 0, maxHeight: '30rem', overflow: 'auto' }} tabIndex={0}>
              {param.dataContent
                .filter((x: any) => get(x, param.field) > 0)
                .map((x: any) => (
                  <MedalCompetition key={x.event?.id} data={x} field={param.field} />
                ))}
            </List>
          </Grid>
        </Grid>
      </MainCard>
    </Grid>
  );
};

export const MedalTab = (props: IPanelTabProps) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(props.parameter.type);

  const [selectedChart, setSelectedChart] = useState('ALL');

  const url = `${config.apiNode}/${props.parameter.id}/medals`;

  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_medals`],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading
    ? []
    : (orderBy(data?.data, ['competition.startDate', 'competition.title'], 'desc') ?? []);

  const handleToggle = (_event: React.MouseEvent<HTMLElement>, newGoal: string | null) => {
    if (newGoal !== null) {
      setSelectedChart(newGoal);
    }
  };

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (dataContent.length === 0) {
    if (props.includeHeader) return <></>;

    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.medals').toLowerCase())}
      </Alert>
    );
  }

  const MedalLists = (
    <Grid container size={12} spacing={1}>
      <Grid size={12} display="flex" alignItems="center" justifyContent="center">
        <ToggleButtonGroup
          value={selectedChart}
          exclusive
          onChange={handleToggle}
          aria-label="Evaluation Goals"
          size="small"
        >
          <ToggleButton
            value="ALL"
            aria-label={t('charts.medals-breakdown')}
            sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
          >
            {t('charts.medals-breakdown').toUpperCase()}
          </ToggleButton>
          <ToggleButton
            value="DISCIPLINE"
            aria-label={t('charts.medals-by-discipline')}
            sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
          >
            {t('charts.medals-by-discipline').toUpperCase()}
          </ToggleButton>
          <ToggleButton
            value="COMPETITION"
            aria-label={t('charts.medals-by-competition')}
            sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
          >
            {t('charts.medals-by-competition').toUpperCase()}
          </ToggleButton>
          <ToggleButton
            value="EVOLUTION"
            aria-label={t('charts.medals-evolution')}
            sx={{ px: 2, minWidth: 180, fontWeight: 400 }}
          >
            {t('charts.medals-evolution').toUpperCase()}
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
          <MedalDisciplineChartDetails data={data} config={config} />
        </Grid>
      )}
      {selectedChart === 'COMPETITION' && (
        <Grid size={12}>
          <MedalCompetitionChartDetails data={data} config={config} />
        </Grid>
      )}
      {selectedChart === 'EVENT' && (
        <Grid size={12}>
          <MedalEventChartDetails data={data} config={config} />
        </Grid>
      )}
      {selectedChart === 'EVOLUTION' && (
        <Grid size={12}>
          <MedalEvolutionChartDetails data={data} config={config} />
        </Grid>
      )}
      {selectedChart === 'ALL' && (
        <>
          <BuildList dataContent={dataContent} field="golden" title={t('general.golden')} />
          <BuildList dataContent={dataContent} field="silver" title={t('general.silver')} />
          <BuildList dataContent={dataContent} field="bronze" title={t('general.bronze')} />
        </>
      )}
    </Grid>
  );

  if (props.includeHeader) {
    return (
      <Grid size={12}>
        <SectionCard title={t('general.medals')} icon={WorkspacePremiumOutlined}>
          {MedalLists}
        </SectionCard>
      </Grid>
    );
  }

  return MedalLists;
};
