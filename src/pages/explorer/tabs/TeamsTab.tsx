import { useEffect } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import {
  ErrorPanel,
  GenericLoadingPanel,
  OrganisationChip,
  StripedDataGrid,
  TypographyLink,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import { useStoreCache, useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { EntityType, MasterData } from 'models';
import { SectionCard } from 'components/cards/SectionCard';
import useAppRoutes from 'hooks/useAppRoutes';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import get from 'lodash/get';
import baseConfig from 'baseConfig';

export const TeamsTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Team);
  const { getDetailRoute } = useAppRoutes();
  const apiService = useApiService();
  const { getMasterDataValue, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
  }, []);

  const url = `${getConfig(props.parameter.type).apiNode}/${props.parameter.id}/teams`;
  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_teams`],
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
      field: 'name',
      headerName: t('general.team'),
      minWidth: 120,
      sortable: true,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <TypographyLink
          value={get(params.row, 'name')}
          route={getDetailRoute(EntityType.Team, params.row.id)}
        />
      ),
    },
    {
      field: 'organisation',
      headerName: t('general.organisation'),
      width: 120,
      sortable: true,
      valueGetter: (_value, row) => row.organisation.country,
      renderCell: (params: GridRenderCellParams) => (
        <OrganisationChip data={params.row.organisation} extended={false} variant="body1" />
      ),
    },
    {
      field: 'gender',
      headerName: t('common.gender'),
      width: 100,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>
          {getMasterDataValue(params.row.gender, MasterData.PersonGender)?.value}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: t('common.type'),
      width: 200,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{getMasterDataValue(params.row.type, MasterData.TeamType)?.value}</Typography>
      ),
    },
  ];
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (dataContent.length === 0) {
    if (props.includeHeader) return <></>;

    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.teams').toLowerCase())}
      </Alert>
    );
  }
  const calculatedHeigh =
    dataContent.length * (baseConfig.defaultRowHeight ?? 36) +
    (baseConfig.defaultColumnHeaderHeight ?? 40);
  const height = calculatedHeigh < 600 ? undefined : 600;
  const Teams = (
    <Box height={height}>
      <StripedDataGrid
        rows={rowsWithOrder}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter
        rowHeight={baseConfig.defaultRowHeight ?? 40}
        columnHeaderHeight={baseConfig.defaultColumnHeaderHeight ?? 60}
        density="compact"
        sx={{ zIndex: 19 }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      />
    </Box>
  );

  if (props.includeHeader) {
    return (
      <Grid size={12}>
        <SectionCard title={t('general.teams')} icon={GroupsOutlined}>
          {Teams}
        </SectionCard>
      </Grid>
    );
  }

  return Teams;
};
