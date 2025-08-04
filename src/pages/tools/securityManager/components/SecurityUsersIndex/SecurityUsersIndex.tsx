import { Chip, IconButton, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';
import { GenericLoadingPanel, StripedDataGrid, TypographyLink } from 'components';
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SettingsBackupRestoreOutlinedIcon from '@mui/icons-material/SettingsBackupRestoreOutlined';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { useDialogs } from '@toolpad/core';
import { formatMasterCode } from '_helpers';
import { AppDispatch } from 'store/state';
import { useDispatch } from 'react-redux';
import { drawerActions } from 'store';
import { EditionMode, EntityType } from 'models';
import { mapSecurityGroupLabels, InactiveStatus, ActiveStatus } from '../config';
import {
  mapUsersWithProfiles,
  getUniqueProfiles,
  getUniqueCompanies,
  safeJsonParse,
  arrayIncludesOperator,
} from '../utils';

export const SecurityUsersIndex: React.FC = () => {
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const dialogs = useDialogs();
  const dispatch = useDispatch<AppDispatch>();
  const url = `${apiConfig.toolsEndPoint}/security/users`;
  const urlRun = `${apiConfig.toolsEndPoint}/security/build`;
  const { data, isLoading } = useQuery({
    queryKey: ['security-users'],
    queryFn: () => apiService.fetch(url),
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
  });
  const mutationActivate = useMutation({
    mutationFn: async (id: string) =>
      apiService.put(`${apiConfig.toolsEndPoint}/security/users/${id}/activate`, undefined),
    onSuccess: async () => {
      await apiService.post(urlRun);
      queryClient.invalidateQueries({ queryKey: ['security-users'] });
    },
    onError: (error: any) => error,
  });
  const mutationInactivate = useMutation({
    mutationFn: async (id: string) =>
      apiService.put(`${apiConfig.toolsEndPoint}/security/users/${id}/inactivate`, undefined),
    onSuccess: async () => {
      await apiService.post(urlRun);
      queryClient.invalidateQueries({ queryKey: ['security-users'] });
    },
    onError: (error: any) => error,
  });
  const handleActivate = async (row: any) => {
    const confirmed = await dialogs.confirm(
      t('security.are-you-sure-you-want-to-activate-user').replace('{0}', row.username),
      { okText: t('common.yes'), cancelText: t('common.no') }
    );
    if (confirmed) {
      mutationActivate.mutate(row.id);
    }
  };

  const handleInactivate = async (row: any) => {
    const confirmed = await dialogs.confirm(
      t('security.are-you-sure-you-want-to-inactivate-user').replace('{0}', row.username),
      { okText: t('common.yes'), cancelText: t('common.no') }
    );
    if (confirmed) {
      mutationInactivate.mutate(row.id);
    }
  };
  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;
  const formatData = mapUsersWithProfiles(data);
  const dataProfileValues = getUniqueProfiles(formatData, 'dataProfiles');
  const operationsProfileValues = mapSecurityGroupLabels(
    getUniqueProfiles(formatData, 'operationsProfiles')
  );
  const companyValues = getUniqueCompanies(formatData, 'company');
  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: t('general.userName'),
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
                  type: EntityType.SecurityUser,
                  mode: EditionMode.Update,
                })
              )
            }
          />
        );
      },
    },
    {
      field: 'givenName',
      headerName: t('general.name'),
      flex: 1.5,
      minWidth: 200,
      valueGetter: (_value, row) =>
        `${safeJsonParse(row.givenName)} ${safeJsonParse(row.lastName)}`,
      renderCell: (params) => {
        const isInactive = safeJsonParse(params.row.status) === InactiveStatus;
        return (
          <Typography
            variant="body2"
            sx={{ textDecoration: isInactive ? 'line-through' : 'inherit' }}
          >
            {`${safeJsonParse(params.row.givenName)} ${safeJsonParse(params.row.lastName)}`}
          </Typography>
        );
      },
    },
    {
      field: 'mail',
      headerName: t('general.email'),
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
      field: 'company',
      headerName: t('general.company'),
      minWidth: 120,
      type: 'singleSelect',
      valueOptions: companyValues ?? [],
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
      valueOptions: operationsProfileValues ?? [],
      valueGetter: (value: any[]) =>
        value?.length > 0 ? (mapSecurityGroupLabels(value).join(', ') ?? '-') : '-',
      renderCell: ({ value }) => <Typography variant="body2">{value}</Typography>,
      filterOperators: [arrayIncludesOperator],
    },
    {
      field: 'dataProfiles',
      headerName: t('common.dataProfile'),
      flex: 1.5,
      minWidth: 220,
      type: 'singleSelect',
      valueOptions: dataProfileValues?.map((x) => formatMasterCode(x)),
      valueGetter: (value: any[]) =>
        value?.length > 0
          ? (value.map((x) => formatMasterCode(x)).join(', ') ?? t('general.all-data'))
          : t('general.all-data'),
      renderCell: ({ value }) => <Typography variant="body2">{value}</Typography>,
      filterOperators: [arrayIncludesOperator],
    },
    {
      field: 'createdOn',
      headerName: t('general.lastUpdated'),
      width: 160,
      valueGetter: (value) => dayjs(value).format(baseConfig.dateTimeDateFormat).toUpperCase(),
      renderCell: ({ value }) => (
        <Typography variant="body2">
          {dayjs(value).format(baseConfig.dateTimeDateFormat).toUpperCase()}
        </Typography>
      ),
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
      getRowId={(row) => row.id}
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
