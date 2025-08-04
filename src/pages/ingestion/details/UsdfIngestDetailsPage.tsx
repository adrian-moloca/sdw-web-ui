import { Box, Paper, Table, TableBody, TableContainer } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ButtonTabPrimary, DisplayBox, ErrorPanel } from 'components';
import { MainCard } from 'components/cards/MainCard';
import { ViewSkeleton } from 'components/skeletons';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import get from 'lodash/get';
import {
  DataType,
  EntityType,
  EnumType,
  IDisplayBoxProps,
  MenuFlagEnum,
  TemplateType,
} from 'models';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useModelConfig, useSecurityProfile } from 'hooks';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { getBreadCrumbData } from 'utils/views';
import { PageContainer } from '@toolpad/core';
import { BasicPageHeader } from 'layout/page.layout';
import {
  IngestEntities,
  IngestLog,
  IngestNotifications,
  IngestUSDMOutput,
  IngestXMLMessage,
} from '../components';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import baseConfig from 'baseConfig';

const locationAtom = atomWithHash('tab', 0);

const UsdfIngestDetailsPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.UsdfIngest);
  const url = `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_INGEST_USDF}`;
  const { id } = useParams();
  const apiService = useApiService();
  const { checkPermission } = useSecurityProfile();

  useEffect(() => {
    checkPermission(MenuFlagEnum.Ingest);
  }, []);

  const [value, setValue] = useAtom(locationAtom);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [`${id}_view`],
    queryFn: () => apiService.getById(config, id ?? '', url),
  });

  const getName = () => {
    if (isLoading || error) return t('common.unknown');

    const displayName = get(data, 'ingest.type') ?? '';
    if (displayName) return displayName;

    return t('common.unknown');
  };

  const displayBoxes: IDisplayBoxProps[] = [
    { field: 'ingest.type', title: t('common.documentType'), enum: EnumType.UsdfType },
    { field: 'ingest.format', title: t('common.format'), enum: EnumType.UsdfFormat },
    { field: 'log.info.messageDiscipline', title: t('general.discipline') },
    { field: 'log.info.messageSize', title: t('common.size'), template: TemplateType.FileSize },
    { field: 'ingest.source', title: t('common.source') },
    { field: 'ingest.errorFlag', title: t('common.status'), template: TemplateType.QueryStatus },
    {
      field: 'ingest.errorMessage',
      title: t('general.error-message'),
      template: TemplateType.TextFormatted,
    },
    { field: 'log.start', title: t('common.startDate'), template: TemplateType.DateTime },
    { field: 'log.end', title: t('common.endDate'), template: TemplateType.DateTime },
    { field: 'log.elapsed', title: t('common.duration'), template: TemplateType.ElapsedTime },
    { field: 'log.status', title: t('common.logStatus'), template: TemplateType.Status },
    { field: 'ingest.createdTs', title: t('common.ingestDate'), template: TemplateType.DateTime },
    { field: 'ingest.id', title: t('common.tag') },
    { field: 'ingest.message', title: t('common.file') },
  ];

  const breadCrumbs = getBreadCrumbData(data, config);

  if (isLoading) {
    return (
      <PageContainer
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: BasicPageHeader }}
      >
        <ViewSkeleton />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: BasicPageHeader }}
      >
        <ErrorPanel error={error} />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer
        title={getName()}
        breadcrumbs={breadCrumbs}
        slots={{ header: BasicPageHeader }}
      >
        <ErrorPanel error={`Ups! ${config.display} not found`} />
      </PageContainer>
    );
  }
  return (
    <PageContainer title={getName()} breadcrumbs={breadCrumbs} slots={{ header: BasicPageHeader }}>
      <Grid container spacing={baseConfig.gridSpacing}>
        <Grid size={12}>
          <MainCard boxShadow={false} border={false} content={false}>
            <TableContainer component={Paper} elevation={0} sx={{ p: 6 }}>
              <Table size="small">
                <TableBody>
                  {displayBoxes.map((box, i) => (
                    <DisplayBox
                      {...box}
                      key={`${i}_boxes`}
                      value={get(data, box.field)}
                      icon={box.icon}
                      type={box.type ?? DataType.String}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
        <Grid size={12}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} variant="fullWidth">
                <ButtonTabPrimary label={t('common.usdfMessage')} value={0} />
                <ButtonTabPrimary label={t('general.usdm-output')} value={1} />
                <ButtonTabPrimary label={t('common.entities')} value={2} />
                <ButtonTabPrimary label={t('common.notifications')} value={3} />
                <ButtonTabPrimary label={t('common.logs')} value={4} />
              </TabList>
            </Box>
            <TabPanel value={0} sx={{ px: 0 }}>
              <IngestXMLMessage data={data?.message} id={id ?? ''} />
            </TabPanel>
            <TabPanel value={1} sx={{ px: 0 }}>
              <IngestUSDMOutput id={id ?? ''} />
            </TabPanel>
            <TabPanel value={2} sx={{ px: 0 }}>
              <IngestEntities data={data?.entities} id={id ?? ''} />
            </TabPanel>
            <TabPanel value={3} sx={{ px: 0 }}>
              <IngestNotifications data={data?.notifications} />
            </TabPanel>
            <TabPanel value={4} sx={{ px: 0 }}>
              <IngestLog data={data?.log?.summary} id={id ?? ''} />
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UsdfIngestDetailsPage;
