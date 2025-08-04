import { Typography } from '@mui/material';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import {
  CompetitorChip,
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
import get from 'lodash/get';

export const EventRecordsTab = (props: IPanelTabProps) => {
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

  const columns: GridColDef[] = [
    {
      field: 'order',
      headerName: '#',
      width: 50,
      sortable: true,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{get(params.row, 'order')}</Typography>
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
        <Typography>{get(params.row, 'type.title')}</Typography>
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
      minWidth: 130,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <StartDateChip data={params.row} format={baseConfig.generalDateFormat} />
      ),
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

  if (!isLoading && rowsWithOrder.length === 0)
    return (
      <MainCard>
        <Typography sx={{ my: 4, textAlign: 'center' }}>
          {t('general.no-records-message')
            .replace('{0}', props.data?.title)
            .replace('{1}', props.data?.competition?.title)}
        </Typography>
      </MainCard>
    );
  return (
    <MainCard>
      <StripedDataGrid
        rows={rowsWithOrder}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.order}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter
        rowHeight={baseConfig.defaultRowHeight ?? 36}
        density="compact"
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      />
    </MainCard>
  );
};
