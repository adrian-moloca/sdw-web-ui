import { Avatar, Button, IconButton, Paper, ToggleButton, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import DeveloperModeOutlinedIcon from '@mui/icons-material/DeveloperModeOutlined';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import xmlFormatter from 'xml-formatter';
import convert from 'xml-js';
import { PageContainer } from '@toolpad/core';
import { CodeBlock, GenericLoadingPanel, MainCard } from 'components';
import { Logger, isDevelopment } from '_helpers';
import { MenuFlagEnum } from 'models';
import appConfig, { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import baseConfig from 'baseConfig';
import { BiographyDetails, ReportDetails } from './components';

import {
  getReportDisciplineCode,
  getReportFormat,
  getReportSubtitle,
  getReportVersion,
} from './utils/getters';
import { useSecurityProfile } from 'hooks';

const ReportDetailsPage = () => {
  const theme = useTheme();
  const { id, name, report, key } = useParams();
  const queryClient = useQueryClient();
  const apiService = useApiService();

  const [showDetail, setShowDetail] = useState<boolean>(true);
  const [showRaw, setShowRaw] = useState(false);

  const { checkPermission } = useSecurityProfile();
  checkPermission(MenuFlagEnum.ReportsSetup);

  const fileName = name?.endsWith('xml') ? name : id?.split('/').pop();
  const url = `${appConfig.gdsReportEndpoint}/${report}/retrieve?key=${encodeURIComponent(id ?? '')}`;
  const { data, isLoading } = useQuery({
    queryKey: [`report_${id}`],
    queryFn: () => apiService.downloadReport(url, fileName ?? 'test.xml'),
    refetchOnMount: true,
  });

  const handleDownLoad = async () => {
    await apiService.downloadReportXML(url, fileName ?? 'report.xml');
  };

  const urlGenerate = `${appConfig.gdsReportEndpoint}/${report}`;
  const mutationGenerate = useMutation({
    mutationFn: () =>
      apiService.post(
        urlGenerate,
        getReportVersion(data) > 0
          ? { options: [key], version: getReportVersion(data) }
          : { options: [key] }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === 'string' &&
          (query.queryKey[0].startsWith('report_config_') ||
            query.queryKey[0].startsWith('report_info_')),
      });
      queryClient.invalidateQueries({ queryKey: [`report_${id}`] });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  const format = getReportFormat(data);
  const targetXml = convert.js2xml(data, { compact: true, spaces: 4 });

  return (
    <PageContainer maxWidth="xl">
      <Grid container spacing={baseConfig.gridSpacing}>
        <Grid size={12}>
          <MainCard
            title={name}
            border={true}
            avatar={
              <Avatar
                variant="square"
                sx={{
                  ...theme.typography.largeAvatar,
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
                src={apiConfig.disciplinesIconEndPoint.replace(
                  '{0}',
                  getReportDisciplineCode(data)
                )}
              />
            }
            subtitle={getReportSubtitle(data)}
            secondary={
              <Stack direction="row" spacing={1}>
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
                    {format === 'competition' ? (
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
                    ) : (
                      <BiographyDetails data={data} />
                    )}
                  </Paper>
                )}
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ReportDetailsPage;
