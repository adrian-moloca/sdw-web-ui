import { GridColDef } from '@mui/x-data-grid-pro';
import { DataGridPanel } from 'components';
import { t } from 'i18next';
import appConfig from 'config/app.config';
import { EntityType, EditionFlags, EditionMode } from 'models';
import { useModelConfig } from 'hooks';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAccessRequestData } from '../useAccessRequestData';
import { useDispatch } from 'react-redux';
import { AppDispatch, drawerActions } from 'store';
import baseConfig from 'baseConfig';

export const AccessRequestIndex: React.FC = () => {
  const { getConfig } = useModelConfig();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const config = getConfig(EntityType.AccessRequest);
  const {
    dataAccessOptions,
    operationAccessOptions,
    accessTypeOptions,
    statusOptions,
    environmentOptions,
  } = useAccessRequestData();
  const columns: GridColDef[] = [
    { field: 'name', headerName: t('general.name'), flex: 1, minWidth: 200 },
    { field: 'email', headerName: t('general.email'), flex: 1.5, minWidth: 200 },
    { field: 'role', headerName: t('access-request.role'), flex: 1.5, minWidth: 200 },
    {
      field: 'organization',
      headerName: t('access-request.organization'),
      flex: 1.5,
      minWidth: 200,
    },
    { field: 'manager', headerName: t('access-request.manager'), flex: 1.5, minWidth: 200 },
    {
      field: 'type',
      headerName: t('common.type'),
      minWidth: 140,
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2">
          {accessTypeOptions.find(
            (option) => option.value.toLowerCase() === params.value.toLowerCase()
          )?.label ?? params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: t('common.status'),
      minWidth: 140,
      flex: 1.5,
      type: 'singleSelect',
      valueOptions: statusOptions,
      renderCell: (params) => {
        const currentStatus = statusOptions.find(
          (option) => option.value.toLowerCase() === params.value.toLowerCase()
        );
        const Icon = currentStatus?.icon;
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            {Icon && <Icon sx={{ fontSize: '14px', color: currentStatus?.color }} />}
            <Typography variant="body2">{currentStatus?.label ?? params.value}</Typography>
          </Stack>
        );
      },
    },
    {
      field: 'typeContext',
      headerName: t('access-request.typeContext_short'),
      minWidth: 200,
      flex: 1.5,
    },
    {
      field: 'dataType',
      headerName: t('access-request.dataType_short'),
      minWidth: 200,
      flex: 1.5,
      type: 'singleSelect',
      valueOptions: dataAccessOptions,
      renderCell: (params) => {
        return params.value.map((value: string) => {
          const option = dataAccessOptions.find((option) => option.value === value);
          return (
            <Typography key={value} variant="body2">
              {option ? option.label : value}
            </Typography>
          );
        });
      },
    },
    {
      field: 'operationType',
      headerName: t('access-request.operationType_short'),
      minWidth: 200,
      flex: 1.5,
      type: 'singleSelect',
      valueOptions: operationAccessOptions,
      renderCell: (params) => {
        return params.value.map((value: string) => {
          const option = operationAccessOptions.find((option) => option.value === value);
          return (
            <Typography key={value} variant="body2">
              {option ? option.label : value}
            </Typography>
          );
        });
      },
    },
    {
      field: 'environments',
      headerName: t('access-request.environments_short'),
      minWidth: 200,
      flex: 1.5,
      type: 'singleSelect',
      valueOptions: environmentOptions,
      renderCell: (params) => {
        return params.value.map((value: string) => {
          const option = environmentOptions.find(
            (option) => option.value.toLowerCase() === value.toLowerCase()
          );
          return (
            <Typography key={value} variant="body2">
              {option ? option.label : value}
            </Typography>
          );
        });
      },
    },
    { field: 'startDate', headerName: t('common.startDate'), minWidth: 100 },
    { field: 'endDate', headerName: t('common.endDate'), minWidth: 100 },
    { field: 'purpose', headerName: t('access-request.purpose_short'), minWidth: 260, flex: 1.5 },
    {
      field: 'usageType',
      headerName: t('access-request.usageType_short'),
      minWidth: 240,
      flex: 1.5,
    },
    {
      field: 'createdTs',
      headerName: t('common.createdOn'),
      minWidth: 180,
      valueGetter: (value) => dayjs(value).format(baseConfig.dateTimeDateFormat).toUpperCase(),
    },
  ];

  return (
    <DataGridPanel
      showHeader={false}
      config={config}
      toolbarType="default"
      fontSize={'body2'}
      columns={columns}
      sorting={[{ column: 'created_ts', operator: 'desc' }]}
      flags={EditionFlags.AllowEdition}
      onCreate={() => navigate('/access-request')}
      onSelect={(data) => {
        dispatch(
          drawerActions.setSelectedItem({
            item: { data },
            type: EntityType.AccessRequest,
            mode: EditionMode.Update,
          })
        );
      }}
      dataSource={{
        url: `${appConfig.toolsEndPoint}${config.apiNode}`,
        apiVersion: config.apiVersion,
        queryKey: config.entityName,
      }}
    />
  );
};
