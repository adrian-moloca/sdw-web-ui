import Grid from '@mui/material/Grid';
import { Alert, Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import {
  ErrorPanel,
  GenericLoadingPanel,
  MainCard,
  OrganisationChip,
  StripedDataGrid,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { ColumnData } from 'models';
import { AwardNocChart } from '../AwardNocChart';
import { MedalNumberDisplay } from '../MedalNumberDisplay';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';

export const MedalsByNoc = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.parameter.type);
  const apiService = useApiService();

  const url = `${config.apiNode}/${props.parameter.id}/awards/noc`;
  const { data, error, isLoading } = useQuery({
    queryKey: [props.parameter.id, 'medals'],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));

  const columns: ColumnData[] = [
    { width: 30, label: '#', dataKey: 'order' },
    { width: 320, label: t('general.organisation'), dataKey: 'organisation' },
    { width: 120, label: t('general.golden'), dataKey: 'golden' },
    { width: 120, label: t('general.silver'), dataKey: 'silver' },
    { width: 120, label: t('general.bronze'), dataKey: 'bronze' },
    { width: 120, label: t('general.total'), dataKey: 'total' },
  ];
  const gridColumns: GridColDef[] = [];
  columns.forEach((column: ColumnData) => {
    gridColumns.push({
      field: column.dataKey,
      headerName: column.label,
      width: column.width,
      sortable: true,
      headerClassName: 'sdw-theme-header',
      valueGetter: (_value, row) => {
        switch (column.dataKey) {
          case 'organisation':
            return get(row, 'organisation.title');
          case 'golden':
          default:
            return get(row, column.dataKey);
        }
      },
      renderCell: (params: GridRenderCellParams) => {
        const organization = get(params.row, 'organisation');
        switch (column.dataKey) {
          case 'organisation':
            return <OrganisationChip data={organization} extended={true} variant="body1" />;
          case 'golden':
            return <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'golden'} />;
          case 'silver':
            return <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'silver'} />;
          case 'bronze':
            return <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'bronze'} />;
          case 'total':
            return <MedalNumberDisplay value={get(params.row, column.dataKey)} field={'total'} />;
          default:
            return <Typography>{get(params.row, column.dataKey)}</Typography>;
        }
      },
    });
  });

  if (isLoading) return <GenericLoadingPanel loading={true} />;

  if (error) return <ErrorPanel error={error} />;

  if (dataContent.length === 0) {
    if (props.includeHeader) return <></>;

    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.awards').toLowerCase())}
      </Alert>
    );
  }

  const calculatedHeigh =
    dataContent.length * (baseConfig.defaultRowHeight ?? 36) +
    (baseConfig.defaultColumnHeaderHeight ?? 40);
  const height = calculatedHeigh < 600 ? undefined : 600;
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <AwardNocChart data={dataContent} />
      </Grid>
      <Grid size={12}>
        <MainCard>
          <Box height={height}>
            <StripedDataGrid
              rows={rowsWithOrder}
              columns={gridColumns}
              getRowId={(row) => get(row, 'organisation.id')}
              disableRowSelectionOnClick
              disableColumnMenu
              hideFooter
              rowHeight={baseConfig.defaultRowHeight ?? 36}
              columnHeaderHeight={baseConfig.defaultColumnHeaderHeight ?? 60}
              density="compact"
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
            />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};
