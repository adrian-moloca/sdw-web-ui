import { Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import { useStoreCache } from 'hooks';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { ExtendedCard, OfficialChip, StripedDataGridBase } from 'components';
import baseConfig from 'baseConfig';
import { MasterData } from 'models';

type Props = {
  data: any;
};

export const OfficialsDisplay = ({ data = [] }: Props) => {
  if (!data.officials || data.officials.length == 0) return null;
  const theme = useTheme();
  const { getMasterDataValue } = useStoreCache();
  const columns: GridColDef[] = [
    {
      field: 'function',
      headerName: t('common.function'),
      minWidth: 260,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => {
        const value = getMasterDataValue(get(params.row, 'function'), MasterData.Function);
        return <Typography variant="body2">{value?.value ?? t('general.official')}</Typography>;
      },
    },
    {
      field: 'participationName',
      headerName: t('general.name'),
      minWidth: 400,
      sortable: true,
      flex: 1,
      valueGetter: (_value, row) => row.participationName,
      renderCell: (params: GridRenderCellParams) => (
        <OfficialChip data={params.row} variant="body2" />
      ),
    },
    {
      field: 'gender',
      headerName: t('general.gender'),
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {getMasterDataValue(params.value, MasterData.PersonGender)?.value}
        </Typography>
      ),
    },
  ];
  return (
    <ExtendedCard titleText={t('general.juryOfficials')} icon={GavelOutlinedIcon}>
      <StripedDataGridBase
        rows={orderBy(data.officials, 'order')}
        columns={columns}
        fontSize={theme.typography.body2.fontSize}
        getRowId={(row) => row.participationName}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter
        rowHeight={baseConfig.defaultRowHeight ?? 36}
        density="compact"
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      />
    </ExtendedCard>
  );
};
