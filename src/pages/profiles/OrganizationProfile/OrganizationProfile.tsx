import Grid from '@mui/material/Grid';
import {
  Box,
  Divider,
  List,
  Stack,
  Typography,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import get from 'lodash/get';
import type { IToolbarPanelProps } from 'types/views';
import { OlympicColors } from 'themes/colors';
import { MedalKpiControl } from 'pages/explorer/components';
import { useState } from 'react';
import { t } from 'i18next';
import { useModelConfig, useSecurity, useStoreCache } from 'hooks';
import useConsolidation from 'hooks/useConsolidation';
import { ActionType, EditionMode, EntityType, MasterData, TemplateType, ViewType } from 'models';
import { AvatarHeader, FieldTemplate, MainCard, ToolbarViewControl } from 'components';
import { ViewProfile as OrganizationViewProfile } from './components';
import { MergeRequestCard } from 'pages/tools/consolidation/components';
import {
  EditProfile,
  MergeProfile,
  ProfileItemText,
  ProfileItemElement,
  ValidateProfile,
} from '../components';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

type Props = {
  data: any;
  setup: any;
  type: EntityType;
};

export const OrganizationProfile = (props: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const theme = useTheme();
  const { mode } = useColorScheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[props.type]?.open);

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100];

  const { canUpdate } = useSecurity(config.type, ViewType.View, false);
  const { getMasterDataValue } = useStoreCache();
  const data = props.data;

  const { hasMerge } = useConsolidation();
  const canMerge = (): boolean => hasMerge(config.type) && canUpdate;

  const [editionMode, setEditionMode] = useState(EditionMode.Detail);

  const handleOnClickEdit = () => setEditionMode(EditionMode.Update);
  const handleOnClickMerge = () => setEditionMode(EditionMode.Merge);
  const handleOnClickValidate = () => setEditionMode(EditionMode.Validate);

  const toolBar: IToolbarPanelProps<any>[] = [
    {
      type: ActionType.Edit,
      title: t('actions.buttonEdit'),
      handleClick: handleOnClickEdit,
      condition: () => canUpdate && editionMode == EditionMode.Detail,
    },
    {
      type: ActionType.Merge,
      title: t('actions.buttonMerge'),
      handleClick: handleOnClickMerge,
      condition: () => canMerge() && editionMode == EditionMode.Detail,
    },
    {
      type: ActionType.Validate,
      title: t('actions.buttonValidate'),
      handleClick: handleOnClickValidate,
      condition: () => canMerge() && editionMode == EditionMode.Detail,
    },
  ];

  const hasNoc = get(props.data, 'noc') !== null && get(props.data, 'noc') !== undefined;
  const disciplines =
    props.data.disciplines && props.data.disciplines.length > 0
      ? props.data.disciplines
      : get(data, 'sportDisciplineId')
        ? [{ code: get(data, 'sportDisciplineId') }]
        : [];

  return (
    <Grid container spacing={2}>
      {isOpen && (
        <Grid size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 3 } : 0}>
          <MainCard content={false} sx={{ pb: 4 }}>
            <Stack
              spacing={1}
              sx={{
                p: 1,
                background: `radial-gradient(circle at top left, ${OlympicColors.GREEN} 40%, ${color}  10%)`,
              }}
              alignItems="center"
            >
              {editionMode === EditionMode.Detail && (
                <Box display="flex" justifyContent="space-between" sx={{ width: '100%' }}>
                  <ToolbarViewControl tools={toolBar} dataItem={data?.data ?? {}} />
                </Box>
              )}
              <Stack
                alignItems="center"
                direction={matchDownSM ? 'row' : 'column'}
                spacing={matchDownSM ? 1 : 3}
              >
                <AvatarHeader element={props.data} config={config} />
                <Stack alignItems={'center'}>
                  <Typography variant="h5" textAlign="center" lineHeight={1}>
                    {props.data[config.displayAccessor]}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    {getMasterDataValue(get(data, 'type'), MasterData.OrganisationType)?.value}
                  </Typography>
                  {disciplines.length <= 5 && (
                    <FieldTemplate
                      type={TemplateType.ListDiscipline}
                      value={disciplines}
                      withText={false}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
            <Divider variant="fullWidth" />
            <List>
              <ProfileItemText
                value={t('general.sport')}
                title={getMasterDataValue(get(data, 'sportId'), MasterData.Sport)?.value}
              />
              <ProfileItemText
                value={t('general.discipline')}
                title={
                  getMasterDataValue(
                    get(data, 'sportDisciplineId') ?? props.data.disciplines,
                    MasterData.Discipline
                  )?.value
                }
              />
              <ProfileItemText value={t('general.region')} title={get(data, 'region')} />
              <ProfileItemText
                value={t('general.country')}
                title={getMasterDataValue(get(data, 'country'), MasterData.Country)?.value}
              />
              <ProfileItemText value={t('common.code')} title={get(data, 'code')} />
              <ProfileItemText value={t('general.founded')} title={get(data, 'founded')} />
              {get(data, 'website') && (
                <ProfileItemElement
                  value={t('general.website')}
                  element={
                    <FieldTemplate
                      type={TemplateType.Url}
                      value={get(data, 'website')}
                      withText={false}
                    />
                  }
                />
              )}
              {hasNoc && (
                <>
                  <ProfileItemText
                    value={t('noc.long-name')}
                    title={get(data, 'noc.longName')}
                    lengthControl={true}
                  />
                  <ProfileItemText
                    value={t('noc.short-name')}
                    title={get(data, 'noc.shortName')}
                    lengthControl={true}
                  />
                  <ProfileItemText
                    value={t('general.founded')}
                    title={get(data, 'noc.nocFoundedDate')}
                  />
                  <ProfileItemText
                    value={t('general.ioc-recognition-year')}
                    title={get(data, 'noc.iocRecognitionYear')}
                  />
                  <ProfileItemText
                    value={t('general.president')}
                    title={get(data, 'noc.president')}
                  />
                  <ProfileItemText
                    value={t('general.general-secretary')}
                    title={get(data, 'noc.generalSecretary')}
                  />
                  <ProfileItemText
                    value={t('noc.country-info')}
                    title={get(data, 'noc.countryInfo')}
                  />
                  <ProfileItemText value={t('noc.continent')} title={get(data, 'noc.continent')} />
                  <ProfileItemText
                    value={t('noc.games-appearance')}
                    title={get(data, 'noc.gamesFirstAppearance')}
                  />
                  <ProfileItemText
                    value={t('noc.appearance-number')}
                    title={get(data, 'noc.gamesAppearanceNumber')}
                  />
                  {get(data, 'noc.website') && (
                    <ProfileItemElement
                      value={t('general.website')}
                      element={
                        <FieldTemplate
                          type={TemplateType.Url}
                          value={get(data, 'noc.website')}
                          withText={false}
                        />
                      }
                    />
                  )}
                  <ProfileItemText
                    value={t('noc.anthem-title')}
                    title={get(data, 'noc.anthemTitle')}
                    lengthControl={true}
                  />
                  <ProfileItemText
                    value={t('noc.anthem-inducted')}
                    title={get(data, 'noc.anthemInducted')}
                  />
                  <ProfileItemElement
                    value={t('noc.historical')}
                    element={
                      <FieldTemplate
                        type={TemplateType.Boolean}
                        value={get(data, 'noc.historical')}
                        withText={false}
                      />
                    }
                  />
                </>
              )}
            </List>
            <MedalKpiControl
              data={props.data}
              parameter={{ type: EntityType.Organization, id: props.data.id, display: 'id' }}
            />
            <Divider variant="fullWidth" />
            <List dense={true}>
              <FieldTemplate
                type={TemplateType.ExternalIds}
                value={get(data, 'externalIds')}
                withText={false}
                icon={ContactsOutlinedIcon}
              />
            </List>
            <>
              {props.setup?.request && (
                <>
                  <Divider variant="fullWidth" />
                  <Box sx={{ p: 1 }}>
                    <MergeRequestCard data={props.setup?.request} />
                  </Box>
                </>
              )}
            </>
          </MainCard>
        </Grid>
      )}
      <Grid container spacing={2} size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 9 } : 12}>
        <OrganizationViewProfile {...props} editionMode={editionMode} />
        <MergeProfile
          config={config}
          {...props}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <EditProfile
          {...props}
          config={config}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <ValidateProfile
          {...props}
          config={config}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
      </Grid>
    </Grid>
  );
};
