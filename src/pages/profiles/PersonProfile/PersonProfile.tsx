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
import useConsolidation from 'hooks/useConsolidation';
import { EditProfile as PersonEditProfile, ViewProfile as PersonViewProfile } from './components';
import { BiographyProfile, BioStatusControl } from 'pages/biographies-manager/components';
import {
  ProfileButtons,
  EditProfile,
  MergeProfile,
  BiographySocialMediaBlock,
  ProfileItemText,
  ProfileItemElement,
  ProfileItemCountry,
  ValidateProfile,
} from '../components';
import {
  getFullName,
  getNativeName,
  getPassportName,
  getBirthInfo,
  getResidenceInfo,
  getDeathInfo,
  getWithExtended,
} from '../utils/getters';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import dayjs from 'dayjs';
import baseConfig from 'baseConfig';

type Props = {
  data: any;
  setup: any;
  type: EntityType;
};

export const PersonProfile = ({ data, type, setup }: Props) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(type);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { mode } = useColorScheme();

  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[type]?.open);

  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100];

  const { getMasterDataValue } = useStoreCache();
  const { canUpdate } = useSecurity(config.type, ViewType.View, false);
  const { hasMerge, couldMerge } = useConsolidation();
  const canMerge = (): boolean => hasMerge(config.type) && canUpdate && type === EntityType.Person;

  const [editionMode, setEditionMode] = useState(EditionMode.Detail);

  const handleOnClickEdit = () => setEditionMode(EditionMode.Update);
  const handleOnClickMerge = () => setEditionMode(EditionMode.Merge);
  const handleOnClickValidate = () => setEditionMode(EditionMode.Validate);

  const toolBar: IToolbarPanelProps<any>[] = [
    {
      type: ActionType.Edit,
      title: t('actions.buttonEdit'),
      handleClick: handleOnClickEdit,
      condition: () => canUpdate && editionMode === EditionMode.Detail,
    },
    {
      type: ActionType.Merge,
      title: t('actions.buttonMerge'),
      handleClick: handleOnClickMerge,
      condition: () => canMerge() && editionMode === EditionMode.Detail,
    },
    {
      type: ActionType.Validate,
      title: t('actions.buttonValidate'),
      handleClick: handleOnClickValidate,
      condition: () => canMerge() && editionMode === EditionMode.Detail,
    },
  ];

  return (
    <Grid container spacing={2}>
      {isOpen && (
        <Grid size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 3 } : 0}>
          <MainCard content={false}>
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
                  <BioStatusControl type={type} dataItem={data ?? {}} />
                  <ToolbarViewControl tools={toolBar} dataItem={data?.data ?? {}} />
                </Box>
              )}
              <Stack alignItems="center" direction={matchDownSM ? 'row' : 'column'} spacing={1}>
                <AvatarHeader element={data} config={config} />
                <Stack alignItems="center">
                  <Typography variant="h5" textAlign="center" lineHeight={1.1}>
                    {data.displayName}
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
                value={t('general.nick')}
                title={get(data, 'nickname')}
                lengthControl={true}
              />
              <ProfileItemText value={t('general.full-name')} title={getFullName(data)} />
              <ProfileItemText value={t('general.native-name')} title={getNativeName(data)} />
              <ProfileItemText value={t('general.passport-name')} title={getPassportName(data)} />
              <ProfileItemText value={t('general.title')} title={getWithExtended(data, 'title')} />
              <ProfileItemText
                value={t('common.dateOfBirth')}
                title={
                  get(data, 'dateOfBirth')
                    ? dayjs(get(data, 'dateOfBirth'))
                        .format(baseConfig.generalDateFormat)
                        .toUpperCase()
                    : undefined
                }
              />
              {get(data, 'age') && (
                <ProfileItemText
                  value={t('common.age')}
                  title={`${get(data, 'age')} ${t('general.years')}`}
                />
              )}
              <ProfileItemText
                value={t('common.dateOfDeath')}
                title={
                  get(data, 'dateOfDeath')
                    ? dayjs(get(data, 'dateOfDeath'))
                        .format(baseConfig.generalDateFormat)
                        .toUpperCase()
                    : undefined
                }
              />
              <ProfileItemText
                value={t('common.gender')}
                title={getMasterDataValue(get(data, 'gender'), MasterData.PersonGender)?.value}
              />
              <ProfileItemText
                value={t('common.nationality')}
                title={getMasterDataValue(get(data, 'nationality'), MasterData.Country)?.value}
              />
              <ProfileItemText
                value={t('general.birth')}
                title={getBirthInfo(
                  getMasterDataValue(get(data, 'countryOfBirth'), MasterData.Country)?.value,
                  data
                )}
              />
              <ProfileItemText
                value={t('general.residence')}
                title={getResidenceInfo(
                  getMasterDataValue(get(data, 'countryOfResidence'), MasterData.Country)?.value,
                  data
                )}
              />
              <ProfileItemText
                value={t('general.death')}
                title={getDeathInfo(
                  getMasterDataValue(get(data, 'countryOfDeath'), MasterData.Country)?.value,
                  data
                )}
              />
              <ProfileItemText
                value={t('general.height')}
                title={getWithExtended(data, 'height')}
              />
              <ProfileItemText
                value={t('general.weight')}
                title={getWithExtended(data, 'weight')}
              />
              <BiographySocialMediaBlock data={data} />
            </List>
            <MedalKpiControl
              data={data}
              parameter={{ type: EntityType.Person, id: data.id, display: 'id' }}
            />
            <BiographyProfile data={data} type={type} />
            <Divider variant="fullWidth" />
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
            {couldMerge(type) && setup?.request && (
              <>
                <Divider variant="fullWidth" />
                <Box sx={{ p: 1 }}>
                  <MergeRequestCard data={setup?.request} />
                </Box>
              </>
            )}
            {canUpdate && editionMode === EditionMode.Detail && (
              <ProfileButtons
                canEdit={canUpdate}
                canMerge={canMerge()}
                hasMerge={setup?.request && type == EntityType.Person}
                handleOnClickValidate={handleOnClickValidate}
                handleOnClickMerge={handleOnClickMerge}
                handleOnClickEdit={handleOnClickEdit}
              />
            )}
          </MainCard>
        </Grid>
      )}
      <Grid container spacing={2} size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 9 } : 12}>
        <PersonViewProfile data={data} setup={setup} editionMode={editionMode} type={type} />
        <PersonEditProfile
          data={data}
          setup={setup}
          editionMode={editionMode}
          type={type}
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
          data={data}
          setup={setup}
          config={config}
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
