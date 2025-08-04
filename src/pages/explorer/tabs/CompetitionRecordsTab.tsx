import { Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import {
  CompetitorChip,
  EventChip,
  GenericLoadingPanel,
  IrmResultChip,
  MainCard,
  OrganisationChip,
  RecordChip,
  StartDateChip,
  StripedDataGrid,
  TypographyLink,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { formatAthleteName } from '_helpers';
import baseConfig from 'baseConfig';
import groupBy from 'lodash/groupBy';
import { Box } from '@mui/system';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';

export const CompetitionRecordsTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.parameter.type);
  const apiService = useApiService();

  const url = `${config.apiNode}/${props.parameter.id}/records`;
  const { data, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_records`],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const groupedDate = groupBy(
    orderBy(rowsWithOrder, ['discipline.title', 'event.title']),
    'discipline.id'
  );
  const columns: GridColDef[] = [
    {
      field: 'event',
      headerName: t('general.event'),
      width: 180,
      flex: 1,
      sortable: true,
      valueGetter: (_value, row) => row.event.title,
      renderCell: (params: GridRenderCellParams) => (
        <EventChip data={params.row.event} withRoute={true} />
      ),
    },
    {
      field: 'organisation',
      headerName: t('general.noc'),
      width: 90,
      sortable: true,
      valueGetter: (_value, row) => row.organisation.country,
      renderCell: (params: GridRenderCellParams) => (
        <OrganisationChip data={params.row.organisation} extended={false} variant="body1" />
      ),
    },
    {
      field: 'competitor',
      headerName: t('general.name'),
      minWidth: 200,
      flex: 1,
      sortable: true,
      valueGetter: (_value, row) =>
        row.person ? formatAthleteName(row.person) : row.participationName,
      renderCell: (params: GridRenderCellParams) =>
        params.row.person ? (
          <CompetitorChip data={params.row.person} discipline={''} />
        ) : (
          <TypographyLink value={params.row.participationName} />
        ),
    },
    {
      field: 'type',
      headerName: t('general.record'),
      width: 150,
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{get(params.row, 'type.title') ?? get(params.row, 'event.title')}</Typography>
      ),
    },
    {
      field: 'resultValue',
      headerName: t('general.result'),
      minWidth: 110,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <IrmResultChip
          value={params.row.resultValue}
          valueType={params.row.resultType}
          irm={''}
          inline={false}
        />
      ),
    },
    {
      field: 'recordDate',
      headerName: t('general.date'),
      minWidth: 170,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <StartDateChip data={params.row} />,
    },
    {
      field: 'levels',
      headerName: t('general.type'),
      minWidth: 180,
      sortable: true,
      valueGetter: (_value, row) => row.levels.join(','),
      renderCell: (params: GridRenderCellParams) => (
        <RecordChip value={params.row.levels?.map((x: string) => ({ level: x }))} />
      ),
    },
    {
      field: 'equalled',
      headerName: t('general.equalled'),
      minWidth: 90,
      sortable: true,
      type: 'boolean',
    },
  ];
  if (isLoading) return <GenericLoadingPanel loading={true} />;
  return (
    <Grid container spacing={2}>
      {Object.keys(groupedDate).map((group: any) => {
        const groupData = groupedDate[group];
        return (
          <Grid size={12} key={group}>
            <MainCard
              title={
                <Typography variant="h6" fontWeight={500}>
                  {groupData[0].discipline.title}
                </Typography>
              }
              content={false}
              border={false}
              divider={false}
              expandable={true}
              headerSX={{ p: 0 }}
            >
              <Box sx={{ height: 300 }}>
                <StripedDataGrid
                  rows={groupData}
                  columns={columns}
                  loading={isLoading}
                  getRowId={(row) => row.order}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  hideFooter
                  rowHeight={baseConfig.defaultRowHeight ?? 36}
                  density="compact"
                  getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                  }
                />
              </Box>
            </MainCard>
          </Grid>
        );
      })}
    </Grid>
  );
};
