import { EditionFlagEnum, GridActionProps, IConfigProps, Nullable } from 'models';
import {
  GridCallbackDetails,
  GridCellParams,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowModesModel,
  GridRowParams,
  GridSortModel,
  MuiEvent,
} from '@mui/x-data-grid-pro';
import { toolbarMap } from '../DataGridToolbar';
import type { ToolbarType, QueryOptionsProps } from 'types/datagrid';
import { useState, useEffect, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import useAppRoutes from 'hooks/useAppRoutes';
import { StripedIndexDataGrid } from 'components/datagrid/styles';
import baseConfig from 'baseConfig';
import { Paper } from '@mui/material';

declare module '@mui/x-data-grid-pro' {
  interface ToolbarPropsOverrides {
    showCreateButton?: boolean;
    toolbar?: GridActionProps[];
    flags: EditionFlagEnum;
    onClickCreate?: () => void;
    onFilterClean?: () => void;
    queryOptions?: QueryOptionsProps;
  }
}

interface DataGridDisplayProps<T> {
  readonly config: IConfigProps;
  readonly rowCount: number | undefined;
  readonly initialRows: Array<any>;
  readonly columns: GridColDef[];
  readonly flags: EditionFlagEnum;
  readonly loading: boolean;
  readonly toolbar?: GridActionProps[];
  readonly toolbarType: ToolbarType;
  readonly paginationModel: GridPaginationModel;
  readonly disablePagination?: boolean;
  readonly queryOptions?: QueryOptionsProps;
  readonly disableColumnMenu?: boolean;
  readonly onFilterModelChange?: (
    model: GridFilterModel,
    details: GridCallbackDetails<'filter'>
  ) => void;
  readonly onFilterClean: () => void;
  readonly onSortModelChange: (model: GridSortModel, details: GridCallbackDetails) => void;
  readonly onPaginationModelChange?: (
    model: GridPaginationModel,
    details: GridCallbackDetails
  ) => void;
  readonly refetchQueries?: (id: Nullable<string>) => Array<string>;
  readonly onCreate?: () => void;
  readonly onUpdate?: (e: T) => void;
  readonly onOther?: (e: T) => void;
  readonly onSelect?: (e: T) => void;
  readonly fontSize?: string | number;
}

export function DataGridDisplay<T>({
  config,
  initialRows,
  columns,
  rowCount,
  flags,
  toolbar,
  toolbarType,
  paginationModel,
  loading,
  queryOptions,
  disablePagination,
  disableColumnMenu,
  onFilterModelChange,
  onFilterClean,
  onSortModelChange,
  onPaginationModelChange,
  fontSize,
  onCreate,
  onSelect,
}: DataGridDisplayProps<T>) {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const navigate = useNavigate();
  const { getDetailRoute, getCreateRoute } = useAppRoutes();

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel): void => {
    setRowModesModel(newRowModesModel);
  };

  const handleClickCreate = (): void => {
    if (onCreate) onCreate();
    else navigate(getCreateRoute(config.type));
  };

  const handleRowDoubleClick = (params: GridRowParams | GridCellParams) => {
    if (onSelect) {
      onSelect(params.row);
    } else {
      navigate(getDetailRoute(config.type, params.id));
    }
  };

  const slots = {
    toolbar: toolbarMap[toolbarType] ?? undefined,
  };

  return (
    <Paper elevation={0} sx={{ width: '100%' }}>
      <StripedIndexDataGrid
        disableColumnFilter={toolbarType === 'search' || disableColumnMenu === true}
        disableColumnSorting={disableColumnMenu === true}
        disableColumnMenu={disableColumnMenu === true}
        loading={loading}
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        fontSize={fontSize}
        getRowHeight={() => 'auto'}
        autosizeOptions={{ includeHeaders: true }}
        density="compact"
        pagination={!disablePagination}
        paginationMode="server"
        pageSizeOptions={[10, 25, 50, 100, 200]}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        filterMode="server"
        filterModel={queryOptions?.filterModel}
        onFilterModelChange={onFilterModelChange}
        sortingMode="server"
        sortModel={queryOptions?.sortModel}
        onSortModelChange={onSortModelChange}
        rowModesModel={rowModesModel}
        showToolbar={toolbarType !== 'none'}
        onRowDoubleClick={(params: GridRowParams) => {
          handleRowDoubleClick(params);
        }}
        onCellKeyDown={(params: GridCellParams, event: MuiEvent<KeyboardEvent<HTMLElement>>) => {
          if (event.key === 'Enter') {
            handleRowDoubleClick(params);
          }
        }}
        onRowModesModelChange={handleRowModesModelChange}
        columnHeaderHeight={baseConfig.defaultColumnHeaderHeight ?? 60}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        slots={slots}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress',
          },
          toolbar: {
            flags,
            toolbar,
            queryOptions,
            onFilterClean,
            onClickCreate: handleClickCreate,
          },
        }}
      />
    </Paper>
  );
}
