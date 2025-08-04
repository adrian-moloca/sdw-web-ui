import { useState } from 'react';
import { Autocomplete, TextField, Alert, Typography, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import { GenericLoadingPanel, ToolbarViewControl } from 'components';
import type { IPanelTabProps, IToolbarPanelProps } from 'types/views';
import { ActionType, EntityType, MasterData, MenuFlagEnum } from 'models';
import useApiService from 'hooks/useApiService';
import { geCountryRegionDisplay, isNullOrEmpty } from '_helpers';
import appConfig from 'config/app.config';
import { HideShowDialog } from 'pages/tools/consolidation/components';
import { DisciplineEventDetails } from '../components';
import { useStoreCache, useModelConfig, useSecurityProfile } from 'hooks';
import useAppRoutes from 'hooks/useAppRoutes';
import saveAs from 'file-saver';

export const DisciplineEventsResultsTab = (props: IPanelTabProps) => {
  const navigate = useNavigate();
  const { getDetailRoute } = useAppRoutes();
  const { getMasterDataValue } = useStoreCache();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Event);
  const { hasPermission } = useSecurityProfile();
  const apiService = useApiService();

  const [loading, setLoading] = useState<boolean>(false);
  const [openHide, setOpenHide] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(
    props.data?.events ? props.data.events[0] : undefined
  );

  const handleOnClickHide = () => setOpenHide(true);
  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setCurrentEvent(newValue);
  };

  const getEventDetail = (option: any) => {
    if (!option) return '';

    let display = option?.title ?? '';
    const location = geCountryRegionDisplay(option);

    if (option.gender) {
      const gender = getMasterDataValue(option?.gender, MasterData.SportGender)?.value;
      display = `${display} | ${gender}`;
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
      display = `${display} | ${option.startDate}`;
    }

    if (location) {
      display = `${display} | ${option.region}`;
    }

    return display;
  };

  const toolBar: IToolbarPanelProps<any>[] = [
    {
      type: ActionType.Download,
      title: t('actions.buttonDownload'),
      handleClick: () => handleDownload(currentEvent?.id),
      condition: () => !isNullOrEmpty(currentEvent),
    },
    {
      type: ActionType.Preview,
      title: t('actions.buttonPreview'),
      handleClick: () => handlePreview(currentEvent?.id),
      condition: () => !isNullOrEmpty(currentEvent),
    },
    {
      type: ActionType.HideFields,
      title: t('actions.buttonHideShowEntity'),
      handleClick: handleOnClickHide,
      condition: () => hasPermission(MenuFlagEnum.Consolidation) && !isNullOrEmpty(currentEvent),
    },
    {
      type: ActionType.Detail,
      title: t('actions.buttonNavigate'),
      handleClick: () => navigate(getDetailRoute(EntityType.Event, currentEvent?.id)),
      condition: () => !isNullOrEmpty(currentEvent),
    },
  ];

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

  if (!props.data?.events || props.data?.events?.length === 0) {
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', props.data.title)}
      </Alert>
    );
  }

  if (props.data.events.length === 1) {
    return (
      <Grid container spacing={1}>
        <Grid size={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ pl: 1 }}
              spacing={1}
            >
              <EventAvailableOutlined />
              <Typography variant="h6">{getEventDetail(props.data.events[0])}</Typography>
            </Stack>
            <ToolbarViewControl tools={toolBar} dataItem={props.data ?? {}} />
          </Stack>
          <GenericLoadingPanel loading={loading} />
        </Grid>
        <Grid size={12}>
          <DisciplineEventDetails data={props.data.events[0]} discipline={props.data} />
        </Grid>
        <HideShowDialog
          dataItem={currentEvent}
          config={config}
          onClickOk={() => setOpenHide(false)}
          onClickCancel={() => setOpenHide(false)}
          visible={openHide && !isNullOrEmpty(currentEvent)}
          operation="HIDE"
        />
      </Grid>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Autocomplete
            value={currentEvent ?? props.data.events[0]}
            onChange={handleChange}
            onInputChange={(event, value) => event && handleChange(event, value)}
            fullWidth
            options={props.data.events ?? []}
            autoHighlight
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => {
              return getEventDetail(option);
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                label={t('actions.select-event')}
                sx={{ fontSize: '1.2rem' }}
              />
            )}
          />
          <ToolbarViewControl tools={toolBar} dataItem={props.data ?? {}} />
        </Stack>
        <GenericLoadingPanel loading={loading} />
      </Grid>
      {currentEvent && (
        <Grid size={12}>
          <DisciplineEventDetails data={currentEvent} discipline={props.data} />
        </Grid>
      )}
      <HideShowDialog
        dataItem={currentEvent}
        config={config}
        onClickOk={() => setOpenHide(false)}
        onClickCancel={() => setOpenHide(false)}
        visible={openHide && !isNullOrEmpty(currentEvent)}
        operation="HIDE"
      />
    </Grid>
  );
};
