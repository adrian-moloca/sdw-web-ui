import { Box, Typography, useTheme } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import baseConfig from 'baseConfig';
import { StripedDataGridBase } from 'components';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { IngestProgressInline } from '../ingestProgress';
import { GlobalSetup } from '../types';

export const IngestDisplay: React.FC<GlobalSetup> = ({ ingest }) => {
  const theme = useTheme();
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('common.source'),
      width: 120,
      renderCell: ({ value }) => (
        <Typography variant="body2">{value.replace('IngestProgress', '').toUpperCase()}</Typography>
      ),
    },
    {
      field: 'value',
      headerName: t('general.progress'),
      flex: 1,
      renderCell: ({ value }) => <IngestProgressInline item={value} theme={theme} />,
    },
    {
      field: 'ts_',
      headerName: t('general.lastExecution'),
      width: 200,
      renderCell: ({ value }) => (
        <Typography variant="body2">
          {dayjs(value).format(baseConfig.dateTimeDateFormat).toUpperCase()}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ maxHeight: 300 }}>
      <StripedDataGridBase
        rows={ingest}
        fontSize={'body2'}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        disableColumnMenu
        getRowHeight={() => 'auto'}
        density="compact"
        hideFooter
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      />
    </Box>
  );
};
