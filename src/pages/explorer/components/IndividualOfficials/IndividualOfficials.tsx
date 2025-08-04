import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import get from 'lodash/get';
import {
  CompetitionChip,
  ErrorPanel,
  GenericLoadingPanel,
  OrganisationChip,
  StartDateChip,
  StripedDataGrid,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import useApiService from 'hooks/useApiService';
import { ColumnData, EntityType, MasterData } from 'models';
import { humanize } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { SectionCard } from 'components/cards/SectionCard';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';

export const IndividualOfficials = (props: IPanelTabProps) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(props.parameter.type);
  const { handleMetadata, getMasterDataValue } = useStoreCache();
  const { data, error, isLoading } = useQuery({
    queryKey: [props.parameter.id, 'officials'],
    queryFn: () => apiService.fetch(`${config.apiNode}/${props.parameter.id}/officials`),
  });

  useEffect(() => {
    handleMetadata(EntityType.Official);
  }, []);

  const columns: ColumnData[] = [
    { width: 380, label: t('general.competition'), dataKey: 'competition' },
    { width: 120, label: t('general.organisation'), dataKey: 'organisation' },
    { width: 200, label: t('common.type'), dataKey: 'type' },
    { width: 140, label: t('common.role'), dataKey: 'role' },
    { width: 110, label: t('general.date'), dataKey: 'date' },
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
          case 'competition':
            return get(row, 'competition.title');
          case 'location':
            return get(row, 'competition.region') ?? get(row, 'competition.country');
          default:
            return get(row, column.dataKey);
        }
      },
      renderCell: (params: GridRenderCellParams) => {
        const officialType = params.row.type ?? params.row.individualParticipantType;
        const officialRole =
          getMasterDataValue(params.row.role, MasterData.Role)?.value ??
          getMasterDataValue(params.row.function, MasterData.Function)?.value;

        switch (column.dataKey) {
          case 'competition':
            return <CompetitionChip data={params.row} extended={false} />;
          case 'organisation':
            return (
              <OrganisationChip
                data={get(params.row, 'organisation')}
                extended={false}
                variant="body1"
              />
            );
          case 'type':
            return <Typography key={column.dataKey}>{humanize(officialType)}</Typography>;
          case 'role':
            return <Typography>{officialRole ?? humanize(get(params.row, 'function'))}</Typography>;
          case 'date':
            return <StartDateChip key={column.dataKey} data={params.row} />;
          default:
            return <Typography>{get(params.row, column.dataKey)}</Typography>;
        }
      },
    });
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);

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

  return (
    <Grid size={12}>
      <SectionCard title={t('general.official-competition-history')}>
        <Box height={height}>
          <StripedDataGrid
            rows={dataContent}
            columns={gridColumns}
            getRowId={(row) => get(row, 'competition.id')}
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
      </SectionCard>
    </Grid>
  );
};
