import React, { JSX, useState } from 'react';
import {
  GridValidRowModel,
  useGridApiRef,
  GridFilterModel,
  GridPaginationModel,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { StyledDataGridPro } from './StyledDataGridPro';
import { CustomToolbarStatusScope } from './CustomToolbarStatusScope';
import { colors } from 'themes/colors';

interface DataScopeStatusTableProps {
  rows: GridValidRowModel[];
  columns: GridColDef[];
  isLoading?: boolean;
}

export const DataScopeStatusTable: React.FC<DataScopeStatusTableProps> = ({
  rows,
  columns,
  isLoading,
}) => {
  const apiRef = useGridApiRef();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 25,
    page: 0,
  });

  const clearFilters = (): void => {
    if (apiRef.current) {
      apiRef.current.setFilterModel({ items: [] } as GridFilterModel);
      apiRef.current.setQuickFilterValues([]);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: colors.neutral['200'],
        borderRadius: '8px',
      }}
    >
      <StyledDataGridPro
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.id || row.competitionId}
        disableRowSelectionOnClick
        checkboxSelection={false}
        density="compact"
        pagination
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        getRowClassName={(params: any) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        showToolbar
        slots={{
          toolbar: (): JSX.Element => <CustomToolbarStatusScope clearFilters={clearFilters} />,
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              frequency: true,
            },
          },
          pinnedColumns: {
            left: [],
            right: [],
          },
        }}
        sx={{
          backgroundColor: '#fff',
          padding: '8px 16px 0 16px',
          border: 'none',
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-row': {
            height: '32px',
            maxHeight: '32px !important',
            minHeight: '32px !important',
          },
          '& .MuiDataGrid-virtualScroller': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            height: '32px',
            maxHeight: '32px',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
};
