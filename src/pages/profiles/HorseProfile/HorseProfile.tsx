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
import { useModelConfig, useSecurity, useStoreCache } from 'hooks';
import { ActionType, EditionMode, EntityType, MasterData, TemplateType, ViewType } from 'models';
import { AvatarHeader, FieldTemplate, MainCard, ToolbarViewControl } from 'components';
import type { IToolbarPanelProps } from 'types/views';
import { OlympicColors } from 'themes/colors';
import { MedalKpiControl } from 'pages/explorer/components';
import { MergeRequestCard } from 'pages/tools/consolidation/components';
import { BiographyProfile, BioStatusControl } from 'pages/biographies-manager/components';
import useConsolidation from 'hooks/useConsolidation';
import { ViewProfile as HorseViewProfile, EditProfile as HorseEditProfile } from './components';
import {
  EditProfile,
  MergeProfile,
  BiographySocialMediaBlock,
  ProfileItemText,
  ProfileItemCountry,
  ValidateProfile,
} from '../components';
import { getWithExtended } from '../utils/getters';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

type Props = {
  data: any;
  setup: any;
  type: EntityType;
};

export const HorseProfile = (props: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { mode } = useColorScheme();

  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[props.type]?.open);

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100];

  const { getMasterDataValue } = useStoreCache();
  const { canUpdate } = useSecurity(config.type, ViewType.View, false);

  const data = props.data;

  const { hasMerge, couldMerge } = useConsolidation();
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

  return (
    <Grid container spacing={2}>
      {isOpen && (
        <Grid size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 3 } : 0}>
          <MainCard content={false} sx={{ pb: 4 }}>
            <Stack
              spacing={1}
              sx={{
                p: 1,
                background: `radial-gradient(circle at top left, ${OlympicColors.BLUE} 40%, ${color}  10%)`,
              }}
              alignItems="center"
            >
              {editionMode === EditionMode.Detail && (
                <Box display="flex" justifyContent="space-between" sx={{ width: '100%' }}>
                  <BioStatusControl type={props.type} dataItem={props.data ?? {}} />
                  <ToolbarViewControl tools={toolBar} dataItem={data?.data ?? {}} />
                </Box>
              )}
              <Stack alignItems="center" direction={matchDownSM ? 'row' : 'column'} spacing={1}>
                <AvatarHeader element={props.data} config={config} />
                <Stack alignItems="center">
                  <Typography variant="h5" textAlign="center" lineHeight={1.1}>
                    {props.data.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <FieldTemplate
                      type={TemplateType.ListDiscipline}
                      value={props.data.disciplines}
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
                value={t('general.nick')}
                title={getWithExtended(data, 'nickname')}
                lengthControl={true}
              />
              <ProfileItemText
                value={t('horse.year-of-birth')}
                title={getWithExtended(data, 'yearOfBirth')}
              />
              <ProfileItemText
                value={t('horse.passport')}
                title={getWithExtended(data, 'passport')}
              />
              <ProfileItemText
                value={t('horse.sex')}
                title={
                  getMasterDataValue(getWithExtended(data, 'sex') ?? '', MasterData.HorseGender)
                    ?.value
                }
              />
              <ProfileItemText
                value={t('common.nationality')}
                title={getMasterDataValue(get(data, 'nationality'), MasterData.Country)?.value}
              />
              <ProfileItemText
                value={t('horse.colour')}
                title={getMasterDataValue(get(data, 'colour'), MasterData.HorseColor)?.value}
              />
              <ProfileItemText
                value={t('general.height')}
                title={getWithExtended(data, 'height')}
              />
              <ProfileItemText value={t('horse.sire')} title={getWithExtended(data, 'sire')} />
              <ProfileItemText
                value={t('horse.sire-dam')}
                title={getWithExtended(data, 'sireDam')}
              />
              <ProfileItemText value={t('horse.groom')} title={getWithExtended(data, 'groom')} />
              <ProfileItemText
                value={t('horse.breed')}
                title={
                  getMasterDataValue(getWithExtended(data, 'breed') ?? '', MasterData.HorseBreed)
                    ?.value
                }
              />
              <BiographySocialMediaBlock data={data} />
            </List>
            <MedalKpiControl
              data={props.data}
              parameter={{ type: EntityType.Horse, id: props.data.id, display: 'id' }}
            />
            <BiographyProfile data={data} type={props.type} />
            <Divider variant="fullWidth" />
            <List dense={true}>
              <FieldTemplate
                type={TemplateType.ExternalIds}
                value={get(data, 'externalIds')}
                withText={false}
                icon={ContactsOutlinedIcon}
              />
            </List>
            {couldMerge(props.type) && props.setup?.request && (
              <>
                <Divider variant="fullWidth" />
                <Box sx={{ p: 1 }}>
                  <MergeRequestCard data={props.setup?.request} />
                </Box>
              </>
            )}
          </MainCard>
        </Grid>
      )}
      <Grid container spacing={2} size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 9 } : 12}>
        <HorseViewProfile {...props} editionMode={editionMode} />
        <HorseEditProfile
          {...props}
          editionMode={editionMode}
          type={props.type}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <MergeProfile
          config={config}
          {...props}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
        <EditProfile
          config={config}
          {...props}
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
