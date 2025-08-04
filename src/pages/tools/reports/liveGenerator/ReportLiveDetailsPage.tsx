import { Avatar, Button, IconButton, Paper, ToggleButton, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import DeveloperModeOutlinedIcon from '@mui/icons-material/DeveloperModeOutlined';
import { t } from 'i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import xmlFormatter from 'xml-formatter';
import convert from 'xml-js';
import { GenericLoadingPanel, MainCard, CodeBlock } from 'components';
import { Logger, isDevelopment } from '_helpers';
import { MenuFlagEnum } from 'models';
import appConfig, { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import baseConfig from 'baseConfig';
import { ReportDetails } from 'pages/tools/reports/details/components';
import {
  getReportVersion,
  getReportDisciplineCode,
  getReportSubtitle,
} from 'pages/tools/reports/details/utils/getters';
import { useSecurityProfile } from 'hooks';

const ReportLiveDetailsPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const apiService = useApiService();

  const [showDetail, setShowDetail] = useState<boolean>(true);
  const [showRaw, setShowRaw] = useState(false);

  const { checkPermission } = useSecurityProfile();
  checkPermission(MenuFlagEnum.GamesTimeInfo);

  const url = `${appConfig.gdsReportEndpoint}/H2H/retrieve?key=${id}`;

  const { data, isLoading } = useQuery({
    queryKey: [`report_${id}`],
    queryFn: () => apiService.downloadReport(url, 'test.xml'),
    refetchOnMount: true,
  });

  const handleDownLoad = async () => {
    await apiService.downloadReportXML(url, 'report.xml');
  };

  const urlGenerate = `${appConfig.gdsReportEndpoint}/H2H`;
  const mutationGenerate = useMutation({
    mutationFn: () =>
      apiService.post(
        urlGenerate,
        getReportVersion(data) > 0
          ? { options: [id], version: getReportVersion(data) }
          : { options: [id] }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === 'string' &&
          (query.queryKey[0].startsWith('report_config_') ||
            query.queryKey[0].startsWith('report_info_')),
      });
      queryClient.invalidateQueries({
        queryKey: [`report_${id}`],
      });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  const targetXml = convert.js2xml(data, { compact: true, spaces: 4 });

  return (
    <Grid container spacing={baseConfig.gridSpacing}>
      <Grid size={12}>
        <MainCard
          title={data?.OdfBody.Competition?.Document._attributes.FileName}
          border={true}
          avatar={
            <Avatar
              variant="square"
              sx={{ ...theme.typography.largeAvatar, backgroundColor: 'white', cursor: 'pointer' }}
              src={apiConfig.disciplinesIconEndPoint.replace('{0}', getReportDisciplineCode(data))}
            />
          }
          headerSX={{ backgroundColor: 'rgb(248, 250, 252)' }}
          subtitle={getReportSubtitle(data)}
          secondary={
            <Stack direction={'row'} spacing={1}>
              <ToggleButton
                value="check"
                color="primary"
                selected={showRaw}
                onChange={() => {
                  setShowRaw(!showRaw);
                }}
              >
                <DeveloperModeOutlinedIcon />
              </ToggleButton>
              <Button
                variant="outlined"
                aria-label="report download"
                startIcon={<FileDownloadOutlinedIcon />}
                disabled={mutationGenerate.isPending}
                onClick={handleDownLoad}
              >
                {t('actions.buttonDownload')}
              </Button>
              <Button
                variant="outlined"
                aria-label="report generate"
                startIcon={<DirectionsRunOutlinedIcon />}
                loadingPosition="start"
                loading={mutationGenerate.isPending}
                onClick={() => mutationGenerate.mutate()}
              >
                {t('actions.buttonGenerate')}
              </Button>
              <IconButton
                aria-label="report generation details"
                size="small"
                onClick={() => setShowDetail(!showDetail)}
              >
                {showDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Stack>
          }
        >
          <Grid container spacing={baseConfig.gridSpacing}>
            <ReportDetails visible={showDetail} data={data} />
            <Grid size={12}>
              {showRaw ? (
                <Paper sx={{ p: 2 }}>
                  <CodeBlock
                    code={xmlFormatter(targetXml, { indentation: '  ' })}
                    language="xml"
                    theme="solarized-light"
                  />
                </Paper>
              ) : (
                <Paper sx={{ p: 2 }}>
                  <>
                    <div
                      className="xml-viewer"
                      dangerouslySetInnerHTML={{
                        __html: data.OdfBody.Competition.Document.Title._cdata,
                      }}
                    />
                    <div
                      className="xml-viewer"
                      dangerouslySetInnerHTML={{
                        __html: data.OdfBody.Competition.Document.Body._cdata,
                      }}
                    />
                  </>
                </Paper>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ReportLiveDetailsPage;
