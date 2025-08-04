import { Alert, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { GenericLoadingPanel, ErrorPanel, ButtonTab, RoundCard } from 'components';
import useApiService from 'hooks/useApiService';
import {
  cleanTitles,
  competitionUnitIdAtom,
  CompetitorTable,
  PhaseUnitsDisplay,
} from 'pages/explorer/components';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import React from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

type Props = {
  data: any;
  discipline: string;
};

export const PoolsDisplay = ({ data: sourceData, discipline }: Props) => {
  const apiService = useApiService();
  const { i18n } = useTranslation();
  const url = `/stages/${sourceData.id}?languageCode=${i18n.language}`;
  const [, setUnit] = useAtom(competitionUnitIdAtom);
  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? {} : (data?.data ?? {});
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setUnit(null);
  };
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (!dataContent.pools) {
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.pool').toLowerCase())}
      </Alert>
    );
  }

  const anyPoolHasCompetitors = dataContent.pools.some(
    (pool: any) => pool.competitors && pool.competitors.length > 0
  );
  if (dataContent.pools.length == 1) {
    return (
      <Grid container spacing={2}>
        {dataContent.pools.map((pool: any) => (
          <Stack key={pool.id} spacing={4}>
            <RoundCard title={pool.displayTitle}>
              <CompetitorTable data={pool.competitors} discipline={discipline} />
            </RoundCard>
            {pool.competitors?.length > 0 && (
              <PhaseUnitsDisplay
                data={pool}
                discipline={discipline}
                link={`phases/${pool.id}/units`}
                showTitle={false}
              />
            )}
          </Stack>
        ))}
        {!anyPoolHasCompetitors && (
          <PhaseUnitsDisplay
            data={sourceData}
            discipline={discipline}
            link={`stages/${sourceData.id}/units`}
            showTitle={true}
          />
        )}
      </Grid>
    );
  }
  const formatPools = cleanTitles(dataContent.pools);
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TabContext value={value}>
          <TabList
            centered
            onChange={handleChange}
            sx={{ '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
          >
            {formatPools.map((pool: any, index: number) => (
              <ButtonTab key={pool.id} value={index} minWidth={50} label={pool.displayTitle} />
            ))}
          </TabList>
          {formatPools.map((pool: any, index: number) => (
            <TabPanel key={pool.id} value={index} sx={{ px: 0, py: 0 }}>
              <Stack key={pool.id} spacing={4}>
                <RoundCard title={pool.displayTitle}>
                  <CompetitorTable data={pool.competitors} discipline={discipline} />
                </RoundCard>
                {pool.competitors?.length > 0 && (
                  <PhaseUnitsDisplay
                    data={pool}
                    discipline={discipline}
                    link={`phases/${pool.id}/units`}
                    showTitle={false}
                  />
                )}
              </Stack>
            </TabPanel>
          ))}
        </TabContext>
      </Grid>
      {!anyPoolHasCompetitors && (
        <PhaseUnitsDisplay
          data={sourceData}
          discipline={discipline}
          link={`stages/${sourceData.id}/units`}
          showTitle={true}
        />
      )}
    </Grid>
  );
};
