import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { t } from 'i18next';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { Stack } from '@mui/system';
import { DateRange, MultiInputDateRangeField } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { DataGridPanel } from 'components/datagrid';
import appConfig from 'config/app.config';
import { Logger, formatMasterCode, isDevelopment } from '_helpers';
import useApiService from 'hooks/useApiService';
import { useModelConfig, useSecurityProfile, useSecurity } from 'hooks';
import { EntityType, GridActionType, MenuFlagEnum, ViewType } from 'models';
import { GenericLoadingPanel } from 'components';
import { useTranslation } from 'react-i18next';

const MergeRequestPage = () => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.MergeRequest);
  const { hasPermission } = useSecurityProfile();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<any>();
  const [excludedSources, setExcludedSources] = useState<any[]>([]);
  const [includedSources, setIncludedSources] = useState<any[]>([]);
  const [targetDisciplines, setTargetDisciplines] = useState<any[]>([]);
  const [type, setType] = useState<string>('person');
  const [minMatches, setMinMatches] = useState('0');
  const [mode, setMode] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([dayjs('1840-01-01'), dayjs()]);

  const apiService = useApiService();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['sources'],
    queryFn: () => apiService.fetch('/common/sources'),
  });

  const dataContent = isLoading ? [] : (data ?? []);

  const variables: any = {
    enablePagination: true,
    languageCode: i18n.language.toUpperCase(),
    rows: 300,
    start: 0,
  };

  const { data: dataDisciplines, isLoading: isLoadingDiscipline } = useQuery({
    queryKey: ['SDIS_combo'],
    queryFn: () =>
      apiService.getMasterData(
        `${appConfig.masterDataEndPoint}/v1/entries/byCategoryKey/SDIS`,
        variables
      ),
  });

  const controlData = isLoadingDiscipline ? [] : (dataDisciplines?.content ?? []);
  const deduplicateUrl = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_DEDUPLICATION}`;

  const mutation = useMutation({
    mutationFn: () =>
      apiService.execute(deduplicateUrl, {
        minMatches,
        source: source?.code,
        disciplines: targetDisciplines.map((x: any) => formatMasterCode(x.key)),
        excludedSources: excludedSources.map((x: any) => x.code),
        includedSources: includedSources.map((x: any) => x.code),
        type,
        mode,
        startYear: dateRange[0]?.year(),
        endYear: dateRange[1]?.year(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const mutationCancel = useMutation({
    mutationFn: () => apiService.deleteAny(deduplicateUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const urlApprove = `${appConfig.apiEndPoint}${appConfig.CONSOLIDATION}${appConfig.CONSOLIDATION_MERGE_REQUESTS_APPROVE}`;
  const mutationApprove = useMutation({
    mutationFn: () => apiService.fetch(urlApprove),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${config.entityName}_index`],
      });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.stopPropagation();
    setSource(newValue);
  };

  const handleExcludedChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.stopPropagation();
    setExcludedSources(newValue);
  };

  const handleDisciplinesChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.stopPropagation();
    setTargetDisciplines(newValue);
  };

  const handleIncludedSources = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.stopPropagation();
    setIncludedSources(newValue);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode((event.target as HTMLInputElement).value);
  };

  return (
    <>
      <DataGridPanel
        showHeader={true}
        config={config}
        toolbarType="default"
        toolbar={[
          {
            type: GridActionType.LoadingButton,
            label: t('actions.approvePending'),
            action: () => mutationApprove.mutate(),
            color: 'secondary',
            visible: hasPermission(MenuFlagEnum.Consolidation),
            loading: mutationApprove.isPending,
            disabled: mutationApprove.isPending,
            icon: <CheckCircleOutline />,
          },
          {
            type: GridActionType.LoadingButton,
            label: t('actions.buttonCancel'),
            color: 'secondary',
            action: () => mutationCancel.mutate(),
            visible: hasPermission(MenuFlagEnum.Consolidation),
            loading: mutation.isPending,
            disabled: mutation.isPending,
            icon: <CancelOutlinedIcon />,
          },
          {
            type: GridActionType.LoadingButton,
            label: t('actions.deduplication'),
            action: () => setOpen(true),
            color: 'secondary',
            visible: hasPermission(MenuFlagEnum.Consolidation),
            loading: mutation.isPending,
            disabled: mutation.isPending,
            icon: <AutoFixHighOutlinedIcon />,
          },
        ]}
        flags={useSecurity(config.type, ViewType.Index, false).flags}
        dataSource={{
          url: `${appConfig.apiEndPoint}${config.apiNode}/search`,
          apiVersion: config.apiVersion,
          queryKey: config.entityName,
        }}
      />
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        maxWidth="lg"
        aria-labelledby="fields-auto-map"
      >
        <DialogTitle aria-labelledby="fields-auto-map">{` ${t('actions.deduplication')}: ${t('general.configuration')}`}</DialogTitle>
        <Divider />
        <DialogContent sx={{ width: 'fit-content' }}>
          <Grid container spacing={2} sx={{ px: 2 }}>
            <Grid size={12}>
              <Typography
                component="div"
                dangerouslySetInnerHTML={{ __html: t('message.merge-instructions-1') }}
              />
            </Grid>
            <Grid size={12}>
              <FormControl>
                <RadioGroup
                  row
                  value={type}
                  onChange={handleTypeChange}
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="person"
                    control={<Radio />}
                    label={t('navigation.Persons')}
                  />
                  <FormControlLabel
                    value="personNoDOB"
                    control={<Radio color="error" />}
                    label={t('general.person-no-dob')}
                  />
                  <FormControlLabel
                    value="personMapping"
                    control={<Radio />}
                    label={t('general.biographies')}
                  />
                  <FormControlLabel
                    value="horse"
                    control={<Radio />}
                    label={t('navigation.Horses')}
                  />
                  <FormControlLabel
                    value="team"
                    control={<Radio />}
                    label={t('navigation.Teams')}
                  />
                  <FormControlLabel
                    value="organisation"
                    control={<Radio />}
                    label={t('navigation.Organisations')}
                  />
                  <FormControlLabel
                    value="venue"
                    control={<Radio />}
                    label={t('navigation.Venues')}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid size={8}>
              <Autocomplete
                value={source}
                onChange={handleChange}
                loading={isLoading}
                fullWidth
                options={dataContent}
                getOptionLabel={(option) =>
                  option.title == option.code ? option.code : `${option.title} (${option.code})`
                }
                renderInput={(params) => (
                  <TextField
                    label={t('general.deduplication-source')}
                    {...params}
                    variant="outlined"
                    placeholder={t('messages.select-the-target-source-to-deduplicate')}
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                id="outlined-basic"
                type="number"
                label="Min Matches"
                value={minMatches}
                variant="outlined"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMinMatches(event.target.value);
                }}
              />
            </Grid>
            <Grid size={12}>
              <Autocomplete
                value={targetDisciplines}
                onChange={handleDisciplinesChange}
                loading={isLoadingDiscipline}
                fullWidth
                multiple
                options={controlData}
                getOptionLabel={(option) => `${formatMasterCode(option.key)} - ${option.value}`}
                getOptionKey={(option) => option.key ?? ''}
                renderInput={(params) => (
                  <TextField
                    label={t('general.deduplication-disciplines')}
                    {...params}
                    variant="outlined"
                    placeholder={t('messages.select-the-set-of-disciplines-to-deduplicate')}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Autocomplete
                value={excludedSources}
                onChange={handleExcludedChange}
                loading={isLoading}
                fullWidth
                multiple
                options={dataContent}
                getOptionLabel={(option) =>
                  option.title === option.code ? option.code : `${option.title} (${option.code})`
                }
                renderInput={(params) => (
                  <TextField
                    label={t('general.excluded-sources')}
                    {...params}
                    variant="outlined"
                    placeholder={t('messages.select-the-excluded-sources')}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Autocomplete
                value={includedSources}
                onChange={handleIncludedSources}
                loading={isLoading}
                fullWidth
                multiple
                options={dataContent}
                getOptionLabel={(option) =>
                  option.title === option.code ? option.code : `${option.title} (${option.code})`
                }
                renderInput={(params) => (
                  <TextField
                    label={t('general.included-sources')}
                    {...params}
                    variant="outlined"
                    placeholder={t('messages.select-the-included-sources')}
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <MultiInputDateRangeField
                disableFuture
                minDate={dayjs('1800-01-01')}
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                slotProps={{
                  textField: ({ position }) => ({
                    label: position === 'start' ? 'From Date' : 'To Date',
                  }),
                }}
              />
            </Grid>
            <Grid size={6}>
              <FormControl>
                <RadioGroup
                  row
                  value={mode}
                  onChange={handleModeChange}
                  name="row-mode-buttons-group"
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label={t('messages.all-matching-items')}
                  />
                  <FormControlLabel
                    value="single"
                    control={<Radio />}
                    label={t('messages.just-non-decouple-items')}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Stack direction="row" spacing={1}>
                <InfoOutlinedIcon color="primary" />
                <Typography
                  variant="body2"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: t('messages.merge-dob-instructions') }}
                />
              </Stack>
              {type === 'personNoDOB' && (
                <Stack direction="row" spacing={1} sx={{ marginTop: 0.3 }}>
                  <ReportProblemOutlinedIcon color="error" />
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{ __html: t('messages.merge-warning-no-dob') }}
                  />
                </Stack>
              )}
            </Grid>
          </Grid>
          <GenericLoadingPanel loading={mutation.isPending} />
        </DialogContent>
        <Divider />
        <DialogActions sx={{ paddingBottom: 2, px: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={mutation.isPending}>
            {t('actions.buttonCancel')}
          </Button>
          <Button
            disableElevation
            variant="contained"
            onClick={() => {
              mutation.mutate();
              setOpen(false);
            }}
            disabled={
              mutation.isPending || (!source && targetDisciplines.length == 0) || !minMatches
            }
          >
            {t('actions.deduplication')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MergeRequestPage;
