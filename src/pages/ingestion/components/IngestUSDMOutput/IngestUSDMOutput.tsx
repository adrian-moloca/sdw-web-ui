import { Alert, Button, Stack } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { t } from 'i18next';
import useApiService from 'hooks/useApiService';
import { useQuery } from '@tanstack/react-query';
import appConfig from 'config/app.config';
import { GenericLoadingPanel, MainCard } from 'components';
import styled from 'styled-components';

type Props = {
  id: string;
};
const StyledJsonViewer = styled.div`
  background-color: #eee;
  padding: 12px;
  border-radius: 8px;
`;
export const IngestUSDMOutput = (props: Props) => {
  const apiService = useApiService();
  const url = `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_INGEST_USDM}/${props.id}`;
  const { data, isLoading } = useQuery({
    queryKey: [`${props.id}_usdm_message`],
    queryFn: () => apiService.fetch(url),
  });

  const jsonStyles = defaultStyles;
  const downloadJson = async () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.id}_USDM.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openJsonInNewTab = async () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    URL.revokeObjectURL(url);
    if (newTab === null) {
      alert(t('message.popup-blocked'));
    }
  };
  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;
  if (!data || data.length === 0)
    return (
      <MainCard>
        <Alert severity="info">{t('messages.no-usdm-data-available')}</Alert>
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
      <PerfectScrollbar style={{ maxHeight: 640, overflowX: 'hidden' }}>
        <StyledJsonViewer>
          <JsonView data={data} shouldExpandNode={allExpanded} style={{ ...jsonStyles }} />
        </StyledJsonViewer>
      </PerfectScrollbar>
    </MainCard>
  );
};
