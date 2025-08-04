import { useEffect } from 'react';
import { Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import {
  ErrorPanel,
  GenericLoadingPanel,
  OrganisationChip,
  StripedDataGrid,
  TypographyLink,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import { useModelConfig, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import { EntityType, MasterData } from 'models';
import { SectionCard } from 'components/cards/SectionCard';
import baseConfig from 'baseConfig';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import useAppRoutes from 'hooks/useAppRoutes';

export const RidersTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Person);
  const apiService = useApiService();
  const { getDetailRoute } = useAppRoutes();
  const { getMasterDataValue, handleMetadata } = useStoreCache();

  useEffect(() => {
    handleMetadata(config.type);
  }, []);

  const url = `${getConfig(props.parameter.type).apiNode}/${props.parameter.id}/riders`;
  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_riders`],
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
      renderCell: (params: GridRenderCellParams) => <Typography>{params.value}</Typography>,
    },
    {
      field: 'rider',
      headerName: t('general.rider'),
      width: 300,
      sortable: true,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <TypographyLink
          value={params.value}
          route={getDetailRoute(EntityType.Person, params.row.id)}
        />
      ),
    },
    {
      field: 'organisation',
      headerName: t('general.organisation'),
      width: 200,
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
        <Typography>{getMasterDataValue(params.value, MasterData.PersonGender)?.value}</Typography>
      ),
    },
  ];
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (dataContent.length == 0) {
    if (props.includeHeader) return <></>;

    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.riders').toLowerCase())}
      </Alert>
    );
  }
  const calculatedHeight =
    dataContent.length * (baseConfig.defaultRowHeight ?? 36) +
    (baseConfig.defaultColumnHeaderHeight ?? 40);
  const height = calculatedHeight < 600 ? undefined : 600;
  const Riders = (
    <Box height={height}>
      <StripedDataGrid
        rows={rowsWithOrder}
        columns={columns}
        getRowId={(row) => row.order}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter
        getRowHeight={() => 'auto'}
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
        <SectionCard title={t('general.riders')}>{Riders}</SectionCard>
      </Grid>
    );
  }

  return <Grid size={12}>{Riders}</Grid>;
};
