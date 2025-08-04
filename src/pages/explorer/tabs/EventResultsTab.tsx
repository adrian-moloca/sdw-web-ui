import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import { ButtonTab, ErrorPanel, GenericLoadingPanel, MainCard } from 'components';
import { ROUNDS } from 'constants/explorer';
import type { IPanelTabProps } from 'types/views';
import useApiService from 'hooks/useApiService';
import { useModelConfig, useStoreCache } from 'hooks';
import { getRoundTitle, processResults } from 'pages/explorer/utils/event-rounds';
import {
  BracketsDisplayBuilder,
  competitionUnitIdAtom,
  ResultsBuilder,
} from 'pages/explorer/components';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { MasterData } from 'models';

export const EventResultsTab: React.FC<IPanelTabProps> = ({ data: eventData, parameter }) => {
  const apiService = useApiService();
  const { i18n } = useTranslation();
  const { getConfig } = useModelConfig();
  const config = getConfig(parameter.type);
  const [, setUnit] = useAtom(competitionUnitIdAtom);
  const [value, setValue] = useState(0);
  const { dataInfo } = useStoreCache();
  const url = `${config.apiNode}/${parameter.id}/rounds?languageCode=${i18n.language}`;

  const { data, error, isLoading } = useQuery({
    queryKey: [parameter.id, 'rounds'],
    queryFn: () => apiService.fetch(url),
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setUnit(null);
  };

  useEffect(() => setValue(0), [parameter.id]);

  const dataContent = isLoading ? [] : (data?.data ?? []);

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (dataContent.length === 0 || !dataContent?.rounds || dataContent?.rounds.length === 0) {
    return (
      <MainCard>
        <Alert severity="info">
          {t('message.notDataAvailable').replace('{0}', t('general.rounds'))}
        </Alert>
      </MainCard>
    );
  }

  const displayResults = processResults(dataContent).reverse();
  const numRounds = displayResults.length ?? 0;
  const disciplineCode = eventData.discipline?.code ?? eventData.sportDisciplineId;
  const hasBrackets =
    displayResults.filter((x: any) => x.stageType === ROUNDS.BRACKETS_TYPE).length > 0;

  if (numRounds === 1 && !hasBrackets) {
    return (
      <MainCard>
        <ResultsBuilder
          data={displayResults[0]}
          rounds={dataContent.rounds}
          discipline={disciplineCode}
        />
      </MainCard>
    );
  }

  return (
    <TabContext value={value}>
      <TabList
        onChange={handleChange}
        aria-label={t('general.rounds')}
        variant="scrollable"
        sx={{ '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
      >
        {displayResults?.map((row: any, i: number) => (
          <ButtonTab
            key={row.id}
            label={getRoundTitle(row, dataInfo[MasterData.RoundType])}
            value={i}
          />
        ))}
        {hasBrackets && <ButtonTab label={t('general.brackets')} value={numRounds + 1} />}
      </TabList>
      {displayResults?.map((row: any, i: number) => (
        <TabPanel key={`${row.id}_content`} value={i} sx={{ p: 0, pb: 2, pt: 0 }}>
          <MainCard>
            <ResultsBuilder data={row} rounds={dataContent.rounds} discipline={disciplineCode} />
          </MainCard>
        </TabPanel>
      ))}
      {hasBrackets && (
        <TabPanel key={`${ROUNDS.BRACKETS_TYPE}_content`} value={numRounds + 1} sx={{ p: 0 }}>
          <BracketsDisplayBuilder discipline={disciplineCode} parameter={parameter} />
        </TabPanel>
      )}
    </TabContext>
  );
};
