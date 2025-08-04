import {
  Alert,
  Button,
  Stack,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { t } from 'i18next';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { BorderedTable, MainCard, StyledTableCell } from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { LogRow } from '../LogRow';

type Props = {
  id: string;
  data?: Array<any>;
};

export const IngestLog = (props: Props) => {
  const apiService = useApiService();

  const downloadFile = async () => {
    const urlService = `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_DOWNLOAD_LOG.replace('{0}', props.id)}`;
    return await apiService.fetch(urlService);
  };

  const downloadJson = async () => {
    const content = await downloadFile();
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.id}_log.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openJsonInNewTab = async () => {
    const content = await downloadFile();
    const jsonContent = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    URL.revokeObjectURL(url);
    if (newTab === null) {
      alert(t('message.popup-blocked'));
    }
  };
  if (!props.data || props.data.length === 0)
    return (
      <MainCard>
        <Alert severity="warning" sx={{ mt: 1 }}>
          {t('messages.no-logs-available-for-this-ingestion')}
        </Alert>
      </MainCard>
    );
  return (
    <MainCard
      headerSX={{ pb: 0 }}
      contentSX={{ pt: 0 }}
      secondary={
        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ my: 1 }}>
          <Button
            variant="outlined"
            onClick={openJsonInNewTab}
            startIcon={<OpenInNewOutlinedIcon />}
          >
            {t('actions.buttonView')}
          </Button>
          <Button
            variant="outlined"
            onClick={downloadJson}
            startIcon={<FileDownloadOutlinedIcon />}
          >
            {t('actions.buttonDownload')}
          </Button>
        </Stack>
      }
    >
      <TableContainer>
        <BorderedTable stickyHeader sx={{ minWidth: 200 }} size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>{t('common.module')}</StyledTableCell>
              <StyledTableCell>{t('common.status')}</StyledTableCell>
              <StyledTableCell align="right">{t('common.duration')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data
              ?.filter((x) => x.module)
              .map((e: any) => (
                <LogRow key={e.id} row={e} />
              ))}
          </TableBody>
        </BorderedTable>
      </TableContainer>
    </MainCard>
  );
};
