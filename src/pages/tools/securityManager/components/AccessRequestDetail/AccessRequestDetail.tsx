import { Box, Button, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material';
import { ButtonTabHeader, MainCard } from 'components';
import { useModelConfig } from 'hooks';
import Close from '@mui/icons-material/Close';
import { DrawerFormProps } from 'models';
import { t } from 'i18next';
import { renderField, renderArrayField, renderUserField, renderStatus } from './utils';
import { useAccessRequestData } from '../useAccessRequestData';
import dayjs from 'dayjs';
import { formatMasterCode } from '_helpers';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Stack, useMediaQuery } from '@mui/system';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AccessRequestPreview } from '../AccessRequestPreview';
import baseConfig from 'baseConfig';

export const AccessRequestDetail = (props: DrawerFormProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    dataAccessOptions,
    operationAccessOptions,
    accessTypeOptions,
    statusOptions,
    environmentOptions,
  } = useAccessRequestData();
  const [value, setValue] = useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const data = props.data.data ?? {};
  const title = `${config.display} ${props.data.data[config.displayAccessor]}`;
  const isNew = data.status?.toLowerCase() === 'new';
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const urlRun = `${apiConfig.toolsEndPoint}${config.apiNode}/${data.id}/{0}`;
  const mutation = useMutation({
    mutationFn: async (newStatus: any) =>
      apiService.put(urlRun.replace('{0}', newStatus), undefined),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [config.apiNode] });
      props.onClose();
    },
    onError: (error: any) => error,
  });
  const urlRunAuto = `${apiConfig.toolsEndPoint}${config.apiNode}/${data.id}/auto`;
  const mutationAuto = useMutation({
    mutationFn: async () => apiService.post(urlRunAuto),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [config.apiNode] });
      queryClient.invalidateQueries({ queryKey: ['security-clients'] });
      queryClient.invalidateQueries({ queryKey: ['security-users'] });
      props.onClose();
    },
    onError: (error: any) => error,
  });

  return (
    <MainCard
      title={title}
      border={false}
      sx={{ height: '100%' }}
      secondary={
        <IconButton onClick={props.onClose}>
          <Close />
        </IconButton>
      }
    >
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid container size={12} sx={{ px: 4 }}>
          {renderStatus(t('common.status'), data.status, statusOptions)}
          {renderField(
            t('common.createdOn'),
            dayjs(data.createdTs).format(baseConfig.dateTimeDateFormat).toUpperCase()
          )}
          {!isNew &&
            renderField(
              t('common.finalizeOn'),
              dayjs(data.ts).format(baseConfig.dateTimeDateFormat).toUpperCase()
            )}
          {!isNew && renderField(t('common.managedBy'), data.updatedBy)}
        </Grid>
        {isNew && (
          <Grid size={12}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="Access request tabs" centered={true}>
                  <ButtonTabHeader label={t('access-request.actions')} value={0} />
                  <ButtonTabHeader label={t('access-request.preview')} value={1} />
                </TabList>
              </Box>
              <TabPanel value={0}>
                <Stack
                  direction={isMobile ? 'column' : 'row'}
                  spacing={1}
                  justifyContent="flex-end"
                >
                  <Button
                    color="secondary"
                    size="small"
                    variant="outlined"
                    sx={{ whiteSpace: 'nowrap' }}
                    startIcon={<SmartToyOutlinedIcon color={'primary'} />}
                    onClick={() => mutationAuto.mutate()}
                  >
                    {t('access-request.auto_process')}
                  </Button>
                  <Divider orientation="vertical" flexItem>
                    <Typography variant="caption" color="text.secondary">
                      {t('common.or')}
                    </Typography>
                  </Divider>
                  <Button
                    color="secondary"
                    size="small"
                    variant="outlined"
                    startIcon={<CheckCircleOutlineOutlinedIcon color={'success'} />}
                    onClick={() => mutation.mutate('processed')}
                  >
                    {t('access-request.status_processed')}
                  </Button>
                  <Button
                    color="secondary"
                    size="small"
                    variant="outlined"
                    startIcon={<DoDisturbOutlinedIcon color={'warning'} />}
                    onClick={() => mutation.mutate('cancelled')}
                  >
                    {t('access-request.status_cancelled')}
                  </Button>
                  <Button
                    color="secondary"
                    size="small"
                    variant="outlined"
                    startIcon={<DoNotDisturbOnOutlinedIcon color={'error'} />}
                    onClick={() => mutation.mutate('denied')}
                  >
                    {t('access-request.status_denied')}
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary" lineHeight={1.2} sx={{ mt: 1 }}>
                  {t('access-request.auto_process_warning')}
                </Typography>
              </TabPanel>
              <TabPanel value={1}>
                <AccessRequestPreview id={data.id} onClose={props.onClose} />
              </TabPanel>
            </TabContext>
          </Grid>
        )}
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid container size={12} sx={{ px: 4 }}>
          {renderField(t('access-request.id'), data.id, 'large')}
          {renderField(t('general.name'), data.name)}
          {renderField(t('general.email'), data.email)}
          {renderField(t('access-request.role'), data.role)}
          {renderField(t('access-request.organization'), data.organization)}
          {renderField(t('access-request.manager'), data.manager)}
          {renderField(
            t('access-request.type'),
            accessTypeOptions.find(
              (option) => option.value.toLowerCase() === data.type.toLowerCase()
            )?.label ?? data.type
          )}
          {renderField(t('access-request.typeContext'), data.typeContext)}
          {renderArrayField(
            t('access-request.dataType'),
            data.dataType.map((value: string) => {
              const option = dataAccessOptions.find((option) => option.value === value);
              return option ? option.label : value;
            })
          )}
          {renderArrayField(
            t('access-request.operationType'),
            data.operationType.map((value: string) => {
              const option = operationAccessOptions.find((option) => option.value === value);
              return option ? option.label : value;
            })
          )}
          {renderField(t('access-request.startDate'), data.startDate)}
          {renderField(t('access-request.endDate'), data.endDate)}
          {renderField(t('access-request.purpose'), data.purpose)}
          {renderField(t('access-request.usageType'), data.usageType)}
          {renderField(t('access-request.volumePerHour'), data.volumePerHour)}
          {renderField(t('access-request.peakUsage'), data.peakUsage)}
          {renderArrayField(
            t('access-request.environments'),
            data.environments.map((value: string) => {
              const option = environmentOptions.find(
                (option) => option.value.toLowerCase() === value.toLowerCase()
              );
              return option ? option.label : value;
            })
          )}
          {data.comments && renderField(t('access-request.comments'), data.comments)}
          {renderUserField(t('access-request.additional-users'), data.users)}
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid container size={12} sx={{ px: 4 }}>
          {renderArrayField(
            t('general.competitionCategories'),
            data.categories?.map((value: string) => formatMasterCode(value))
          )}
          {renderArrayField(
            t('general.disciplines'),
            data.disciplines?.map((value: string) => formatMasterCode(value))
          )}
          {renderArrayField(
            t('general.countries'),
            data.countries?.map((value: string) => formatMasterCode(value))
          )}
          {renderArrayField(
            t('general.sources'),
            data.sources?.map((value: string) => formatMasterCode(value))
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};
