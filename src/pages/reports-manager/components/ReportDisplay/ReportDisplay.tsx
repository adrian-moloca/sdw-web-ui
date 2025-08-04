import useApiService from 'hooks/useApiService';
import { ActionType, EntityType, EnumType, TemplateType } from 'models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Grid from '@mui/material/Grid';
import {
  Button,
  CardActions,
  Divider,
  List,
  Stack,
  Typography,
  useColorScheme,
  useTheme,
} from '@mui/material';
import { Link as RouteLink } from 'react-router-dom';
import get from 'lodash/get';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { isDevelopment, Logger } from '_helpers';
import { EnumTemplate, FieldTemplate, GenericLoadingPanel, MainCard } from 'components';
import appConfig from 'config/app.config';
import {
  ReportDeliveryControl,
  ReportExecutionControl,
  ReportStatusControl,
  ReportNotesControl,
  ReportViewerControl,
} from 'pages/reports-manager/components';
import { ProfileItemElement, ProfileItemText } from 'pages/profiles';
import { useAppModel, useModelConfig } from 'hooks';
import baseConfig from 'baseConfig';

type Props = {
  data: any;
  type: EntityType;
};

export const ReportDisplay = (props: Props) => {
  const { getDataSourceUrl, getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const { getIconBase } = useAppModel();
  const theme = useTheme();
  const { mode } = useColorScheme();
  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300];
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const Icon = getIconBase(ActionType.Execute);
  const url = `${getDataSourceUrl(props.type)}/${props.data?.id}`;
  const { data, isLoading } = useQuery({
    queryKey: [`${props.data?.id}_view`],
    queryFn: () => apiService.fetch(url),
    enabled: Boolean(props.data?.id),
  });

  const urlExecute = `${appConfig.reportManagerEndPoint}${config.apiNode}/${props.data?.id}/execute`;
  const mutation = useMutation({
    mutationFn: async () => apiService.post(urlExecute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.data?.id}_view`] });
    },
    onError: (error: any) => error,
  });

  const handleExecuteClick = async () => {
    try {
      await mutation.mutateAsync();
    } catch {
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  if (!props.data?.id) return <></>;

  const bioStatus = get(data?.data, 'biography.status');

  return (
    <Grid container spacing={2} size={12}>
      <Grid size={{ xs: 12, sm: 12, md: 5, lg: 3 }}>
        <MainCard content={false} sx={{ paddingBottom: 2 }} size="toolbar">
          <Stack
            direction="row"
            spacing={1}
            sx={{ p: 1, backgroundColor: color }}
            alignItems="center"
            justifyContent="space-between"
          >
            <ReportStatusControl type={config.type} dataItem={data?.data ?? {}} mode="report" />
            <ReportStatusControl type={config.type} dataItem={data?.data ?? {}} mode="data" />
          </Stack>
          <Stack spacing={1} sx={{ p: 1, backgroundColor: color }} alignItems="center">
            <FieldTemplate
              type={TemplateType.ListDiscipline}
              value={get(data?.data, 'disciplines') ?? get(data?.data, 'variation.disciplines')}
              withText={false}
            />
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
              {get(data?.data, 'shortName')}
            </Typography>
          </Stack>
          <List>
            <ProfileItemElement
              value={t('common.status')}
              element={
                <EnumTemplate
                  type={EnumType.ReportStatus}
                  value={get(data?.data, 'status')}
                  withText={true}
                />
              }
            />
            <ProfileItemElement
              value={t('common.dataStatus')}
              element={
                <EnumTemplate
                  type={EnumType.DataStatus}
                  value={get(data?.data, 'statusData')}
                  withText={true}
                />
              }
            />
            {bioStatus && (
              <ProfileItemElement
                value={t('general.biography-status')}
                element={
                  <EnumTemplate type={EnumType.BioStatus} value={bioStatus} withText={true} />
                }
              />
            )}
            <ProfileItemElement
              value={t('common.format')}
              element={
                <EnumTemplate
                  type={EnumType.ReportFormat}
                  value={get(data?.data, 'format')}
                  withText={true}
                />
              }
            />
            <ProfileItemElement
              value={t('general.disciplines')}
              element={
                <FieldTemplate
                  type={TemplateType.Discipline}
                  value={get(data?.data, 'disciplines') ?? get(data?.data, 'variation.disciplines')}
                  withText={false}
                />
              }
            />
            <ProfileItemElement
              value={t('general.reportVariation')}
              element={
                <Typography
                  component={RouteLink}
                  to={`/${getConfig(EntityType.ReportVariation).path}/${get(data?.data, 'variation.id')}`}
                  sx={{ color: mode === 'dark' ? 'white' : 'black' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>{get(data?.data, 'variation.code')}</b>
                  {` - ${get(data?.data, 'variation.name')}`}
                </Typography>
              }
            />
          </List>
          <Divider variant="fullWidth">
            <Typography variant="h5">{t('common.execution')}</Typography>
          </Divider>
          <List>
            <ProfileItemText
              value={t('common.lastGeneration')}
              title={dayjs(get(data?.data, 'generatedOn'))
                .format(baseConfig.dateTimeDateFormat)
                .toUpperCase()}
            />
            <ProfileItemText
              value={t('common.generatedBy')}
              title={get(data?.data, 'generatedBy')}
            />
          </List>
          <Divider variant="fullWidth">
            <Typography variant="h5">{t('common.delivery')}</Typography>
          </Divider>
          <List>
            <ProfileItemText
              value={t('general.initialDelivery')}
              title={dayjs(get(data?.data, 'initialDelivery'))
                .format(baseConfig.dayDateFormat)
                .toUpperCase()}
            />
            <ProfileItemText
              value={t('general.nextDelivery')}
              title={dayjs(get(data?.data, 'nextDelivery'))
                .format(baseConfig.dayDateFormat)
                .toUpperCase()}
            />
            <ProfileItemText
              value={t('general.finalDelivery')}
              title={dayjs(get(data?.data, 'finalDelivery'))
                .format(baseConfig.dayDateFormat)
                .toUpperCase()}
            />
          </List>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Grid container spacing={1} justifyContent={'flex-end'}>
              <Grid size={'auto'}>
                <Button
                  startIcon={<Icon />}
                  size="small"
                  disableElevation
                  variant="outlined"
                  color="secondary"
                  onClick={handleExecuteClick}
                >
                  {t('actions.execute')}
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </MainCard>
      </Grid>
      <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 7, lg: 9 }}>
        <ReportViewerControl data={data?.data} />
        <ReportDeliveryControl data={data?.data} type={config.type} />
        <ReportExecutionControl data={data?.data} />
        <ReportNotesControl data={data?.data} />
      </Grid>
    </Grid>
  );
};
