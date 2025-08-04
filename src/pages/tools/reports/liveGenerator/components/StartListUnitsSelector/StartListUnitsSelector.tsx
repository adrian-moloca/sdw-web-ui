import { Autocomplete, Box, Button, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import type { Definition } from 'types/tools';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { GenericLoadingPanel, MainCard } from 'components';
import { Logger, isDevelopment } from '_helpers';
import { StartListUnitsViewer } from '../StartListUnitsViewer';

type Props = {
  discipline: any;
};

export const StartListUnitsSelector = (props: Props) => {
  const [unit, setUnit] = useState<Definition | null>(null);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const url = `${appConfig.gdsReportEndpoint}/config?key=${props.discipline.next.key}`;
  const { data, isLoading } = useQuery({
    queryKey: [`report_config_${props.discipline.next.key}`],
    queryFn: () => apiService.fetch(url),
  });

  const urlGenerate = `${appConfig.reportEndPoint}/live/ingestion/force/`;
  const mutationGenerate = useMutation({
    mutationFn: (id: string) => apiService.post(`${urlGenerate}${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`report_config_${props.discipline.next.key}`] });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return (
    <MainCard size="small" divider={false} border={false} contentSX={{ px: 0 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              id="h2h-box-units"
              size="small"
              fullWidth
              loading={isLoading}
              options={isLoading ? [] : data?.options}
              getOptionLabel={(option: any) =>
                `${option.title} (${option.code.slice(-5).replace('--', '')})`
              }
              getOptionKey={(option: any) => option.key}
              value={unit}
              onChange={(_event: any, newValue: Definition | null) => setUnit(newValue)}
              renderInput={(params) => <TextField {...params} label="Round" />}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="outlined"
              aria-label="download row"
              startIcon={<DirectionsRunOutlinedIcon />}
              disabled={mutationGenerate.isPending || !unit}
              loading={mutationGenerate.isPending}
              loadingPosition="start"
              onClick={() => mutationGenerate.mutate(unit?.key ?? '')}
            >
              {t('actions.buttonGenerate')}
            </Button>
          </Stack>
        </Grid>
        <Grid size={12}>
          <StartListUnitsViewer unit={unit} allUnits={data?.options} {...props} />
        </Grid>
      </Grid>
    </MainCard>
  );
};
