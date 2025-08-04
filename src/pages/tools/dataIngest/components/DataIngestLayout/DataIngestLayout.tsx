import { Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { PageContainer } from '@toolpad/core';
import { useState, type SyntheticEvent } from 'react';
import { t } from 'i18next';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import orderBy from 'lodash/orderBy';
import { ButtonTabPrimary, SearchControl } from 'components';
import { useSecurityProfile } from 'hooks';
import { MenuFlagEnum } from 'models';
import { IngestControl } from '../IngestControl';
import baseConfig from 'baseConfig';

const locationAtom = atomWithHash('tab', '1');

type Props = {
  data: Array<any>;
};

export const DataIngestLayout = (props: Props) => {
  const { checkPermission } = useSecurityProfile();
  const [searchRanking, setSearchRanking] = useState('');
  const [searchH2H, setSearchH2H] = useState('');

  const [value, setValue] = useAtom(locationAtom);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  checkPermission(MenuFlagEnum.Administrator);

  const ingest_rankings = props.data.filter((x: any) => x.type === 'ranking');
  const ingest_h2h = props.data.filter((x: any) => x.type === 'h2H');
  const ingest_performance = props.data.filter((x: any) => x.type === 'performance');
  const ingest_results = props.data.filter((x: any) => x.type === 'results');
  const ingest_standings = props.data.filter((x: any) => x.type === 'standings');
  const ingest_records = props.data.filter((x: any) => x.type === 'records');
  const ingest_qualifiers = props.data.filter((x: any) => x.type === 'qualifiers');
  const rankingData =
    searchRanking.length > 0
      ? ingest_rankings.filter(
          (x: any) =>
            x.disciplineCode?.toLowerCase().indexOf(searchRanking.toLowerCase()) > -1 ||
            x.source?.toLowerCase().indexOf(searchRanking.toLowerCase()) > -1
        )
      : ingest_rankings;
  const h2hData =
    searchH2H.length > 0
      ? ingest_h2h.filter(
          (x: any) =>
            x.disciplineCode?.toLowerCase().indexOf(searchH2H.toLowerCase()) > -1 ||
            x.source?.toLowerCase().indexOf(searchH2H.toLowerCase()) > -1
        )
      : ingest_h2h;

  return (
    <PageContainer
      maxWidth="xl"
      title=""
      breadcrumbs={[
        { title: t('navigation.Tools'), path: '/' },
        { title: t('navigation.DataIngest'), path: '/data-ingest' },
      ]}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            aria-label={t('navigation.DataIngest')}
            variant="scrollable"
          >
            <ButtonTabPrimary label={t('general.world-rankings')} value="1" />
            <ButtonTabPrimary label={t('navigation.HeadToHead')} value="2" />
            <ButtonTabPrimary label={t('general.standings')} value="3" />
            <ButtonTabPrimary label={t('general.performance')} value="4" />
            <ButtonTabPrimary label={t('general.results')} value="5" />
            <ButtonTabPrimary label={t('general.records')} value="6" />
            <ButtonTabPrimary label="OG 2026" value="7" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ px: 0, py: 1 }}>
          <Grid container spacing={baseConfig.gridSpacing}>
            <Grid size={12}>
              <Stack direction="row">
                <Box sx={{ flexGrow: 1 }} />
                <SearchControl onChange={(e: any) => setSearchRanking(e.target.value)} />
              </Stack>
            </Grid>
            {orderBy(rankingData, 'disciplineCode').map((e: any) => (
              <IngestControl dataItem={e} key={e.disciplineCode} type="ranking" />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0, py: 1 }}>
          <Grid container spacing={baseConfig.gridSpacing}>
            <Grid size={12}>
              <Stack direction="row">
                <Box sx={{ flexGrow: 1 }} />
                <SearchControl onChange={(e: any) => setSearchH2H(e.target.value)} />
              </Stack>
            </Grid>
            {orderBy(h2hData, 'disciplineCode').map((e: any) => (
              <IngestControl dataItem={e} key={e.disciplineCode} type="h2h" />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value="3" sx={{ px: 0, py: 1 }}>
          <Grid container spacing={baseConfig.gridSpacing}>
            {orderBy(ingest_standings, 'disciplineCode').map((e: any) => (
              <IngestControl dataItem={e} key={e.disciplineCode} type="standings" />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value="4" sx={{ px: 0, py: 1 }}>
          <Grid container spacing={baseConfig.gridSpacing}>
            {orderBy(ingest_performance, 'disciplineCode').map((e: any) => (
              <IngestControl dataItem={e} key={e.disciplineCode} type="performance" />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value="5" sx={{ px: 0, py: 1 }}>
          <Grid container spacing={baseConfig.gridSpacing}>
            {orderBy(ingest_results, 'disciplineCode').map((e: any) => (
              <IngestControl dataItem={e} key={e.disciplineCode} type="results" />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value="6" sx={{ px: 0, py: 1 }}>
          <Grid container spacing={baseConfig.gridSpacing}>
            {orderBy(ingest_records, 'disciplineCode').map((e: any) => (
              <IngestControl dataItem={e} key={e.disciplineCode} type="records" />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value="7" sx={{ px: 0, py: 1 }}>
          <Grid container spacing={baseConfig.gridSpacing}>
            {ingest_qualifiers.map((e: any) => (
              <IngestControl dataItem={e} key={e.disciplineCode} type="qualifiers" />
            ))}
          </Grid>
        </TabPanel>
      </TabContext>
    </PageContainer>
  );
};
