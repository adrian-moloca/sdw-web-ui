import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isDevelopment, Logger } from '_helpers';
import { useAppModel, useModelConfig, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import { ActionType, EditionMode, EntityType, EnumType } from 'models';
import Grid from '@mui/material/Grid';
import { Button, CardActions, Divider, List, Stack, Typography } from '@mui/material';
import get from 'lodash/get';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { lazy, useState } from 'react';
import { EnumTemplate, GenericLoadingPanel, LinearProgress, MainCard } from 'components';
import { ReportDeliveryControl, ReportStatusControl } from 'pages/reports-manager/components';
import { ProfileItemElement, ProfileItemText, BiographyProfileBlock } from 'pages/profiles';
import baseConfig from 'baseConfig';

const DeliveryPlanForm = lazy(() => import('pages/reports-manager/forms/DeliveryPlanForm'));

type Props = {
  data: any;
  type: EntityType;
};

export const DeliveryPlanDisplay = (props: Props) => {
  const { getDataSourceUrl, getConfig } = useModelConfig();
  const { dataInfo, managerSetup } = useStoreCache();
  const config = getConfig(props.type);
  const { getIconBase } = useAppModel();
  const [editionMode, setEditionMode] = useState(EditionMode.Detail);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const url = `${getDataSourceUrl(props.type)}/${props.data?.id}`;
  const { data, isLoading } = useQuery({
    queryKey: [`${props.data?.id}_view`],
    queryFn: () => apiService.fetch(url),
    enabled: Boolean(props.data?.id),
  });

  const mutation = useMutation({
    mutationFn: async () => apiService.put(`${url}/generate`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.data?.id}_view`] });
    },
    onError: (error: any) => error,
  });

  const mutationEvaluate = useMutation({
    mutationFn: async () => apiService.put(`${url}/sync`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.data?.id}_view`] });
    },
    onError: (error: any) => error,
  });

  const handleGenerateClick = async () => {
    try {
      await mutation.mutateAsync();
    } catch {
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  const handleEvaluateClick = async () => {
    try {
      await mutationEvaluate.mutateAsync();
    } catch {
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  if (!props.data?.id) return <></>;
  const IconExecute = getIconBase(ActionType.Execute);
  const IconEdit = getIconBase(ActionType.Edit);
  const IconValidate = getIconBase(ActionType.Validate);
  return (
    <Grid container spacing={2} size={12}>
      <Grid size={{ xs: 12, sm: 12, md: 5, lg: 3 }}>
        <MainCard content={false} size="toolbar">
          <Stack
            direction="row"
            spacing={1}
            sx={{ p: 2, paddingBottom: 0 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">{config.display}</Typography>
            <ReportStatusControl type={config.type} dataItem={data?.data ?? {}} mode="report" />
          </Stack>
          <List>
            <ProfileItemElement
              value={t('common.type')}
              element={
                <EnumTemplate
                  type={EnumType.DeliveryType}
                  value={get(data?.data, 'type')}
                  withText={true}
                />
              }
            />
            <ProfileItemElement
              value={t('common.status')}
              element={
                <EnumTemplate
                  type={EnumType.DeliveryStatus}
                  value={get(data?.data, 'status')}
                  withText={true}
                />
              }
            />
            <ProfileItemText
              value={t('common.scheduleDate')}
              title={dayjs(get(data?.data, 'scheduleDate'))
                .format(baseConfig.dayDateFormat)
                .toUpperCase()}
            />
            <ProfileItemText
              value={t('general.reports')}
              title={data?.data.deliverables?.length.toLocaleString()}
            />
            <ProfileItemText
              value={'Days Remaining'}
              title={get(data?.data, 'daysRemaining').toLocaleString()}
            />
            <ProfileItemText
              value={'Working Days Remaining'}
              title={get(data?.data, 'workingDaysRemaining').toLocaleString()}
            />
            <ProfileItemText
              value={t('common.deliveryDate')}
              title={dayjs(get(data?.data, 'deliveryDate'))
                .format(baseConfig.dayDateFormat)
                .toUpperCase()}
            />
          </List>
          <Divider variant="fullWidth">
            <Typography variant="h5">{t('common.scope')}</Typography>
          </Divider>
          <List>
            {props.data.scope?.map((x: string, index: number) => {
              const value = dataInfo.categories.find((y: any) => y.id == x || y.code == x);
              return (
                <ProfileItemText
                  value={value?.code}
                  title={value?.title ?? ''}
                  key={index}
                  boldTitle={true}
                />
              );
            })}
          </List>
          <Divider variant="fullWidth">
            <Typography variant="h5">{t('common.execution')}</Typography>
          </Divider>
          <List>
            <ProfileItemElement
              value={t('common.readiness')}
              element={<LinearProgress value={props.data.rate} />}
            />
            <ProfileItemElement
              value={t('common.dataStatus')}
              element={<LinearProgress value={props.data.dataRate} />}
            />
            <ProfileItemText
              value={t('common.lastModify')}
              title={dayjs(get(data?.data, 'ts'))
                .format(baseConfig.dateTimeDateFormat)
                .toUpperCase()}
            />
            <ProfileItemText value={t('common.managedBy')} title={get(data?.data, 'updatedBy')} />
            <ProfileItemText
              value={t('common.outputFolder')}
              title={`${managerSetup.deliveryFolder}/${dayjs(get(data?.data, 'scheduleDate')).format('YYYYMMDD')}`}
            />
          </List>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              startIcon={<IconExecute />}
              size="small"
              disableElevation
              variant="outlined"
              color="secondary"
              onClick={handleGenerateClick}
            >
              {t('actions.buttonGenerate')}
            </Button>
            <Button
              startIcon={<IconValidate />}
              size="small"
              disableElevation
              variant="outlined"
              color="secondary"
              onClick={handleEvaluateClick}
            >
              {t('actions.evaluate')}
            </Button>
            <Button
              startIcon={<IconEdit />}
              size="small"
              disableElevation
              variant="outlined"
              color="secondary"
              onClick={() => setEditionMode(EditionMode.Update)}
            >
              {t('actions.buttonEdit')}
            </Button>
          </CardActions>
        </MainCard>
      </Grid>
      <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 7, lg: 9 }}>
        <Grid size={12}>
          {editionMode == EditionMode.Detail ? (
            <MainCard size="small" title={t('general.generalInformation')} expandable={true}>
              <Grid container spacing={2}>
                <BiographyProfileBlock
                  data={props.data}
                  field="comments"
                  title={t('general.notes-and-comments')}
                  bold={true}
                />
                <BiographyProfileBlock
                  data={props.data}
                  field="risks"
                  title={t('general.risk-mitigation')}
                  bold={true}
                />
              </Grid>
            </MainCard>
          ) : (
            <DeliveryPlanForm
              data={props.data}
              editionMode={editionMode}
              onClose={() => setEditionMode(EditionMode.Detail)}
              type={config.type}
            />
          )}
        </Grid>
        <ReportDeliveryControl data={data?.data} type={config.type} />
      </Grid>
    </Grid>
  );
};
