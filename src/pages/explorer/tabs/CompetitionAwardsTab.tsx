import { t } from 'i18next';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import { Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { ButtonTab, ErrorPanel, GenericLoadingPanel } from 'components';
import type { IPanelTabProps } from 'types/views';
import { SectionCard } from 'components/cards/SectionCard';
import {
  AwardAthleteChart,
  AwardDisciplineChart,
  AwardEventChart,
  AwardTeamChart,
  MedalsByNoc,
} from '../components';
import { TabContext, TabList, TabPanel } from '@mui/lab';

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
  const [value, setValue] = useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label={t('general.rounds')}
          sx={{ '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
        >
          <ButtonTab label={t('charts.medals-by-noc')} value={0} />
          <ButtonTab label={t('charts.medals-by-discipline')} value={1} />
          <ButtonTab label={t('charts.medals-by-athlete')} value={2} />
          <ButtonTab label={t('charts.medals-by-team')} value={3} />
          <ButtonTab label={t('charts.medals-by-event')} value={4} />
        </TabList>
        <TabPanel value={0} sx={{ px: 0, pt: 1 }}>
          <MedalsByNoc
            parameter={parameter}
            data={inputData}
            parameters={parameters}
            includeHeader={includeHeader}
            readOnly={readOnly}
          />
        </TabPanel>
        <TabPanel value={1} sx={{ px: 0, pt: 1 }}>
          <AwardDisciplineChart data={data} />
        </TabPanel>
        <TabPanel value={2} sx={{ px: 0, pt: 1 }}>
          <AwardAthleteChart data={data} />
        </TabPanel>
        <TabPanel value={3} sx={{ px: 0, pt: 1 }}>
          <AwardTeamChart data={data} />
        </TabPanel>
        <TabPanel value={4} sx={{ px: 0, pt: 1 }}>
          <AwardEventChart data={data} config={config} />
        </TabPanel>
      </TabContext>
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
