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
import Grid from '@mui/material/Grid';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import get from 'lodash/get';
import { useState } from 'react';
import { t } from 'i18next';
import { useModelConfig, useSecurity, useStoreCache } from 'hooks';
import { ActionType, EditionMode, EntityType, MasterData, TemplateType, ViewType } from 'models';
import { AvatarHeader, FieldTemplate, MainCard, ToolbarViewControl } from 'components';
import type { IToolbarPanelProps } from 'types/views';
import { OlympicColors } from 'themes/colors';
import { MedalKpiControl } from 'pages/explorer/components';
import { MergeRequestCard } from 'pages/tools/consolidation/components';
import useConsolidation from 'hooks/useConsolidation';
import { EditProfile as TeamEditProfile, ViewProfile as TeamViewProfile } from './components';
import { BiographyProfile, BioStatusControl } from 'pages/biographies-manager/components';

import {
  EditProfile,
  BiographySocialMediaBlock,
  MergeProfile,
  ProfileItemText,
  ProfileItemCountry,
  ValidateProfile,
} from '../components';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

type Props = {
  data: any;
  setup: any;
  type: EntityType;
};

export const TeamProfile = ({ data, type, setup }: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(type);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { mode } = useColorScheme();

  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[type]?.open);

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300];

  const { getMasterDataValue } = useStoreCache();
  const { canUpdate } = useSecurity(config.type, ViewType.View, false);
  const { hasMerge, couldMerge } = useConsolidation();
  const canMerge = (): boolean => hasMerge(config.type) && canUpdate && type == EntityType.Team;

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
                  <BioStatusControl type={type} dataItem={data ?? {}} />
                  <ToolbarViewControl tools={toolBar} dataItem={data?.data ?? {}} />
                </Box>
              )}
              <Stack alignItems="center" direction={matchDownSM ? 'row' : 'column'} spacing={1}>
                <AvatarHeader element={data} config={config} />
                <Stack alignItems="center">
                  <Typography variant="h5" textAlign="center" lineHeight={1.1}>
                    {data.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <FieldTemplate
                      type={TemplateType.ListDiscipline}
                      value={data.disciplines}
                      withText={false}
                    />
                    <ProfileItemCountry data={data} />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Divider variant="fullWidth" />
            <List>
              <ProfileItemText
                value={t('general.nickname')}
                title={get(data, 'nickname')}
                lengthControl={true}
              />
              <ProfileItemText value={t('noc.short-name')} title={get(data, 'shortName')} />
              <ProfileItemText value={t('general.city')} title={get(data, 'city')} />
              <ProfileItemText
                value={t('common.gender')}
                title={getMasterDataValue(get(data, 'gender'), MasterData.PersonGender)?.value}
              />
              <ProfileItemText
                value={t('common.nationality')}
                title={getMasterDataValue(get(data, 'nationality'), MasterData.Country)?.value}
              />
              <ProfileItemText
                value={t('common.type')}
                title={getMasterDataValue(get(data, 'type'), MasterData.TeamType)?.value}
              />
              <ProfileItemText
                value={t('general.event-type')}
                title={getMasterDataValue(get(data, 'eventType'), MasterData.EventType)?.value}
              />
              <BiographySocialMediaBlock data={data} />
            </List>
            <MedalKpiControl
              data={data}
              parameter={{ type: EntityType.Team, id: data.id, display: 'id' }}
            />
            <BiographyProfile data={data} type={type} />
            <Divider variant="fullWidth" />
            <List dense={true}>
              <FieldTemplate
                type={TemplateType.ExternalIds}
                value={get(data, 'externalIds')}
                withText={false}
                icon={ContactsOutlinedIcon}
              />
            </List>
            {couldMerge(type) && setup?.request && (
              <>
                <Divider variant="fullWidth" />
                <Box sx={{ p: 1 }}>
                  <MergeRequestCard data={setup?.request} />
                </Box>
              </>
            )}
          </MainCard>
        </Grid>
      )}
      <Grid container spacing={2} size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 9 } : 12}>
        <TeamViewProfile data={data} setup={setup} type={type} editionMode={editionMode} />
        <TeamEditProfile
          data={data}
          setup={setup}
          type={type}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <MergeProfile
          config={config}
          data={data}
          setup={setup}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <EditProfile
          config={config}
          data={data}
          setup={setup}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <ValidateProfile
          data={data}
          setup={setup}
          config={config}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
      </Grid>
    </Grid>
  );
};
