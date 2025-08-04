import { Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import { useModelConfig } from 'hooks';

import useApiService from 'hooks/useApiService';

import { MainCard, StripedDataGrid, TypographyLink } from 'components';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import get from 'lodash/get';
import { IPanelTabProps } from 'types/views';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { humanize, formatMasterCode } from '_helpers';
import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import baseConfig from 'baseConfig';

export const EventCalendarTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.parameter.type);
  const apiService = useApiService();

  const url = `${config.apiNode}/${props.parameter.id}/calendar`;
  const { data, isLoading } = useQuery({
    queryKey: [props.parameter.id, 'calendar'],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const groupedDate = groupBy(rowsWithOrder, 'date');
  const columns: GridColDef[] = [
    {
      field: 'startDateTime',
      headerName: t('general.start-time'),
      width: 110,
      sortable: true,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{dayjs(get(params.row, 'startDateTime')).format('HH:mm')}</Typography>
      ),
    },
    {
      field: 'awarded',
      headerName: '',
      width: 30,
      renderCell: (params) => (
        <>
          {params.row.awarded ? (
            <EmojiEventsOutlinedIcon fontSize="small" color="primary" />
          ) : (
            <CircleOutlinedIcon fontSize="small" color="disabled" />
          )}
        </>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'round',
      headerName: t('general.event'),
      minWidth: 200,
      flex: 1,
      sortable: true,
      valueGetter: (_value, row) => get(row, 'round.title'),
      renderCell: (params: GridRenderCellParams) => (
        <TypographyLink value={params.row.round.title} />
      ),
    },
    {
      field: 'status',
      headerName: t('common.status'),
      minWidth: 110,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <TypographyLink value={humanize(formatMasterCode(params.row.status))} />
      ),
    },
    {
      field: 'finishDateTime',
      headerName: t('general.finish-time'),
      width: 110,
      sortable: true,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{dayjs(get(params.row, 'finishDateTime')).format('HH:mm')}</Typography>
      ),
    },
  ];

  return (
    <Grid container spacing={2}>
      {Object.keys(groupedDate).map((group: any) => {
        const groupData = groupedDate[group];
        return (
          <Grid size={12} key={group}>
            <MainCard
              title={
                <Typography variant="body1" fontWeight={500}>
                  {dayjs(group).format(baseConfig.dayDateFormat).toUpperCase()}
                </Typography>
              }
              border={false}
              divider={false}
              contentSX={{ pt: 0 }}
            >
              <StripedDataGrid
                rows={groupData}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.order}
                disableRowSelectionOnClick
                disableColumnMenu
                hideFooter
                rowHeight={baseConfig.defaultRowHeight ?? 36}
                density="compact"
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
              />
            </MainCard>
          </Grid>
        );
      })}
    </Grid>
  );
};
