import { useQuery } from '@tanstack/react-query';
import { Alert, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import orderBy from 'lodash/orderBy';
import { t } from 'i18next';
import {
  CountryChip,
  DisciplineAvatar,
  ErrorPanel,
  GenericLoadingPanel,
  MainCard,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import { Entry, MasterData } from 'models';
import { formatStartFinishDate, geCountryRegionDisplay, humanize } from '_helpers';
import useApiService from 'hooks/useApiService';
import { filterData } from 'pages/explorer/utils/historical-results';
import { CompetitionResults } from 'pages/explorer/components';
import { useModelConfig, useStoreCache } from 'hooks';

interface Props extends IPanelTabProps {
  categories: Array<Entry>;
}

export const HistoricalResultsCard = ({ parameter, categories, data: propsData }: Props) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const { dataInfo } = useStoreCache();
  const config = getConfig(parameter.type);

  const url = `${config.apiNode}/${parameter.id}/competitions`;
  const { data, error, isLoading } = useQuery({
    queryKey: [parameter.id, `competitions`],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading
    ? []
    : (orderBy(filterData(data?.data, categories), ['startDate', 'title'], 'desc') ?? []);

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (dataContent.length === 0) {
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.competitions'))}
      </Alert>
    );
  }

  const renderFullCompetitionCell = (e: any) => {
    if (e.participation.length > 0) {
      return (
        <DisciplineAvatar
          code={e.participation[0].discipline}
          title={e.participation[0].title}
          size={40}
        />
      );
    }

    return <DisciplineAvatar code={'ATH'} title={'Unknown'} size={42} />;
  };

  const renderParticipantSubHeader = (e: any) => {
    if (e.participation.length > 0) {
      return (
        <>
          <Divider orientation="vertical" flexItem />
          <CountryChip
            code={e.participation[0].organisation?.country}
            hideTitle={false}
            size={'small'}
          />
          <Divider orientation="vertical" flexItem />
          <Typography>{humanize(e.participation[0].title)}</Typography>
        </>
      );
    }

    return null;
  };

  return (
    <>
      {dataContent.map((e: any) => {
        const countryRegion = geCountryRegionDisplay(e);
        return (
          <Grid size={12} key={e.id}>
            <MainCard
              size="tiny"
              title={
                <Typography variant="subtitle1" lineHeight={1}>
                  {e.title}
                </Typography>
              }
              avatar={renderFullCompetitionCell(e)}
              subHeader={
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  {countryRegion && (
                    <>
                      <CountryChip code={e.country} hideTitle={false} size={'small'} />
                      <Typography>{countryRegion}</Typography>
                    </>
                  )}
                  {renderParticipantSubHeader(e)}
                </Stack>
              }
              secondary={
                <Stack>
                  <Typography>{formatStartFinishDate(e)}</Typography>
                  <Typography>
                    {e.categories
                      .map(
                        (x: any) =>
                          dataInfo[MasterData.CompetitionCategory].find((e) => e.key === x)?.value
                      )
                      .join(', ')}
                  </Typography>
                </Stack>
              }
              headerSX={{ p: 1 }}
              contentSX={{ paddingTop: '0.5!important', paddingBottom: '0.5!important' }}
            >
              <CompetitionResults parameter={parameter} id={e.id} data={propsData} />
            </MainCard>
          </Grid>
        );
      })}
    </>
  );
};
