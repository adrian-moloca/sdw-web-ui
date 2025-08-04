import { Chip, IconButton, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import { GenericLoadingPanel, StripedDataGrid, TypographyLink } from 'components';
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import { t } from 'i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import {
  arrayIncludesOperator,
  getUniqueProfiles,
  mapClientsWithProfiles,
  safeJsonParse,
} from '../utils';
import { formatMasterCode } from '_helpers';
import { useDialogs } from '@toolpad/core';
import { useDispatch } from 'react-redux';
import { AppDispatch, drawerActions } from 'store';
import { EntityType, EditionMode } from 'models';
import { ActiveStatus, InactiveStatus, mapSecurityScopesLabels } from '../config';

export const SecurityClientsIndex: React.FC = () => {
  const apiService = useApiService();
  const dialogs = useDialogs();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const url = `${apiConfig.toolsEndPoint}/security/clients`;
  const urlRun = `${apiConfig.toolsEndPoint}/security/build`;
  const { data, isLoading } = useQuery({
    queryKey: ['security-clients'],
    queryFn: () => apiService.fetch(url),
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
  });
  const mutationActivate = useMutation({
    mutationFn: async (id: string) =>
      apiService.put(`${apiConfig.toolsEndPoint}/security/clients/${id}/activate`, undefined),
    onSuccess: async () => {
      await apiService.post(urlRun);
      queryClient.invalidateQueries({ queryKey: ['security-clients'] });
    },
    onError: (error: any) => error,
  });
  const mutationInactivate = useMutation({
    mutationFn: async (id: string) =>
      apiService.put(`${apiConfig.toolsEndPoint}/security/clients/${id}/inactivate`, undefined),
    onSuccess: async () => {
      await apiService.post(urlRun);
      queryClient.invalidateQueries({ queryKey: ['security-clients'] });
    },
    onError: (error: any) => error,
  });
  const handleActivate = async (row: any) => {
    const confirmed = await dialogs.confirm(
      t('security.are-you-sure-you-want-to-activate-client').replace('{0}', row.clientName),
      { okText: t('common.yes'), cancelText: t('common.no') }
    );
    if (confirmed) {
      mutationActivate.mutate(row.clientId);
    }
  };

  const handleInactivate = async (row: any) => {
    const confirmed = await dialogs.confirm(
      t('security.are-you-sure-you-want-to-inactivate-client').replace('{0}', row.clientName),
      { okText: t('common.yes'), cancelText: t('common.no') }
    );
    if (confirmed) {
      mutationInactivate.mutate(row.clientId);
    }
  };
  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;
  const formatData = mapClientsWithProfiles(data);
  const dataProfileValues = getUniqueProfiles(formatData, 'dataProfiles');
  const operationsProfileValues = mapSecurityScopesLabels(
    getUniqueProfiles(formatData, 'operationsProfiles')
  );
  const columns: GridColDef[] = [
    {
      field: 'clientId',
      headerName: t('general.clientName'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const isInactive = safeJsonParse(params.row.status) === InactiveStatus;
        return (
          <TypographyLink
            typoSize="body2"
            value={params.value}
            sx={{ textDecoration: isInactive ? 'line-through' : 'inherit' }}
            onClick={() =>
              dispatch(
                drawerActions.setSelectedItem({
                  item: { data: params.row },
                  type: EntityType.SecurityClient,
                  mode: EditionMode.Update,
                })
              )
            }
          />
        );
      },
    },
    {
      field: 'clientName',
      headerName: t('common.name'),
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value) => safeJsonParse(value),
      renderCell: (params) => {
        const isInactive = safeJsonParse(params.row.status) === InactiveStatus;
        return (
          <Typography
            variant="body2"
            sx={{ textDecoration: isInactive ? 'line-through' : 'inherit' }}
          >
            {safeJsonParse(params.value)}
          </Typography>
        );
      },
    },
    {
      field: 'mail',
      headerName: t('general.owner-mail'),
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value) => safeJsonParse(value),
      renderCell: (params) => {
        const isInactive = safeJsonParse(params.row.status) === InactiveStatus;
        return (
          <Typography
            variant="body2"
            sx={{ textDecoration: isInactive ? 'line-through' : 'inherit' }}
          >
            {safeJsonParse(params.value)}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 100,
      type: 'singleSelect',
      valueOptions: [ActiveStatus, InactiveStatus],
      valueGetter: (value) => safeJsonParse(value),
      renderCell: (params) => {
        const statusText = safeJsonParse(params.row.status);
        switch (statusText) {
          case ActiveStatus:
            return (
              <Chip
                icon={<CircleOutlinedIcon fontSize="small" color="success" />}
                label={t('status.active')}
                variant="outlined"
                size="small"
                sx={{ border: 'none', p: 0 }}
              />
            );
          case InactiveStatus:
            return (
              <Chip
                icon={<DoDisturbOutlinedIcon fontSize="small" />}
                label={t('general.inactive')}
                variant="outlined"
                color="error"
                size="small"
                sx={{ border: 'none', p: 0 }}
              />
            );
          default:
            return <Chip label={statusText} variant="outlined" size="small" />;
        }
      },
    },
    {
      field: 'operationsProfiles',
      headerName: t('common.operationsProfile'),
      flex: 1.5,
      minWidth: 200,
      type: 'singleSelect',
      valueOptions: operationsProfileValues,
      valueGetter: (value: any[]) =>
        value?.length > 0 ? (mapSecurityScopesLabels(value).join(', ') ?? '-') : '-',
      renderCell: ({ value }) => <Typography variant="body2">{value}</Typography>,
      filterOperators: [arrayIncludesOperator],
    },
    {
      field: 'dataProfiles',
      headerName: t('common.dataProfile'),
      flex: 1.5,
      minWidth: 220,
      type: 'singleSelect',
      valueOptions: dataProfileValues?.map((x) => formatMasterCode(x)) ?? [],
      valueGetter: (value: any[]) =>
        value?.length > 0
          ? (value.map((x) => formatMasterCode(x)).join(', ') ?? t('general.all-data'))
          : t('general.all-data'),
      renderCell: ({ value }) => <Typography variant="body2">{value}</Typography>,
      filterOperators: [arrayIncludesOperator],
    },
    {
      field: 'actions',
      headerName: '',
      width: 10,
      sortable: false,
      renderCell: ({ row }) => {
        const isInactive = safeJsonParse(row.status) === 'Inactive';
        if (isInactive) {
          return (
            <IconButton
              title={t('actions.buttonRestore')}
              aria-label={t('actions.buttonRestore')}
              sx={{ p: 0 }}
              onClick={() => handleActivate(row)}
            >
              <SettingsBackupRestoreOutlinedIcon fontSize="small" />
            </IconButton>
          );
        }
        return (
          <IconButton
            title={t('actions.buttonDelete')}
            aria-label={t('actions.buttonDelete')}
            sx={{ p: 0 }}
            onClick={() => handleInactivate(row)}
          >
            <DeleteOutlinedIcon fontSize="small" color="error" />
          </IconButton>
        );
      },
    },
  ];

  return (
    <StripedDataGrid
      rows={formatData}
      fontSize={'body1'}
      columns={columns}
      getRowId={(row) => row.clientId}
      disableRowSelectionOnClick
      //rowHeight={baseConfig.defaultRowHeight ?? 36}
      getRowHeight={() => 'auto'}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      density="compact"
      showToolbar
      //hideFooter
    />
  );
};
