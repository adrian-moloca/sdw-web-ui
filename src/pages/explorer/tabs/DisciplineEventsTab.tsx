import { useState } from 'react';
import { IconButton, Typography, Stack } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { t } from 'i18next';
import { FinishDateChip, StartDateChip, StripedDataGrid, TypographyLink } from 'components';
import type { IPanelTabProps } from 'types/views';
import { geCountryRegionDisplay } from '_helpers';
import useApiService from 'hooks/useApiService';
import { EntityType, MasterData, MenuFlagEnum } from 'models';
import appConfig from 'config/app.config';
import { useSecurityProfile, useStoreCache } from 'hooks';
import useAppRoutes from 'hooks/useAppRoutes';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';
import saveAs from 'file-saver';

export const DisciplineEventsTab = (props: IPanelTabProps) => {
  const { hasPermission } = useSecurityProfile();
  const apiService = useApiService();
  const { getDetailRoute } = useAppRoutes();
  const { getMasterDataValue } = useStoreCache();

  const [loading, setLoading] = useState<boolean>(false);
  const rowsWithOrder = props.data.events.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const handlePreview = async (id: string) => {
    setLoading(true);

    const response = await apiService.fetch(
      `${appConfig.apiEndPoint}${appConfig.EVENT_BREAKDOWN.replace('{0}', id)}`
    );
    const jsonContent = JSON.stringify(response, null, 2);

    setLoading(false);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newTabs = window.open(url, '_blank');

    URL.revokeObjectURL(url);
    if (newTabs === null) {
      alert(t('message.popup-blocked'));
    }
  };

  const handleDownload = async (id: string) => {
    setLoading(true);

    const response = await apiService.fetch(
      `${appConfig.apiEndPoint}${appConfig.EVENT_BREAKDOWN.replace('{0}', id)}`
    );
    const jsonContent = JSON.stringify(response, null, 2);

    setLoading(false);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, `${id}.json`);
  };

  const canSeeStructure =
    hasPermission(MenuFlagEnum.Administrator) || hasPermission(MenuFlagEnum.Ingest);
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
      field: 'event',
      headerName: t('general.event'),
      width: 300,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <TypographyLink
          value={params.row.title}
          route={getDetailRoute(EntityType.Event, params.row.id)}
        />
      ),
    },
    {
      field: 'type',
      headerName: t('common.type'),
      width: 200,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{getMasterDataValue(params.value, MasterData.EventType)?.value}</Typography>
      ),
    },
    {
      field: 'gender',
      headerName: t('common.gender'),
      width: 100,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{getMasterDataValue(params.value, MasterData.SportGender)?.value}</Typography>
      ),
    },
    {
      field: 'startDate',
      headerName: t('general.startDate'),
      width: 120,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <StartDateChip data={params.row} />,
    },
    {
      field: 'finishDate',
      headerName: t('general.finishDate'),
      width: 120,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <FinishDateChip data={params.row} />,
    },
    {
      field: 'region',
      headerName: t('general.region'),
      width: 180,
      sortable: true,
      valueGetter: (_value, row) => geCountryRegionDisplay(row),
      renderCell: (params: GridRenderCellParams) => <Typography>{params.value}</Typography>,
    },
  ];
  if (canSeeStructure) {
    columns.push({
      field: 'commands',
      headerName: t('general.action'),
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction={'row'} spacing={1}>
          <IconButton
            aria-label="preview row"
            disabled={loading}
            size="small"
            onClick={() => handlePreview(params.row.id)}
            sx={{ p: 0 }}
          >
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton
            aria-label="download row"
            disabled={loading}
            size="small"
            onClick={() => handleDownload(params.row.id)}
            sx={{ p: 0 }}
          >
            <FileDownloadOutlinedIcon />
          </IconButton>
        </Stack>
      ),
    });
  }
  return (
    <StripedDataGrid
      rows={rowsWithOrder}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      disableColumnMenu
      hideFooter
      rowHeight={baseConfig.defaultRowHeight ?? 36}
      density="compact"
      sx={{ zIndex: 19 }}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
    />
  );
};
