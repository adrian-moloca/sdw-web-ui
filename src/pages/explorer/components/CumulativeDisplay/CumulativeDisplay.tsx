import Grid from '@mui/material/Grid';
import orderBy from 'lodash/orderBy';
import { useQuery } from '@tanstack/react-query';
import { GenericLoadingPanel, ErrorPanel, ButtonTab, RoundCard } from 'components';
import { ROUNDS } from 'constants/explorer';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import {
  CompetitorTable,
  CumulativeHeader,
  PhaseDisplay,
  UnitDisplay,
} from 'pages/explorer/components';
import { Typography } from '@mui/material';
import React from 'react';
import { t } from 'i18next';
import { stripCommonPrefixFromField } from '_helpers';
import { TabContext, TabList, TabPanel } from '@mui/lab';

type Props = {
  data: any;
  discipline: string;
  rounds: Array<any>;
};

export const CumulativeDisplay: React.FC<Props> = ({
  data: sourceData,
  discipline,
  rounds,
}: Props) => {
  const apiService = useApiService();
  const url = `${apiConfig.apiUsdmEndPoint}/stages/${sourceData.id}`;
  const { data, error, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiService.fetch(url),
  });

  const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const dataContent = isLoading ? {} : (data?.data ?? {});
  const stageRounds = stripCommonPrefixFromField(
    orderBy(rounds, 'order').filter((x: any) => x.stage && x.stage.id === sourceData.id),
    'title'
  ).filter((x) => x.title);
  const totalUnits = stageRounds.length;
  const hasCompetitors = (dataContent.cumulative?.competitors ?? []) > 0;
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }
  if (error) {
    return <ErrorPanel error={error} />;
  }
  if (totalUnits == 1 && !hasCompetitors) {
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <RoundCard title={<CumulativeHeader data={dataContent} />}>
            {stageRounds.map((row: any) => (
              <React.Fragment key={`${row.id}_content`}>
                {row.usdmType === ROUNDS.PHASE_TYPE ? (
                  <PhaseDisplay data={row} discipline={discipline} />
                ) : (
                  <UnitDisplay data={row} discipline={discipline} showTitle={true} />
                )}
              </React.Fragment>
            ))}
          </RoundCard>
        </Grid>
      </Grid>
    );
  }
  if (totalUnits < 2) {
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <RoundCard title={<CumulativeHeader data={dataContent} />}>
            <CompetitorTable data={dataContent.cumulative?.competitors} discipline={discipline} />
          </RoundCard>
        </Grid>
        <Grid size={12}>
          {stageRounds.map((row: any) => (
            <React.Fragment key={`${row.id}_content`}>
              {row.usdmType === ROUNDS.PHASE_TYPE ? (
                <PhaseDisplay data={row} discipline={discipline} />
              ) : (
                <UnitDisplay data={row} discipline={discipline} showTitle={true} />
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <RoundCard title={<CumulativeHeader data={dataContent} />}>
          <CompetitorTable data={dataContent.cumulative?.competitors} discipline={discipline} />
        </RoundCard>
      </Grid>
      <Grid size={12}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            sx={{ '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
          >
            {stageRounds.map((row: any, index: number) => (
              <ButtonTab key={row.id} value={index} label={row.title} minWidth={50} />
            ))}
            <Typography variant="subtitle1" sx={{ mr: 4 }}>
              {`${totalUnits} ${t('general.rounds')}`}
            </Typography>
          </TabList>
          {stageRounds.map((row: any, index: number) => (
            <TabPanel key={row.id} value={index} sx={{ px: 0, py: 0 }}>
              <React.Fragment key={`${row.id}_content`}>
                {row.usdmType === ROUNDS.PHASE_TYPE ? (
                  <PhaseDisplay data={row} discipline={discipline} />
                ) : (
                  <UnitDisplay data={row} discipline={discipline} showTitle={true} />
                )}
              </React.Fragment>
            </TabPanel>
          ))}
        </TabContext>
      </Grid>
    </Grid>
  );
};
