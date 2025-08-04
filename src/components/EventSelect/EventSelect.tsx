import { Autocomplete, InputAdornment, Stack, TextField, useTheme } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { t } from 'i18next';
import { ToolbarViewControl } from 'components';
import useAppRoutes from 'hooks/useAppRoutes';
import { useNavigate } from 'react-router-dom';
import { ActionType, EntityType, MasterData } from 'models';
import { geCountryRegionDisplay, isNullOrEmpty } from '_helpers';
import { useStoreCache } from 'hooks';
import { IToolbarPanelProps } from 'types/views';
import appConfig from 'config/app.config';
import { useState } from 'react';
import useApiService from 'hooks/useApiService';
import orderBy from 'lodash/orderBy';
import saveAs from 'file-saver';
import dayjs from 'dayjs';
import baseConfig from 'baseConfig';
import { olympicsDesignColors } from 'themes/colors';

interface Props {
  events: any[];
  selectedEvent?: any;
  onSelect: (discipline: any) => void;
}

export const EventSelect: React.FC<Props> = ({ events, selectedEvent, onSelect }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getMasterDataValue } = useStoreCache();
  const { getDetailRoute } = useAppRoutes();
  const apiService = useApiService();

  const [loading, setLoading] = useState<boolean>(false);
  const handlePreview = async (id: string) => {
    setLoading(true);

    const response = await apiService.fetch(
      `${appConfig.apiEndPoint}${appConfig.EVENT_BREAKDOWN.replace('{0}', id)}`
    );
    const jsonContent = JSON.stringify(response, null, 2);

    setLoading(false);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newTabs = window.open(url, '_blank');

    URL.revokeObjectURL(url);
    if (newTabs === null) {
      alert(t('message.popup-blocked'));
    }
  };

  const handleDownload = async (id: string) => {
    setLoading(true);

    const response = await apiService.fetch(
      `${appConfig.apiEndPoint}${appConfig.EVENT_BREAKDOWN.replace('{0}', id)}`
    );
    const jsonContent = JSON.stringify(response, null, 2);

    setLoading(false);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    saveAs(blob, `${id}.json`);
  };
  const toolBar: IToolbarPanelProps<any>[] = [
    {
      type: ActionType.Download,
      title: t('actions.buttonDownload'),
      handleClick: () => void handleDownload(selectedEvent?.id),
      condition: () => !isNullOrEmpty(selectedEvent),
    },
    {
      type: ActionType.Preview,
      title: t('actions.buttonPreview'),
      handleClick: () => void handlePreview(selectedEvent?.id),
      condition: () => !isNullOrEmpty(selectedEvent),
    },
    {
      type: ActionType.Detail,
      title: t('actions.buttonNavigate'),
      handleClick: () => {
        navigate(getDetailRoute(EntityType.Event, selectedEvent?.id));
      },
      condition: () => !isNullOrEmpty(selectedEvent),
    },
  ];

  const getEventDetail = (option: any) => {
    if (!option) return '';

    let display = option?.title ?? '';
    const location = geCountryRegionDisplay(option);

    if (option.gender) {
      const gender = getMasterDataValue(option?.gender, MasterData.SportGender)?.value;
      if (!display.includes(gender)) display = `${display} | ${gender}`;
    }

    if (option.type?.startsWith('ETP-')) {
      const type = getMasterDataValue(option.type, MasterData.EventType)?.value;
      if (!display.includes(type) && !display.includes(type.replace(',', '')))
        display = `${display} (${type})`;
    }

    if (option.type) {
      const type = getMasterDataValue(option.type, MasterData.EventType)?.value;
      if (!display.includes(type) && !display.includes(type.replace(',', '')))
        display = `${display} (${type})`;
    }

    if (option.startDate) {
      display = `${display} | ${dayjs(option.startDate).format(baseConfig.dayDateFormat).toUpperCase()}`;
    }

    if (location) {
      display = `${display} | ${option.region}`;
    }

    return display;
  };
  return (
    <Stack direction={'row'} spacing={2} alignItems={'center'} width="100%">
      <Autocomplete
        fullWidth
        disableClearable
        options={orderBy(events, 'title')}
        value={selectedEvent}
        autoHighlight
        loading={loading}
        size="small"
        aria-label={t('general.events')}
        onChange={(_e, value) => onSelect(value)}
        getOptionLabel={(option) => getEventDetail(option)}
        getOptionKey={(option) => option.id ?? ''}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={[
          (theme) => ({ backgroundColor: theme.palette.background.paper }),
          (theme) =>
            theme.applyStyles('dark', {
              backgroundColor: olympicsDesignColors.dark.general.background,
            }),
        ]}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              label={t('general.event')}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: theme.typography.body1.fontSize,
                  fontFamily: theme.typography.body1.fontFamily,
                },
              }}
              placeholder={t('actions.select-event')}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthOutlinedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          );
        }}
      />
      <ToolbarViewControl tools={toolBar} dataItem={selectedEvent ?? {}} />
    </Stack>
  );
};
