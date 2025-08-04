import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';
import { MainCard, StripedDataGridBase } from 'components';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { GlobalSetup } from '../types';

export const ConfigDisplay: React.FC<GlobalSetup> = ({ config }) => {
  const [editRow, setEditRow] = useState<any>(null);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const urlChange = `${apiConfig.toolsEndPoint}/monitor/global-setup/change-config`;
  const mutationChange = useMutation({
    mutationFn: async ({
      flagId,
      flagKey,
      flagValue,
    }: {
      flagId: string;
      flagKey: string;
      flagValue: string;
    }) => apiService.post(urlChange, { key: flagKey, id: flagId, value: flagValue }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-setup'] });
    },
    onError: (error: any) => error,
  });

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('common.module'),
      flex: 1,
      renderCell: ({ value }) => (
        <Typography variant="body2">
          {value.replace('AnalyticDbSuffix.', '').replace('-', ' ')}
        </Typography>
      ),
    },
    {
      field: 'value',
      headerName: t('general.database'),
      width: 140,
      renderCell: ({ value, row }) => (
        <Typography variant="body2">{`${row.key}${value ?? ''}_production`}</Typography>
      ),
    },
    {
      field: 'ts_',
      headerName: t('general.lastUpdated'),
      width: 200,
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
      renderCell: ({ row }) => (
        <IconButton title={t('actions.buttonEdit')} sx={{ p: 0 }} onClick={() => handleEdit(row)}>
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];
  const handleEdit = (row: any) => {
    setEditRow(row ?? null);
  };
  const handleCancel = () => {
    setEditRow(null);
  };

  const handleSave = () => {
    if (!editRow) return;

    mutationChange.mutate({
      flagId: editRow.id,
      flagKey: editRow.key,
      flagValue: editRow.value === 'none' ? null : editRow.value,
    });

    setEditRow(null);
  };
  return (
    <>
      {editRow && (
        <MainCard>
          <Typography>
            {t('global-setup.editing')}{' '}
            <strong>{editRow.id.replace('AnalyticDbSuffix.', '').replace('-', ' ')}</strong>
          </Typography>
          <Stack direction="row" spacing={1} sx={{ my: 1 }}>
            <FormControl size="small">
              <InputLabel>{t('general.value')}</InputLabel>
              <Select
                value={editRow.value ?? 'none'}
                label={t('general.value')}
                onChange={(e) => setEditRow({ ...editRow, value: e.target.value })}
                sx={{ minWidth: 180 }}
                size="small"
              >
                <MenuItem value="none">{t('global-setup.none')}</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={handleSave}
              startIcon={<SaveOutlined />}
              color="secondary"
              variant="contained"
              size="small"
              disableElevation
            >
              {t('actions.buttonSave')}
            </Button>
            <Button
              onClick={handleCancel}
              startIcon={<CancelOutlined />}
              color="secondary"
              variant="outlined"
              size="small"
              disableElevation
            >
              {t('actions.buttonCancel')}
            </Button>
          </Stack>
        </MainCard>
      )}
      <Box sx={{ maxHeight: 200 }}>
        <StripedDataGridBase
          rows={config}
          fontSize={'body2'}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          disableColumnMenu
          rowHeight={baseConfig.defaultRowHeight ?? 36}
          density="compact"
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          hideFooter
        />
      </Box>
      <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
        {t('global-setup.global-redirect-note')}
      </Typography>
    </>
  );
};
