import Grid from '@mui/material/Grid';
import {
  Box,
  Chip,
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
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone';
import LanguageTwoToneIcon from '@mui/icons-material/LanguageTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import CelebrationTwoToneIcon from '@mui/icons-material/CelebrationTwoTone';
import { formatMasterCode, isNullOrEmpty } from '_helpers';
import {
  ActionType,
  EditionMode,
  EntityType,
  Entry,
  MasterData,
  MenuFlagEnum,
  TemplateType,
  ViewType,
} from 'models';
import { AvatarHeader, FieldTemplate, MainCard, ToolbarViewControl } from 'components';
import type { IToolbarPanelProps } from 'types/views';
import { OlympicColors } from 'themes/colors';
import { HideShowDialog } from 'pages/tools/consolidation/components';
import { CompetitionDetails } from './components';
import {
  ProfileButtons,
  EditProfile,
  BiographySocialMediaBlock,
  ProfileItem,
  ProfileItemText,
  ProfileItemElement,
  ProfileItemRoute,
} from '../components';
import { getLocationInfo } from '../utils/getters';
import { useModelConfig, useStoreCache, useSecurityProfile, useSecurity } from 'hooks';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import dayjs from 'dayjs';
import baseConfig from 'baseConfig';
type Props = {
  data: any;
  setup: any;
  type: EntityType;
};

export const CompetitionProfile = ({ data, type, setup }: Props) => {
  const { getConfig } = useModelConfig();
  const { dataInfo, getMasterDataValue } = useStoreCache();
  const { hasPermission } = useSecurityProfile();

  const config = getConfig(EntityType.Competition);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { mode } = useColorScheme();
  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[type]?.open);
  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100];
  const { canUpdate } = useSecurity(config.type, ViewType.View, false);

  const [openHide, setOpenHide] = useState(false);
  const [editionMode, setEditionMode] = useState(EditionMode.Detail);

  const handleOnClickEdit = () => setEditionMode(EditionMode.Update);
  const handleOnClickHide = () => setOpenHide(true);

  const toolBar: IToolbarPanelProps<any>[] = [
    {
      type: ActionType.Edit,
      title: t('actions.buttonEdit'),
      handleClick: handleOnClickEdit,
      condition: () => canUpdate && editionMode == EditionMode.Detail,
    },

    {
      type: ActionType.HideFields,
      title: t('actions.buttonHideShowEntity'),
      handleClick: handleOnClickHide,
      condition: () =>
        hasPermission(MenuFlagEnum.Consolidation) && editionMode == EditionMode.Detail,
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
                background: `radial-gradient(circle at top left, ${OlympicColors.RED} 30%, ${color}  10%)`,
              }}
              alignItems="center"
            >
              {editionMode === EditionMode.Detail && (
                <Box display={'flex'} justifyContent={'space-between'} sx={{ width: '100%' }}>
                  <ToolbarViewControl tools={toolBar} dataItem={data?.data ?? {}} />
                </Box>
              )}
              <Stack alignItems="center" direction={matchDownSM ? 'row' : 'column'} spacing={1}>
                <AvatarHeader element={data} config={config} />
                <Stack alignItems="center" spacing={1}>
                  <Typography variant="h5" textAlign="center" lineHeight={1.1}>
                    {data[config.displayAccessor]}
                  </Typography>
                  {data.categories && (
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                      {data.categories?.map((e: string, index: number) => {
                        const value = dataInfo[MasterData.CompetitionCategory].find(
                          (y: Entry) => y.key == e
                        );
                        const displayCC =
                          get(value, 'displayName') ?? get(value, 'value') ?? formatMasterCode(e);

                        return (
                          <Grid size="auto" key={`category-${index}`}>
                            <Chip
                              icon={<BookmarkTwoToneIcon fontSize="small" />}
                              variant="outlined"
                              size="small"
                              key={displayCC}
                              label={<Typography variant="body1">{displayCC}</Typography>}
                              sx={{ border: '1px solid grey', borderRadius: '5px' }}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                  {data.country && data.logo && (
                    <FieldTemplate
                      type={TemplateType.ListCountry}
                      value={[{ code: data.country }]}
                      withText={false}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
            <Divider variant="fullWidth" />
            <List>
              <ProfileItem
                icon={LocationOnTwoToneIcon}
                title={getLocationInfo(
                  getMasterDataValue(data.country, MasterData.Country)?.value,
                  data
                )}
                skip={true}
              />
              <ProfileItem
                icon={CalendarTodayTwoToneIcon}
                title={
                  get(data, 'startDate')
                    ? dayjs(get(data, 'startDate')).format(baseConfig.dayDateFormat).toUpperCase()
                    : ''
                }
                skip={true}
              />
              <ProfileItem
                icon={CalendarTodayTwoToneIcon}
                title={
                  get(data, 'finishDate')
                    ? dayjs(get(data, 'finishDate')).format(baseConfig.dayDateFormat).toUpperCase()
                    : ''
                }
                skip={true}
              />
              <ProfileItemText value={t('competition.season')} title={get(data, 'season')} />
              <ProfileItemElement
                element={
                  <FieldTemplate
                    type={TemplateType.Url}
                    value={get(data, 'publicWebSite')}
                    withText={false}
                    icon={LanguageTwoToneIcon}
                  />
                }
              />
              <ProfileItemText
                value={t('competition.technical-delegate')}
                title={get(data, 'technicalDelegate')}
              />
              <ProfileItemRoute
                type={EntityType.Venue}
                data={get(data, 'venue')}
                icon={AccountBalanceTwoToneIcon}
              />
              <ProfileItemRoute
                type={EntityType.Venue}
                data={get(data, 'openingVenue')}
                icon={CelebrationTwoToneIcon}
              />
              <ProfileItemRoute
                type={EntityType.Venue}
                data={get(data, 'closingVenue')}
                icon={AccountBalanceTwoToneIcon}
              />
              <BiographySocialMediaBlock data={data} />
            </List>
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
            <>
              {canUpdate && editionMode === EditionMode.Detail && (
                <ProfileButtons
                  canEdit={canUpdate}
                  canMerge={false}
                  hasMerge={setup?.request}
                  handleOnClickEdit={handleOnClickEdit}
                  handleOnClickHide={handleOnClickHide}
                />
              )}
            </>
          </MainCard>
        </Grid>
      )}
      <Grid container spacing={2} size={isOpen ? { xs: 12, sm: 12, md: 12, lg: 9 } : 12}>
        {editionMode === EditionMode.Detail && (
          <CompetitionDetails data={data} editionMode={editionMode} />
        )}
        <EditProfile
          data={data}
          setup={setup}
          config={config}
          editionMode={editionMode}
          onClose={() => setEditionMode(EditionMode.Detail)}
        />
      </Grid>
      <HideShowDialog
        dataItem={data}
        config={config}
        onClickOk={() => setOpenHide(false)}
        onClickCancel={() => setOpenHide(false)}
        visible={openHide && !isNullOrEmpty(data)}
        operation="HIDE"
      />
    </Grid>
  );
};
