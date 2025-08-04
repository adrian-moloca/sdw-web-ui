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
import { useState } from 'react';
import { t } from 'i18next';
import { useModelConfig, useSecurity } from 'hooks';
import { ActionType, EditionMode, EntityType, TemplateType, ViewType } from 'models';
import { AvatarHeader, FieldTemplate, MainCard, ToolbarViewControl } from 'components';
import type { IToolbarPanelProps } from 'types/views';
import { OlympicColors } from 'themes/colors';
import { MedalKpiControl } from 'pages/explorer/components';
import { ViewProfile as NocViewProfile, EditProfile as NocEditProfile } from './components';
import { BiographyProfile, BioStatusControl } from 'pages/biographies-manager/components';
import { ProfileButtons, EditProfile, ProfileItemText, ProfileItemElement } from '../components';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

type Props = {
  data: any;
  setup: any;
  type: EntityType;
};

export const NocProfile = (props: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { mode } = useColorScheme();

  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[props.type]?.open);

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100];

  const { canUpdate } = useSecurity(config.type, ViewType.View, false);

  const data = props.data;

  const [editionMode, setEditionMode] = useState(EditionMode.Detail);
  const handleOnClickEdit = () => setEditionMode(EditionMode.Update);

  const toolBar: IToolbarPanelProps<any>[] = [
    {
      type: ActionType.Edit,
      title: t('actions.buttonEdit'),
      handleClick: handleOnClickEdit,
      condition: () => canUpdate && editionMode == EditionMode.Detail,
    },
  ];

  return (
    <Grid container spacing={2}>
      {isOpen && (
        <Grid size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 4 } : 0}>
          <MainCard content={false}>
            <Stack
              spacing={1}
              sx={{
                p: 1,
                background: `radial-gradient(circle at top left, ${OlympicColors.YELLOW} 40%, ${color}  10%)`,
              }}
              alignItems="center"
            >
              {editionMode === EditionMode.Detail && (
                <Box display="flex" justifyContent="space-between" sx={{ width: '100%' }}>
                  <BioStatusControl type={props.type} dataItem={props.data ?? {}} />
                  <ToolbarViewControl tools={toolBar} dataItem={data?.data ?? {}} />
                </Box>
              )}
              <Stack
                alignItems="center"
                direction={matchDownSM ? 'row' : 'column'}
                spacing={matchDownSM ? 1 : 3}
              >
                <AvatarHeader element={props.data} config={config} />
                <Stack alignItems="center">
                  <Typography variant="h5" textAlign="center" lineHeight={1}>
                    {props.data[config.displayAccessor]}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    {get(data, 'officialName')}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Divider variant="fullWidth" />
            <List>
              <ProfileItemText
                value={t('noc.long-name')}
                title={get(data, 'longName')}
                lengthControl={true}
              />
              <ProfileItemText
                value={t('noc.short-name')}
                title={get(data, 'shortName')}
                lengthControl={true}
              />
              <ProfileItemText value={t('general.founded')} title={get(data, 'nocFoundedDate')} />
              <ProfileItemText
                value={t('general.ioc-recognition-year')}
                title={get(data, 'iocRecognitionYear')}
              />
              <ProfileItemText value={t('general.president')} title={get(data, 'president')} />
              <ProfileItemText
                value={t('general.general-secretary')}
                title={get(data, 'generalSecretary')}
              />
              <ProfileItemText value={t('noc.country-info')} title={get(data, 'countryInfo')} />
              <ProfileItemText value={t('noc.continent')} title={get(data, 'continent')} />
              <ProfileItemText
                value={t('noc.games-appearance')}
                title={get(data, 'gamesFirstAppearance')}
              />
              <ProfileItemText
                value={t('noc.appearance-number')}
                title={get(data, 'gamesAppearanceNumber')}
              />
              {get(data, 'website') && (
                <ProfileItemElement
                  value={t('noc.website')}
                  element={
                    <FieldTemplate
                      type={TemplateType.Url}
                      value={get(data, 'website')}
                      withText={false}
                    />
                  }
                />
              )}
              <ProfileItemText
                value={t('noc.anthem-title')}
                title={get(data, 'anthemTitle')}
                lengthControl={true}
              />
              <ProfileItemText
                value={t('noc.anthem-inducted')}
                title={get(data, 'anthemInducted')}
              />
              <ProfileItemElement
                value={t('noc.historical')}
                element={
                  <FieldTemplate
                    type={TemplateType.Boolean}
                    value={get(data, 'historical')}
                    withText={false}
                  />
                }
              />
            </List>
            <MedalKpiControl
              data={props.data}
              parameter={{ type: EntityType.Organization, id: props.data.id, display: 'id' }}
            />
            <BiographyProfile data={data} type={props.type} />
            <Divider variant="fullWidth" />
            {get(data, 'externalIds') && (
              <List>
                <ProfileItemElement
                  element={
                    <FieldTemplate
                      type={TemplateType.ExternalIds}
                      value={get(data, 'externalIds')}
                      withText={false}
                      icon={ContactsOutlinedIcon}
                    />
                  }
                />
              </List>
            )}
            <>
              {canUpdate && editionMode == EditionMode.Detail && (
                <ProfileButtons
                  canEdit={canUpdate}
                  canMerge={false}
                  hasMerge={false}
                  handleOnClickEdit={handleOnClickEdit}
                />
              )}
            </>
          </MainCard>
        </Grid>
      )}
      <Grid container spacing={2} size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 8 } : 12}>
        <NocViewProfile {...props} editionMode={editionMode} />
        <NocEditProfile
          {...props}
          editionMode={editionMode}
          type={props.type}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <EditProfile
          {...props}
          config={config}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
      </Grid>
    </Grid>
  );
};
