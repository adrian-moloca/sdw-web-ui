import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { GenericLoadingPanel } from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { decodeReport } from '../../utils';
import { Logger, isDevelopment } from '_helpers';
import type { Definition } from 'types/tools';
import { AppDispatch, notificationActions } from 'store';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  id: any;
  data: any;
  isLoadingVersion: boolean;
};

export const ReportBulkGeneratorControl = (props: Props) => {
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [version, setVersion] = useState<Definition | null>(null);
  const [disciplines, setDisciplines] = useState<Array<Definition>>([]);
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const url = `${appConfig.gdsReportEndpoint}/config?key=${props.data.next.key}`;

  const { data, isLoading } = useQuery({
    queryKey: [`report_config_${props.data.next.key}`],
    queryFn: () => apiService.fetch(url),
    refetchOnMount: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const urlGenerate = `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}`;
  const generationParameters = checked
    ? uniqBy(data?.options, 'key').map((x: any) => x.key)
    : disciplines.map((x: any) => x.key);

  const mutationGenerate = useMutation({
    mutationFn: () =>
      apiService.post(
        urlGenerate,
        version
          ? { options: generationParameters, version: version.key }
          : { options: generationParameters }
      ),
    onSuccess: () => {
      setVersion(null);
      setDisciplines([]);
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === 'string' &&
          query.queryKey[0].startsWith(`report_info_${props.id}`),
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === 'string' &&
          query.queryKey[0].startsWith(`report_version_${props.id}`),
      });
      dispatch(
        notificationActions.addNotification({
          title: `${props.id} generation for ${generationParameters.length} disciplines has been queued with Success`,
          type: 1,
          id: `${props.id}${generationParameters.length}${dayjs().format()}`,
          status: 5,
          progress: 0,
          dateOccurred: dayjs().format(),
        })
      );
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const canGenerate = (): boolean => {
    if (checked) return true;

    if (disciplines && disciplines.length > 0) return true;

    return false;
  };

  return (
    <>
      <Grid size={8}>
        <Autocomplete
          id="combo-box-disciplines"
          disabled={checked}
          loading={isLoading}
          options={isLoading ? [] : uniqBy(data?.options, 'key')}
          getOptionLabel={(option: any) => option.title}
          getOptionKey={(option: any) => option.key}
          fullWidth
          multiple
          disableCloseOnSelect
          value={disciplines}
          onChange={(_event: any, newValue: Array<Definition> | undefined) =>
            setDisciplines(newValue ?? [])
          }
          renderOption={(props, option, { selected }) => (
            <li {...props} style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Checkbox size="small" icon={icon} checkedIcon={checkedIcon} checked={selected} />
              {option.title}
            </li>
          )}
          renderInput={(params) => <TextField {...params} label={data?.title ?? 'Disciplines'} />}
        />
      </Grid>
      <Grid size={4}>
        <FormControlLabel
          sx={{ marginTop: 1 }}
          control={<Switch checked={checked} onChange={handleChange} />}
          label="Select All"
        />
      </Grid>
      <Grid size={9}>
        <Autocomplete
          id="combo-box-versions"
          loading={props.isLoadingVersion}
          options={props.isLoadingVersion ? [] : props.data?.versions}
          getOptionLabel={(option: any) => option.title}
          getOptionKey={(option: any) => option.key}
          sx={{ width: 200 }}
          value={version}
          onChange={(_event: any, newValue: Definition | null) => setVersion(newValue)}
          renderInput={(params) => <TextField {...params} label="Version" />}
        />
      </Grid>
      <Grid size={12}>
        <Button
          variant="outlined"
          aria-label="download row"
          startIcon={<DirectionsRunOutlinedIcon />}
          disabled={mutationGenerate.isPending || !canGenerate()}
          loading={mutationGenerate.isPending}
          loadingPosition="start"
          size="large"
          onClick={() => mutationGenerate.mutate()}
        >
          {t('actions.buttonGenerate')}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <GenericLoadingPanel loading={mutationGenerate.isPending} />
      </Grid>
    </>
  );
};
