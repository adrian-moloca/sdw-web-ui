import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { EntityType } from 'models';
import { useQuery } from '@tanstack/react-query';
import appConfig from 'config/app.config';
import { getBreadCrumbData } from 'utils/views';
import { BorderedTable, ErrorPanel, GenericLoadingPanel } from 'components';
import { PageContainer } from '@toolpad/core';
import { BasicPageHeader } from 'layout/page.layout';
import Grid from '@mui/material/Grid';
import { Table, TableBody } from '@mui/material';
import { DisplayMainField } from '../DisplayMainField';
import { DisplayBioField } from '../DisplayBioField';
import { t } from 'i18next';
import { DisplayAgeField } from '../DisplayAgeField';
import { DisplayWinField } from '../DisplayWinField';
import { DisplayRound } from '../DisplayRound';

type Props = { discipline: string; id1: string; id2: string; gender: string };

export const HeadToHeadDisplay = (props: Props): React.ReactElement => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.HeadToHead);

  const { data, error, isLoading } = useQuery({
    queryKey: [`${config.entityName}_${props.id1}${props.id2}${props.gender}`],
    queryFn: () =>
      apiService.fetch(
        `${appConfig.biographiesManagerEndPoint}${config.apiNode}?discipline=${props.discipline}&player1=${props.id1}&player2=${props.id2}&gender=${props.gender}`
      ),
    refetchOnMount: true,
  });

  const breadCrumbs = getBreadCrumbData(data, config);

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (!data?.opponent1) {
    return (
      <ErrorPanel
        error={`Ups! ${props.discipline} ${config.display} is invalid and cannot be displayed.`}
      />
    );
  }

  return (
    <PageContainer
      maxWidth="xl"
      title={config.displayPlural}
      breadcrumbs={breadCrumbs}
      slots={{ header: BasicPageHeader }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Table>
            <TableBody>
              <DisplayMainField opponent1={data.opponent1} opponent2={data.opponent2} />
            </TableBody>
          </Table>
        </Grid>
        <Grid size={12}>
          <BorderedTable>
            <TableBody>
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="id"
                label={t('general.federation-number')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="participationName"
                label={t('general.participants')}
              />
              <DisplayAgeField opponent1={data.opponent1} opponent2={data.opponent2} />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="dateOfBirth"
                label={t('common.dateOfBirth')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="placeOfBirth"
                label={t('general.place-of-birth')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="height"
                label={t('general.height')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="seed"
                label={t('general.seed-number')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="weight"
                label={t('general.weight')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="club"
                label={'Club'}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="gender"
                label={t('common.gender')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="currentWorldRanking"
                label={t('general.current-world-ranking')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="highestWorldRanking"
                label={t('general.highest-world-ranking')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="highestWorldRankingDate"
                label={t('general.highest-world-ranking-date')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="grip"
                label={t('general.grip')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="handedness"
                label={t('general.handedness')}
              />
              <DisplayBioField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                field="rubber"
                label={t('general.rubber')}
              />
              <DisplayWinField
                opponent1={data.opponent1}
                opponent2={data.opponent2}
                data={data.rounds}
              />
            </TableBody>
          </BorderedTable>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            {data.rounds.map((round: any) => (
              <DisplayRound
                data={round}
                key={round.id}
                opponent1={data.opponent1}
                opponent2={data.opponent2}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
