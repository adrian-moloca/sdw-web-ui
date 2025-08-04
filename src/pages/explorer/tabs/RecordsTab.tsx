import { Grid, Box, Typography } from '@mui/material';
import OfflinePinOutlinedIcon from '@mui/icons-material/OfflinePinOutlined';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import dayjs from 'dayjs';
import {
  CompetitionChip,
  CompetitionLocationChip,
  ErrorPanel,
  EventChip,
  GenericLoadingPanel,
  IrmResultChip,
  OrganisationChip,
  SectionCard,
  StripedDataGrid,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import useApiService from 'hooks/useApiService';
import { useModelConfig, useStoreCache } from 'hooks';
import { ColumnData, MasterData } from 'models';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';

export const RecordsTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const { getMasterDataValue } = useStoreCache();
  const config = getConfig(props.parameter.type);
  const apiService = useApiService();

  const url = `${config.apiNode}/${props.parameter.id}/records`;
  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_records`],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const columns: ColumnData[] = [
    { width: 300, label: t('general.competition'), dataKey: 'competition' },
    { width: 110, label: t('general.organisation'), dataKey: 'organisation' },
    { width: 200, label: t('general.event'), dataKey: 'event' },
    { width: 150, label: t('general.record'), dataKey: 'level' },
    { width: 125, label: t('general.result'), dataKey: 'result' },
    { width: 140, label: t('general.date'), dataKey: 'date' },
    { width: 180, label: t('general.location'), dataKey: 'location' },
  ];
  const gridColumns: GridColDef[] = [
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
  ];
  columns.forEach((column: ColumnData) => {
    gridColumns.push({
      field: column.dataKey,
      headerName: column.label,
      width: column.width,
      sortable: true,
      headerClassName: 'sdw-theme-header',
      valueGetter: (_value, row) => {
        switch (column.dataKey) {
          case 'competition':
            return get(row, 'competition.title');
          case 'location':
            return get(row, 'competition.region') ?? get(row, 'competition.country');
          case 'organisation':
            return get(row, 'organisation.country');
          case 'event':
            return get(row, 'event.title');
          case 'result':
            return get(row, 'resultValue');
          case 'date':
            return get(row, 'recordDate');
          default:
            return get(row, column.dataKey);
        }
      },
      renderCell: (params: GridRenderCellParams) => {
        switch (column.dataKey) {
          case 'competition':
            return <CompetitionChip data={params.row} extended={false} />;
          case 'location':
            return <CompetitionLocationChip data={params.row} />;
          case 'organisation':
            return (
              <OrganisationChip
                data={get(params.row, 'organisation')}
                extended={false}
                variant="body1"
              />
            );
          case 'event':
            return <EventChip data={get(params.row, 'event')} withRoute={true} />;
          case 'result':
            return (
              <IrmResultChip
                irm={''}
                value={get(params.row, 'resultValue')}
                valueType={get(params.row, 'resultType')}
                inline={false}
              />
            );
          case 'level': {
            const level = getMasterDataValue(
              get(params.row, 'level'),
              MasterData.RecordLevel
            )?.value;
            return <Typography>{level}</Typography>;
          }
          case 'date':
            return (
              <Typography>
                {dayjs(get(params.row, 'recordDate'))
                  .format(baseConfig.dayDateFormat)
                  .toUpperCase()}
              </Typography>
            );
          default:
            return <Typography>{get(params.row, column.dataKey)}</Typography>;
        }
      },
    });
  });
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (dataContent.length === 0) return null;

  const calculatedHeigh =
    dataContent.length * (baseConfig.defaultRowHeight ?? 36) +
    (baseConfig.defaultColumnHeaderHeight ?? 40);
  const height = calculatedHeigh < 600 ? undefined : 600;

  const RecordTable = (
    <Box height={height}>
      <StripedDataGrid
        rows={rowsWithOrder}
        columns={gridColumns}
        getRowId={(row) => get(row, 'event.id')}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter
        rowHeight={baseConfig.defaultRowHeight ?? 36}
        density="compact"
        sx={{ zIndex: 19 }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      />
    </Box>
  );

  if (props.includeHeader) {
    return (
      <Grid size={12}>
        <SectionCard title={t('general.records')} icon={OfflinePinOutlinedIcon}>
          {RecordTable}
        </SectionCard>
      </Grid>
    );
  }

  return RecordTable;
};
