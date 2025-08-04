import { Button, ButtonGroup, Typography, styled, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import RunCircleTwoToneIcon from '@mui/icons-material/RunCircleTwoTone';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import get from 'lodash/get';
import DirectionsRunTwoToneIcon from '@mui/icons-material/DirectionsRunTwoTone';
import { type ChangeEvent, useState } from 'react';
import { apiConfig } from 'config/app.config';
import disciplines from '_locales/sports_data/disciplines-min';
import useApiService from 'hooks/useApiService';
import {
  ConfirmDialog,
  DisciplineAvatar,
  GenericLoadingPanel,
  MainCard,
  StripedDataGridBase,
} from 'components';
import { OlympicColors } from 'themes/colors';
import { StatusField } from '../StatusField';
import { ColumnData } from 'models';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { valueGetter } from './utils';
import baseConfig from 'baseConfig';

type Props = {
  dataItem: any;
  type:
    | 'ranking'
    | 'standings'
    | 'performance'
    | 'results'
    | 'h2h'
    | 'records'
    | 'noc'
    | 'qualifiers';
};

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const IngestControl = ({ dataItem, type }: Props) => {
  const theme = useTheme();
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [showDialog, setShowDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const queryKey = `${type}Log_${dataItem.source}_${dataItem.disciplineCode}`;
  const discipline =
    dataItem.disciplineCode === 'all'
      ? { code: 'ALL', name: t('general.any-discipline') }
      : disciplines.sports.find((x: any) => x.code === dataItem.disciplineCode.toUpperCase());
  const urlLoad = `${apiConfig.apiEndPoint}/data-ingest/system/${type}/logs?`;
  const urlUpload = `${apiConfig.apiEndPoint}/data-ingest/${dataItem.source}/${type}`;

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      apiService.fetch(
        `${urlLoad}source=${dataItem.source}&discipline=${dataItem.disciplineCode.toUpperCase()}`
      ),
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000,
  });

  const urlRun = dataItem.includeDiscipline
    ? `${apiConfig.apiEndPoint}/data-ingest/${dataItem.source}/${type}/${dataItem.disciplineCode}`
    : `${apiConfig.apiEndPoint}/data-ingest/${dataItem.source}/${type}`;
  const mutationGenerate = useMutation({
    mutationFn: async () => (dataItem.isPost ? apiService.post(urlRun) : apiService.fetch(urlRun)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: any) => error,
  });

  const urlRunCache = `${urlRun}?fromCache=true`;
  const mutationGenerateCache = useMutation({
    mutationFn: async () =>
      dataItem.isPost ? apiService.post(urlRunCache) : apiService.fetch(urlRunCache),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: any) => error,
  });

  const urlSync = dataItem.includeDiscipline
    ? `${apiConfig.apiEndPoint}/data-ingest/${dataItem.source}/sync/${dataItem.disciplineCode}`
    : `${apiConfig.apiEndPoint}/data-ingest/${dataItem.source}/sync`;
  const mutationSync = useMutation({
    mutationFn: async () => apiService.post(urlSync),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: any) => error,
  });

  const dataContent = isLoading ? [] : (data ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    index: index + 1,
  }));
  const baseColumns: ColumnData[] = [
    { width: 20, label: '', dataKey: 'index' },
    { width: 300, label: t('common.type'), dataKey: 'type' },
    { width: 100, label: t('general.numRecords'), dataKey: 'numRecords' },
    { width: 80, label: t('common.status'), dataKey: 'status' },
    { width: 120, label: t('general.elapsed'), dataKey: 'elapsed' },
    { width: 180, label: t('general.date'), dataKey: 'date' },
    { width: 200, label: t('common.user'), dataKey: 'user' },
    { width: 400, label: t('common.file'), dataKey: 'file' },
    { width: 200, label: t('common.error'), dataKey: 'error' },
  ];
  const validFiles = '.csv,.xlsx';

  const columns: GridColDef[] = [];
  baseColumns.forEach((col) => {
    columns.push({
      field: col.dataKey,
      headerName: col.label,
      width: col.width,
      sortable: true,
      headerAlign: col.align,
      headerClassName: `sdw-theme-header`,
      valueGetter: (_value, row) => valueGetter(col, row) ?? '',
      renderCell: (params: GridRenderCellParams) =>
        col.dataKey === 'status' ? (
          <StatusField status={get(params.row, 'status')} />
        ) : (
          <Typography>{valueGetter(col, params.row) ?? '-'}</Typography>
        ),
    });
  });
  const handleFileEvent = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      await apiService.uploadFiles(urlUpload, e.target.files);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setIsUploading(false);
    }
  };

  const renderActions = () => {
    if (!dataItem.isApi)
      return (
        <ButtonGroup>
          <Button
            variant="outlined"
            component="label"
            disabled={isUploading || mutationGenerate.isPending}
            role={undefined}
            startIcon={<FileUploadOutlinedIcon />}
            aria-label={`upload ${type}`}
          >
            {t('actions.buttonUpload')}
            <VisuallyHiddenInput
              type="file"
              multiple={true}
              accept={validFiles}
              onChange={handleFileEvent}
            />
          </Button>
          <Button
            variant={dataItem.isBulk ? 'contained' : 'outlined'}
            color={dataItem.isBulk ? 'primary' : 'secondary'}
            startIcon={<DirectionsRunTwoToneIcon />}
            aria-label={`run ${type} data refresh from OSS`}
            disabled={mutationGenerate.isPending}
            onClick={() => setShowDialog(true)}
          >
            {`OSS ${t('actions.buttonRun')}`}
          </Button>
          {dataItem.hasMapping && (
            <Button
              variant="outlined"
              onClick={() => mutationSync.mutate()}
              color="warning"
              startIcon={<SyncOutlinedIcon />}
              aria-label={`Sync/Map`}
              disabled={mutationSync.isPending}
            >
              {t('actions.buttonSyncMap')}
            </Button>
          )}
        </ButtonGroup>
      );

    return (
      <ButtonGroup>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<DirectionsRunTwoToneIcon />}
          disabled={mutationGenerate.isPending || mutationGenerateCache.isPending}
          aria-label={`run ${type} data refresh from API`}
          onClick={() => setShowDialog(true)}
        >
          {t('actions.buttonRun')}
        </Button>
        {dataItem.hasCache && (
          <Button
            variant="contained"
            onClick={() => mutationGenerateCache.mutate()}
            startIcon={<RunCircleTwoToneIcon />}
            aria-label={`run ${type} data refresh from API Cache`}
            disabled={mutationGenerate.isPending || mutationGenerateCache.isPending}
          >
            {`Cache ${t('actions.buttonRun')}`}
          </Button>
        )}
        {dataItem.hasMapping && (
          <Button
            variant="outlined"
            color="warning"
            onClick={() => mutationSync.mutate()}
            startIcon={<SyncOutlinedIcon />}
            aria-label={`Sync/Map`}
            disabled={mutationSync.isPending}
          >
            {t('actions.buttonSyncMap')}
          </Button>
        )}
      </ButtonGroup>
    );
  };

  return (
    <Grid size={{ lg: 6, md: 12 }} key={dataItem.source}>
      <MainCard
        avatar={
          <DisciplineAvatar
            code={discipline?.code ?? ''}
            title={discipline?.name ?? ''}
            size={50}
          />
        }
        title={`${discipline?.code} - ${discipline?.name}`}
        superHeader={
          <Typography variant="caption">{`${dataItem.source.toUpperCase()}`}</Typography>
        }
        subHeader={<Typography variant="body2">{dataItem.description}</Typography>}
        headerSX={{
          py: 1,
          background: `radial-gradient(circle at top left, ${OlympicColors.BLUE} 12%,transparent 10%)`,
        }}
        border={true}
        secondary={renderActions()}
      >
        <GenericLoadingPanel loading={isLoading || mutationGenerate.isPending} />
        <StripedDataGridBase
          rows={rowsWithOrder}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          disableColumnMenu
          hideFooter
          rowHeight={baseConfig.defaultRowHeight ?? 36}
          density="compact"
          sx={{ zIndex: 19 }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
        />
        <>
          {!dataItem.isApi && (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.secondary.dark, lineHeight: 1.1 }}
            >
              <u>NOTE</u>: Please ensure files in{' '}
              <code style={{ color: theme.palette.warning.dark }}>
                {dataItem.format.toUpperCase()}
              </code>{' '}
              are located in the OSS on{' '}
              <span style={{ color: theme.palette.warning.dark }}>
                /data-ingest/{import.meta.env.NODE_ENV}/{dataItem.source.toUpperCase()}/
                {type.toUpperCase()}/input
              </span>{' '}
              prior to trigger any data refresh. Choose upload to add/overwrite existing files with
              new {dataItem.source.toUpperCase()} files. All the files could be found in Teams{' '}
              <code style={{ color: theme.palette.warning.dark }}>
                {dataItem.disciplineCode.toUpperCase()}
              </code>{' '}
              federations folder.
            </Typography>
          )}
        </>
        <ConfirmDialog
          title={`Run ${discipline?.name} ${type} | ${t('common.source')} ${dataItem.source.toUpperCase()}`}
          message={t('message.trigger-new-ingestion').replace('{0}', type)}
          onClickOk={async () => {
            setShowDialog(false);
            mutationGenerate.mutate();
          }}
          onClickCancel={() => setShowDialog(false)}
          visible={showDialog}
        />
      </MainCard>
    </Grid>
  );
};
