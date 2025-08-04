import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CardActions,
  CardContent,
  FormControlLabel,
  LinearProgress,
  Switch,
  TextField,
  useTheme,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import WorkspacePremiumTwoToneIcon from '@mui/icons-material/WorkspacePremiumTwoTone';
import LanguageTwoToneIcon from '@mui/icons-material/LanguageTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import DirectionsRunTwoToneIcon from '@mui/icons-material/DirectionsRunTwoTone';
import Groups2TwoToneIcon from '@mui/icons-material/Groups2TwoTone';
import SportsKabaddiTwoToneIcon from '@mui/icons-material/SportsKabaddiTwoTone';
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';
import MilitaryTechTwoToneIcon from '@mui/icons-material/MilitaryTechTwoTone';
import ContentPasteTwoToneIcon from '@mui/icons-material/ContentPasteTwoTone';
import SupervisedUserCircleTwoToneIcon from '@mui/icons-material/SupervisedUserCircleTwoTone';
import { ElementType, useState } from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import uniqBy from 'lodash/uniqBy';
import { MainCard } from 'components';
import appConfig, { apiConfig } from 'config/app.config';
import { Logger, concatenateArray, isDevelopment } from '_helpers';
import useApiService from 'hooks/useApiService';
import { AppDispatch, notificationActions } from 'store';
import type { IReportError, ReportParam } from 'types/tools';

type Props = {
  data: any;
  season: 'summer' | 'winter';
};

export const ReportControl = (props: Props) => {
  const theme = useTheme();
  const apiService = useApiService();
  const url = `${appConfig.gdsReportEndpoint}/config?key=${props.data.next.key}`;

  const { data, isLoading } = useQuery({
    queryKey: [`report_config_${props.data.next.key}`],
    queryFn: () => apiService.fetch(url),
  });

  const [value, setValue] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<IReportError[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const dataItem = props.data;

  const mutationGenerate = useMutation({
    mutationFn: async (param: ReportParam) =>
      apiService.post(
        `${apiConfig.reportEndPoint}/${param.code}Generator?discipline=${param.discipline}`
      ),
    onError: (error: any, variables: any) => {
      const newError: IReportError = {
        ...variables,
        error: error.response?.data,
      };
      setErrors([...errors, newError]);
      return error;
    },
  });

  const mutationGenerateBulk = useMutation({
    mutationFn: async (param: ReportParam) =>
      apiService.post(`${apiConfig.reportEndPoint}/${param.code}Generator/bulk`),
    onError: (error: any, variables: any) => {
      const newError: IReportError = {
        ...variables,
        error: error.response?.data,
      };
      setErrors([...errors, newError]);
      return error;
    },
  });

  const options = isLoading
    ? []
    : uniqBy(data?.options, 'key').map((option: any) => {
        const firstLetter = option.title[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
      });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const getIcon = (): ElementType => {
    switch (dataItem.key.substr(0, 3)) {
      case 'N10':
        return EventNoteTwoToneIcon;
      case 'N11':
        return WorkspacePremiumTwoToneIcon;
      case 'N13':
        return LanguageTwoToneIcon;
      case 'N17':
      case 'N15':
        return EmojiEventsTwoToneIcon;
      case 'N18':
        return MilitaryTechTwoToneIcon;
      case 'N20':
        return DirectionsRunTwoToneIcon;
      case 'N22':
        return Groups2TwoToneIcon;
      case 'N62':
        return SportsKabaddiTwoToneIcon;
      case 'N23':
        return SupervisedUserCircleTwoToneIcon;
      case 'N24':
        return BusinessTwoToneIcon;
      default:
        return ContentPasteTwoToneIcon;
    }
  };

  const canGenerate = (): boolean => {
    if (checked) return true;

    return value && value.length > 0;
  };

  const initializeParameters = () => {
    return checked
      ? data.options.map((e: any) => ({
          code: dataItem.key.substr(0, 3),
          discipline: e.key.split(':')[1],
        }))
      : value.map((e: any) => ({
          code: dataItem.key.substr(0, 3),
          discipline: e.key.split(':')[1],
        }));
  };

  const handleDevelopmentErrors = () => {
    if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
  };

  const executeMutations = async () => {
    if (!canGenerate()) return;

    if (checked) {
      try {
        const parameter: ReportParam = { code: dataItem.key.substr(0, 3), discipline: '' };
        await mutationGenerateBulk.mutateAsync(parameter);
      } catch {
        handleDevelopmentErrors();
      }
    } else {
      const parameters: Array<ReportParam> = initializeParameters();

      const increment = Math.round(100 / parameters.length);
      setProgress(0);
      setErrors([]);
      for (const param of parameters) {
        try {
          await mutationGenerate.mutateAsync(param);
        } catch {
          handleDevelopmentErrors();
        }
        setProgress((prevProgress) => Math.min(prevProgress + increment, 100));
      }

      const errorStatus = errors.length == parameters.length ? 'Error' : 'Warning';
      const status = errors.length == 0 ? 'Success' : errorStatus;
      setValue([]);
      dispatch(
        notificationActions.addNotification({
          title: `${dataItem.key} data generation for ${parameters.length} disciplines has been queued with '${status}'`,
          message: `${concatenateArray(parameters.map((e: any) => e.discipline))}`,
          type: 1,
          id: `${dataItem.key}${parameters.length}${dayjs().format()}`,
          status: 5,
          progress: 0,
          dateOccurred: dayjs().format(),
        })
      );
    }
  };

  const Icon = getIcon();
  return (
    <Grid size={{ lg: 4, md: 4, sm: 6, xs: 12 }} key={dataItem.title}>
      <MainCard
        content={false}
        boxShadow={true}
        border={true}
        title={dataItem.key}
        subtitle={dataItem.title}
        divider={true}
        headerSX={{ backgroundColor: 'rgb(248, 250, 252)', py: 1 }}
        avatar={
          <Avatar
            sx={{
              ...theme.typography.mediumAvatar,
              color: theme.palette.grey[100],
              bgcolor: theme.palette.primary.main,
            }}
          >
            <Icon />
          </Avatar>
        }
        sx={{ borderRadius: '8px' }}
      >
        <CardContent sx={{ paddingBottom: '0!important' }}>
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label="Select All Disciplines"
          />
          <Autocomplete
            multiple
            disableCloseOnSelect
            freeSolo={false}
            options={options.toSorted(
              (a: any, b: any) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            value={value}
            disabled={checked}
            onChange={(_event: any, newValue: any[]) => setValue(newValue)}
            limitTags={2}
            size="small"
            sx={{ width: '100%' }}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title ?? ''}
            getOptionKey={(option) => option.key ?? ''}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('general.disciplines')}
                placeholder="Select a discipline"
              />
            )}
          />
          {mutationGenerate.isPending && (
            <Box sx={{ width: '100%', marginTop: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}
        </CardContent>
        <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            disableElevation
            variant="outlined"
            startIcon={<PlayCircleFilledWhiteOutlinedIcon />}
            disabled={!canGenerate() || mutationGenerate.isPending}
            loading={mutationGenerate.isPending}
            loadingPosition="start"
            onClick={executeMutations}
          >
            {t('actions.buttonGenerate')}
          </Button>
        </CardActions>
      </MainCard>
    </Grid>
  );
};
