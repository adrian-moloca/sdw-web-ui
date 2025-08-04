import { Autocomplete, Box, Button, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { GenericLoadingPanel, MainCard } from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import type { Definition } from 'types/tools';
import { Logger, isDevelopment } from '_helpers';
import { ReportViewer } from '../../generator/components';
import { AppDispatch, notificationActions } from 'store';

type Props = {
  id: any;
};

export const CReportsGenerator = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [version, setVersion] = useState<Definition | null>(null);
  const [discipline, setDiscipline] = useState<Definition | null>(null);

  const url = `${appConfig.gdsReportEndpoint}/config?key=${props.id}`;
  const { data, isLoading } = useQuery({
    queryKey: [`report_config_${props.id}`],
    queryFn: () => apiService.fetch(url),
  });

  const urlGenerate = `${appConfig.gdsReportEndpoint}/${props.id}/generate`;
  const mutationGenerate = useMutation({
    mutationFn: () =>
      apiService.post(
        urlGenerate,
        version
          ? { options: [discipline?.title], version: version.key }
          : { options: [discipline?.title] }
      ),
    onSuccess: (response: any) => {
      const hasError = response?.totalErrors && response?.totalErrors > 0;
      dispatch(
        notificationActions.addNotification({
          title: `${props.id} report generation for ${discipline?.title} completed. Total Records: ${response?.totalRecords}`,
          message: response?.errors ?? response?.fileNames,
          type: hasError ? 3 : 1,
          id: `${props.id}${discipline?.title}`,
          status: hasError ? 3 : 1,
          progress: 0,
          dateOccurred: dayjs().format(),
        })
      );
      //setVersion(null);
      //setDiscipline(null);
      queryClient.invalidateQueries({ queryKey: [`report_config_${props.id}`] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === 'string' &&
          query.queryKey[0].startsWith(`report_info_${props.id}`),
      });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;

  return (
    <MainCard
      boxShadow={true}
      border={true}
      headerSX={{ backgroundColor: 'rgb(248, 250, 252)' }}
      title="C24 - Records"
      subtitle={'DT_PARTIC, DT_PARTIC_TEAMS and DT_RECORD Generation'}
      divider={true}
      content={true}
    >
      <Grid container spacing={1}>
        <Grid size={12}>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              id="combo-box-disciplines"
              size="small"
              loading={isLoading}
              options={isLoading ? [] : data?.options}
              getOptionLabel={(option: any) => option.title}
              getOptionKey={(option: any) => option.key}
              sx={{ width: 180 }}
              value={discipline}
              onChange={(_event: any, newValue: Definition | null) => setDiscipline(newValue)}
              renderInput={(params) => <TextField {...params} label="Discipline" />}
            />
            <Autocomplete
              id="combo-box-versions"
              size="small"
              loading={isLoading}
              options={isLoading ? [] : data?.versions}
              getOptionLabel={(option: any) => option.title}
              getOptionKey={(option: any) => option.key}
              sx={{ width: 180 }}
              value={version}
              onChange={(_event: any, newValue: Definition | null) => setVersion(newValue)}
              renderInput={(params) => <TextField {...params} label="Version" />}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              aria-label="download row"
              loadingPosition="start"
              startIcon={<DirectionsRunOutlinedIcon />}
              disabled={mutationGenerate.isPending}
              loading={mutationGenerate.isPending}
              onClick={() => mutationGenerate.mutate()}
            >
              {t('actions.buttonGenerate')}
            </Button>
          </Stack>
        </Grid>
        <Grid size={12}>{discipline && <ReportViewer id={discipline?.key} />}</Grid>
      </Grid>
    </MainCard>
  );
};
