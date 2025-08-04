import { useEffect } from 'react';
import { Alert, Typography } from '@mui/material';
import { t } from 'i18next';
import orderBy from 'lodash/orderBy';
import { CountryChip, StripedDataGrid, TypographyLink } from 'components';
import type { IPanelTabProps } from 'types/views';
import { useModelConfig, useStoreCache } from 'hooks';
import { EntityType } from 'models';
import useAppRoutes from 'hooks/useAppRoutes';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

export const SubVenuesTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Venue);
  const { handleMetadata } = useStoreCache();
  const { getDetailRoute } = useAppRoutes();

  useEffect(() => {
    handleMetadata(config.type);
  }, []);

  const data = orderBy(props.data?.subVenues, 'title');
  const dataContent = data ?? [];
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const totalVenues = data?.length ?? 0;

  if (totalVenues === 0) {
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.subvenues'))}
      </Alert>
    );
  }
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
      field: 'venue',
      headerName: t('general.venue'),
      width: 300,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <TypographyLink
          value={params.value}
          route={getDetailRoute(EntityType.Venue, params.row.id)}
        />
      ),
    },
    {
      field: 'country',
      headerName: t('general.country'),
      width: 200,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <CountryChip code={params.value} hideTitle={false} size={'small'} />
      ),
    },
    {
      field: 'region',
      headerName: t('general.region'),
      width: 100,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.value}</Typography>,
    },
    {
      field: 'code',
      headerName: t('common.code'),
      width: 100,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.value}</Typography>,
    },
  ];
  return (
    <StripedDataGrid
      rows={rowsWithOrder}
      columns={columns}
      getRowId={(row) => row.order}
      disableRowSelectionOnClick
      disableColumnMenu
      hideFooter
      getRowHeight={() => 'auto'}
      density="compact"
      sx={{ zIndex: 19 }}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
    />
  );
};
