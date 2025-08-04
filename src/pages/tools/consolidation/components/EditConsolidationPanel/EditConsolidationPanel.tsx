import { Button, Alert, useTheme, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { t } from 'i18next';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import set from 'lodash/set';
import omit from 'lodash/omit';
import baseConfig from 'baseConfig';
import { useAppModel } from 'hooks';
import { FieldTemplate, GenericLoadingPanel, StripedDataGrid } from 'components';
import { EditDialog } from '../EditDialog';
import { isNullOrEmpty } from '_helpers';
import useApiService from 'hooks/useApiService';
import useConsolidation from 'hooks/useConsolidation';
import { AppDispatch, notificationActions } from 'store';
import type { EditFieldData, EditProps, ModelProps, FieldState } from 'types/tools';
import { EntityType, ExcludedFields, TemplateType } from 'models';

export const EditConsolidationPanel = ({
  id,
  name,
  data,
  config,
  fieldSetup,
  metadata,
  onCallback,
}: EditProps) => {
  const theme = useTheme();
  const { formatEditField } = useAppModel();
  const { editSaveUrl, getFieldState, filterFields, getInfoMessage } = useConsolidation();
  const [field, setField] = useState<any>(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const urlId = config.type === EntityType.Noc ? id.replace('ORN-', 'NOC-') : id;

  const mutationUpdate = useMutation({
    mutationFn: async (updateData: FieldState) =>
      await apiService.put(`${editSaveUrl}/${urlId}`, updateData),
    onSuccess: () => {
      dispatch(
        notificationActions.addAlert({
          title: `Save overwritten/hidden Fields for ${name} completed with success`,
          type: 1,
        })
      );
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${id}_view`] });
      queryClient.invalidateQueries({ queryKey: [`${urlId}_editFields`] });
    },
    onError: (error: any) => {
      dispatch(
        notificationActions.addAlert({
          title: `Save overwritten/hidden Fields for ${name} completed with errors: ${error?.response?.data?.message}`,
          type: 3,
        })
      );
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async () => await apiService.deleteAny(`${editSaveUrl}/${urlId}`),
    onSuccess: () => {
      dispatch(
        notificationActions.addAlert({
          title: `Delete overwritten/hidden Fields for ${name} completed with success`,
          type: 1,
        })
      );
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${id}_view`] });
      queryClient.invalidateQueries({ queryKey: [`${urlId}_editFields`] });
    },
    onError: (error: any) => {
      dispatch(
        notificationActions.addAlert({
          title: `Delete overwritten/hidden for ${name} completed with errors: ${error?.response?.data?.message}`,
          type: 3,
        })
      );
    },
  });

  const canEdit = fieldSetup?.state !== 'errorInternal' && fieldSetup?.state !== 'errorProduction';
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('common.field'),
      width: 200,
      editable: false,
    },
    { field: 'field', headerName: t('common.field'), editable: false },
    {
      field: 'internal',
      headerName: t('general.internal'),
      width: 380,
      renderCell: (params: GridRenderCellParams<any>) => {
        return formatEditField(params.row.field, params.value, metadata);
      },
    },
    {
      field: 'state',
      headerName: ' ',
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      width: 5,
      renderCell: (params: GridRenderCellParams<any>) => {
        switch (params.value) {
          case 'hidden':
            return (
              <VisibilityOffOutlinedIcon
                sx={{ fontSize: '20px', color: theme.palette.error.main }}
              />
            );
          case 'readonly':
            return (
              <LockOutlinedIcon sx={{ fontSize: '20px', color: theme.palette.secondary.main }} />
            );
          case 'updated':
            return (
              <BorderColorOutlinedIcon sx={{ fontSize: '20px', color: theme.palette.error.main }} />
            );
          case 'overwrite':
            return (
              <ModeEditOutlineOutlinedIcon
                sx={{ fontSize: '20px', color: theme.palette.primary.main }}
              />
            );
          default:
            return null;
        }
      },
    },
    {
      field: 'consolidation',
      headerName: t('general.consolidation'),
      width: 380,
      renderCell: (params: GridRenderCellParams<any>) => {
        return formatEditField(params.row.field, params.value, metadata);
      },
    },
    {
      field: 'production',
      headerName: t('general.production'),
      width: 380,
      editable: false,
      renderCell: (params: GridRenderCellParams<any>) => {
        return formatEditField(params.row.field, params.value, metadata);
      },
    },
  ];

  const buildRows = () => {
    const fields = filterFields(config.type, data, metadata);
    const result: Array<ModelProps> = [];
    result.push({
      id: t('common.id'),
      sort: '000',
      field: 'id',
      state: 'readonly',
      internal: get(fieldSetup?.internalRecord, 'id'),
      consolidation: get(fieldSetup?.consolidationRecord, 'id'),
      production: get(fieldSetup?.productionRecord, 'id'),
    });

    const rows = fields.map((field) => ({
      id: get(metadata, field)?.displayName ?? field,
      sort: get(metadata, field)?.displayName ?? field,
      field,
      state: getFieldState(field, fieldSetup),
      internal: get(fieldSetup?.internalRecord, field),
      consolidation: get(fieldSetup?.consolidationRecord, field),
      production: get(fieldSetup?.productionRecord, field),
    }));
    return [...result, ...rows];
  };

  const getInitialFieldState = (): any => {
    return omit(fieldSetup?.consolidationRecord, ['id', 'ts']);
  };

  const [fieldState, setFieldState] = useState<FieldState>({
    hidden: fieldSetup?.hidden ?? [],
    fields: getInitialFieldState(),
  });
  const [rows, setRows] = useState(buildRows());
  const [hasChanges, setHasChanges] = useState(false);

  const handleCancel = () => {
    setHasChanges(false);
    onCallback();
  };

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await mutationUpdate.mutateAsync(fieldState);
    onCallback();
  };

  const handleDelete = async () => {
    setHasChanges(false);
    await mutationDelete.mutateAsync();
    onCallback();
  };

  const displayMessages = () => {
    if (fieldSetup?.state === 'errorInternal')
      return (
        <Grid size={12}>
          <Alert sx={{ paddingLeft: 1, py: 0 }} severity="error">
            <FieldTemplate
              value={t('consolidation.message_ErrorInternal')}
              type={TemplateType.Html}
              size="xs"
            />
          </Alert>
        </Grid>
      );

    if (fieldSetup?.state === 'errorProduction')
      return (
        <Grid size={12}>
          <Alert sx={{ paddingLeft: 1, py: 0 }} severity="error">
            <FieldTemplate
              value={t('consolidation.message_ErrorInternal')}
              type={TemplateType.Html}
              size="xs"
            />
          </Alert>
        </Grid>
      );

    return (
      <Grid size={12}>
        <Alert sx={{ paddingLeft: 1, py: 0 }} severity="info">
          {getInfoMessage(fieldState, fieldSetup, config)}
        </Alert>
      </Grid>
    );
  };

  const handleEditField = (dataItem: EditFieldData) => {
    setOpenDialog(false);
    setHasChanges(true);

    const currentState = { ...fieldState };
    if (dataItem.hidden) {
      if (currentState.hidden.includes(dataItem.field))
        currentState.hidden = currentState.hidden.filter((x) => x != dataItem.field);
      else currentState.hidden = [...currentState.hidden, dataItem.field];

      currentState.fields = omit(currentState.fields, dataItem.field);
      setRows(
        rows.map((row) =>
          row.field === dataItem.field
            ? {
                ...row,
                consolidation: undefined,
                production: undefined,
                state: 'hidden',
                sort: row.sort ?? '',
              }
            : row
        )
      );
    } else if (dataItem.data) {
      set(currentState.fields, dataItem.field, dataItem.data);
      setFieldState(currentState);
      setRows(
        rows.map((row) =>
          row.field === dataItem.field
            ? {
                ...row,
                consolidation: dataItem.data,
                production: dataItem.data,
                state: 'updated',
              }
            : row
        )
      );
    } else {
      set(currentState.fields, dataItem.field, dataItem.data);
      setFieldState(currentState);
      setRows(
        rows.map((row) =>
          row.field === dataItem.field
            ? {
                ...row,
                consolidation: undefined,
                production: undefined,
                state: 'none',
                sort: row.sort ?? '',
              }
            : row
        )
      );
    }
    setField(null);
  };

  return (
    <Grid container spacing={baseConfig.gridSpacing}>
      {displayMessages()}
      <Grid size={12}>
        <GenericLoadingPanel loading={mutationUpdate.isPending} />
        <StripedDataGrid
          rows={orderBy(rows, 'sort')}
          columns={columns}
          disableColumnMenu
          density="compact"
          editMode="row"
          getRowHeight={() => 'auto'}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          sx={{
            minHeight: 300,
            maxHeight: 700,
            fontSize: '1rem',
            '.MuiDataGrid-columnHeaders': {
              fontFamily: 'Olympic Headline',
              fontSize: '1rem',
            },
          }}
          pagination={false}
          initialState={{
            columns: {
              columnVisibilityModel: {
                field: false,
              },
            },
          }}
          onRowDoubleClick={(event: any) => {
            event.defaultMuiPrevented = true;
            if (!ExcludedFields.includes(event.row.field)) {
              setField(event.row);
              setOpenDialog(true);
            }
          }}
        />
      </Grid>
      <Grid size={12} sx={{ display: 'flex' }}>
        <Button
          startIcon={<DeleteOutline />}
          disableElevation
          color="secondary"
          variant="outlined"
          onClick={handleDelete}
          disabled={!get(fieldSetup?.consolidationRecord, 'id') || mutationUpdate.isPending}
        >
          {t('actions.buttonDelete')}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="secondary"
          startIcon={<CancelOutlined />}
          disableElevation
          onClick={handleCancel}
          disabled={mutationUpdate.isPending}
        >
          {t('actions.buttonCancel')}
        </Button>
        {canEdit && (
          <Button
            startIcon={<SaveOutlined />}
            disableElevation
            color="secondary"
            variant="outlined"
            onClick={handleSave}
            disabled={!canEdit || !hasChanges || mutationUpdate.isPending}
          >
            {t('actions.buttonSave')}
          </Button>
        )}
      </Grid>
      {canEdit && (
        <Grid size={12}>
          <Alert severity="warning" sx={{ paddingLeft: 1, py: 0 }}>
            {t('consolidation.message_executionTime')}
          </Alert>
        </Grid>
      )}
      <EditDialog
        dataItem={field}
        config={config}
        metadata={metadata}
        hidden={fieldState.hidden}
        onClickOk={() => setOpenDialog(false)}
        onClickSave={handleEditField}
        onClickCancel={() => setOpenDialog(false)}
        visible={openDialog && !isNullOrEmpty(field)}
      />
    </Grid>
  );
};
