import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { DataType, EditionMode, EntityType, EnumType, MasterData, useEnums } from 'models';
import Grid from '@mui/material/Grid';
import { MainCard } from 'components/cards/MainCard';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { t } from 'i18next';
import { useFormik } from 'formik';
import {
  Checkbox,
  Datepicker,
  NumberInput,
  SelectData,
  SelectEnum,
  SelectMasterData,
  SelectOptions,
  Textarea,
  TextInput,
  TextRichInput,
} from 'components';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import get from 'lodash/get';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';

type Props = {
  data: any;
  setup: any;
  type: EntityType;
  editionMode: EditionMode;
  onClose: () => void;
};

export const EditProfile = (props: Props) => {
  const { getDisciplineEntry, getMetadata } = useStoreCache();
  const { getDataSourceSetup, getConfig } = useModelConfig();
  const { getEnumValueOf, getEnumValues } = useEnums();
  const config = getConfig(props.type);
  const metadata = getMetadata(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const url = `${appConfig.biographiesManagerEndPoint}${config.apiNode}`;
  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.put(url, updateData),
    onSuccess: () => {
      props.onClose();
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.data.id}_view`] });
    },
    onError: (error: any) => error,
  });

  const handleSubmit = async (dataItem: any) => {
    const data = formatOutput(dataItem);
    try {
      await mutation.mutateAsync(data);
    } catch {
      if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
    }
  };

  const formatOutput = (dataItem: any): any => {
    const data = { ...dataItem };
    if (data.noc) data.noc = { id: data.noc.id };
    if (data.dateOfBirth) data.dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD');
    if (data.dateOfDeath) data.dateOfDeath = dayjs(data.dateOfDeath).format('YYYY-MM-DD');
    if (data.gender) data.gender = data.gender.value;
    if (data.nationality) data.nationality = data.nationality.value;
    if (data.countryOfBirth) data.countryOfBirth = data.countryOfBirth.value;
    if (data.countryOfResidence) data.countryOfResidence = data.countryOfResidence.value;
    if (data.maritalStatus) data.maritalStatus = data.maritalStatus.value;
    if (data.type) data.type = data.type.code;
    if (data.accreditationStatus) data.accreditationStatus = data.accreditationStatus.code;
    if (data.disciplines) data.disciplines = data.disciplines.map((x: any) => x.key);
    data.socialNetworks = {
      tiktok: data.tiktok || undefined,
      twitter: data.twitter || undefined,
      website: data.website || undefined,
      instagram: data.instagram || undefined,
      facebook: data.facebook || undefined,
    };

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (data.dateOfBirth) data.dateOfBirth = dayjs(data.dateOfBirth);
    if (data.dateOfDeath) data.dateOfDeath = dayjs(data.dateOfDeath);
    if (data.gender) data.gender = metadata!.gender.options.find((x) => x.value === data.gender);
    if (data.nationality)
      data.nationality = metadata!.nationality.options.find((x) => x.value === data.nationality);
    if (data.countryOfBirth)
      data.countryOfBirth = metadata!.countryOfBirth.options.find(
        (x) => x.value === data.countryOfBirth
      );
    if (data.countryOfResidence)
      data.countryOfResidence = metadata!.countryOfResidence.options.find(
        (x) => x.value === data.countryOfResidence
      );
    if (data.maritalStatus)
      data.maritalStatus = metadata!.maritalStatus.options.find(
        (x) => x.value === data.maritalStatus
      );
    if (data.type) data.type = getEnumValueOf(data.type, EnumType.PersonType);
    if (data.accreditationStatus)
      data.accreditationStatus = getEnumValueOf(
        data.accreditationStatus,
        EnumType.AccreditationStatus
      );
    data.noc = data.noc ? { id: data.noc.id, title: data.noc.name, code: data.noc.country } : null;
    if (get(props.data, 'socialNetworks.facebook'))
      data.facebook = get(props.data, 'socialNetworks.facebook');
    if (get(props.data, 'socialNetworks.twitter'))
      data.twitter = get(props.data, 'socialNetworks.twitter');
    if (get(props.data, 'socialNetworks.website'))
      data.website = get(props.data, 'socialNetworks.website');
    if (get(props.data, 'socialNetworks.instagram'))
      data.instagram = get(props.data, 'socialNetworks.instagram');
    if (get(props.data, 'socialNetworks.tiktok'))
      data.instagram = get(props.data, 'socialNetworks.tiktok');
    if (data.disciplines)
      data.disciplines = data.disciplines.map((x: string) => getDisciplineEntry(x));
    else data.disciplines = [];

    return data;
  }, [props.data]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      preferredGivenName: Yup.string()
        .min(1, t('message.the-string-must-be-at-least-1-characters-long'))
        .required(t('common.required')),
      preferredFamilyName: Yup.string()
        .min(1, t('message.the-string-must-be-at-least-1-characters-long'))
        .required(t('common.required')),
      profilePage: Yup.string().url(t('message.invalid-url')).nullable(),
      tiktok: Yup.string().url(t('message.invalid-url')).nullable(),
      twitter: Yup.string().url(t('message.invalid-url')).nullable(),
      website: Yup.string().url(t('message.invalid-url')).nullable(),
      instagram: Yup.string().url(t('message.invalid-url')).nullable(),
      facebook: Yup.string().url(t('message.invalid-url')).nullable(),
      // generalBiography: Yup.string().concat(sensitiveWordsValidator()),
      // milestones: Yup.string().concat(sensitiveWordsValidator()),
      // injuries: Yup.string().concat(sensitiveWordsValidator()),
      // family: Yup.string().concat(sensitiveWordsValidator()),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode !== EditionMode.Update) return null;
  if (props.type !== EntityType.PersonBiography) return null;

  return (
    <MainCard content={false}>
      <Grid container spacing={1} size={12} component="form" onSubmit={formik.handleSubmit}>
        <Grid size={12}>
          <MainCard
            size="small"
            title={t('general.basicInformation')}
            border={false}
            secondary={
              <Box sx={{ flexGrow: 1 }}>
                <Button
                  startIcon={<CancelOutlined />}
                  disableElevation
                  variant="text"
                  color="secondary"
                  onClick={props.onClose}
                  sx={{ mr: 1 }}
                >
                  {t('actions.buttonCancel')}
                </Button>
                <Button
                  disableElevation
                  type="submit"
                  color="secondary"
                  variant="outlined"
                  startIcon={<SaveOutlined />}
                  disabled={!formik.isValid}
                >
                  {t('actions.buttonSave')}
                </Button>
              </Box>
            }
          >
            <Grid container spacing={2}>
              <Grid size={{ sm: 12, md: 6, lg: 5 }}>
                <TextInput
                  label={t('general.preferredGivenName')}
                  field="preferredGivenName"
                  formik={formik}
                  placeholder={t('general.preferredGivenName')}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 5 }}>
                <TextInput
                  label={t('general.preferredFamilyName')}
                  field="preferredFamilyName"
                  formik={formik}
                  placeholder={t('general.preferredFamilyName')}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 2 }}>
                <SelectOptions
                  options={metadata!.gender.options}
                  field="gender"
                  formik={formik}
                  label={t('common.gender')}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <Datepicker
                  field="dateOfBirth"
                  disableFuture={true}
                  formik={formik}
                  label={t('common.dateOfBirth')}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.countryOfBirth.options}
                  field="countryOfBirth"
                  formik={formik}
                  label={t('general.countryOfBirth')}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={t('general.placeOfBirth')}
                  field="placeOfBirth"
                  formik={formik}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.countryOfResidence.options}
                  field="countryOfResidence"
                  formik={formik}
                  label={t('general.countryOfResidence')}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={t('general.placeOfResidence')}
                  field="placeOfResidence"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.nationality.options}
                  field="nationality"
                  formik={formik}
                  label={t('common.nationality')}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.nickname')} field="nickname" formik={formik} />
              </Grid>
              <Grid size={{ sm: 6, md: 3, lg: 2 }}>
                <NumberInput label={t('general.height')} field="height" formik={formik} />
              </Grid>
              <Grid size={{ sm: 6, md: 3, lg: 2 }}>
                <NumberInput label={t('general.weight')} field="weight" formik={formik} />
              </Grid>
              <Grid size={{ sm: 6, md: 3, lg: 3 }}>
                <Checkbox
                  field="olympicSolidarity"
                  formik={formik}
                  label={t('general.olympicSolidarity')}
                />
              </Grid>
              <Grid size={12}>
                <Divider>
                  <Typography variant="h5">{t('general.participationInfo')}</Typography>
                </Divider>
              </Grid>
              <Grid size={{ sm: 12, md: 8, lg: 8 }}>
                <SelectMasterData
                  category={MasterData.Discipline}
                  type={DataType.MultiSelect}
                  field="disciplines"
                  formik={formik}
                  group={true}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 4, lg: 4 }}>
                <SelectData
                  dataSource={getDataSourceSetup(EntityType.NocBiography)}
                  label={t('general.noc')}
                  field="noc"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 6, md: 4, lg: 4 }}>
                <SelectEnum
                  options={getEnumValues(EnumType.PersonType)}
                  label={t('common.role')}
                  field="type"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 6, md: 4, lg: 4 }}>
                <TextInput
                  label={t('general.accreditation')}
                  field="accreditationId"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 6, md: 4, lg: 4 }}>
                <SelectEnum
                  options={getEnumValues(EnumType.AccreditationStatus)}
                  label={t('general.accreditation-status')}
                  field="accreditationStatus"
                  formik={formik}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid size={12}>
          <MainCard
            size="small"
            title={t('general.historicalResults')}
            expandable={true}
            border={false}
          >
            <Grid container spacing={2}>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextRichInput
                  label={t('general.generalBiography')}
                  field="generalBiography"
                  formik={formik}
                />
              </Grid>
              <Grid container spacing={2} size={{ sm: 12, md: 6 }}>
                <Grid size={12}>
                  <TextRichInput
                    label={t('general.milestones')}
                    field="milestones"
                    formik={formik}
                  />
                </Grid>
                <Grid size={12}>
                  <TextRichInput
                    label={t('general.memorableAchievement')}
                    field="memorableAchievement"
                    formik={formik}
                  />
                </Grid>
                <Grid size={12}>
                  <TextRichInput label={t('general.injuries')} field="injuries" formik={formik} />
                </Grid>
                <Grid size={'auto'} />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid size={12}>
          <MainCard
            size="small"
            title={t('general.generalInformation')}
            expandable={true}
            border={false}
          >
            <Grid container spacing={2}>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput field="otherNames" formik={formik} label={t('general.otherNames')} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput
                  field="spokenLanguages"
                  formik={formik}
                  label={t('general.spokenLanguages')}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.family')} field="family" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <SelectOptions
                  options={metadata!.maritalStatus.options}
                  field="maritalStatus"
                  formik={formik}
                  label={t('general.maritalStatus')}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.education')} field="education" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.occupation')} field="occupation" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.hobbies')} field="hobbies" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.philosophy')} field="philosophy" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.sponsors')} field="sponsors" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.profilePage')} field="profilePage" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput
                  label={t('general.profileImages')}
                  field="profileImages"
                  formik={formik}
                />
              </Grid>
              <Grid size={12}>
                <Divider>
                  <Typography variant="h5">{t('general.socialMedia')}</Typography>
                </Divider>
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label="Facebook" field="facebook" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label="Twitter" field="twitter" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label="Instagram" field="instagram" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label="TikTok" field="tiktok" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label="Official Website" field="website" formik={formik} />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid size={12}>
          <MainCard
            size="small"
            title={t('general.sportInformation')}
            expandable={true}
            border={false}
          >
            <Grid container spacing={2}>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea
                  label={t('general.startedCompeting')}
                  field="startedCompeting"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={t('general.reason')} field="reason" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.coach')} field="coach" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.clubName')} field="clubName" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput
                  label={t('general.nationalLeague')}
                  field="nationalLeague"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.nationalTeam')} field="nationalTeam" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput label={t('general.hand')} field="hand" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextInput
                  label={t('general.positionStyle')}
                  field="positionStyle"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={t('general.training')} field="training" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={t('general.ambition')} field="ambition" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={t('general.hero')} field="hero" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={t('general.influence')} field="influence" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={t('general.ritual')} field="ritual" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea
                  label={t('general.sportingRelatives')}
                  field="sportingRelatives"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={t('general.otherSports')} field="otherSports" formik={formik} />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid
          size={12}
          sx={{ display: 'flex', justifyContent: 'end', marginTop: 2, marginBottom: 4 }}
        >
          <Box sx={{ flexGrow: 1 }} />
          <Button
            startIcon={<CancelOutlined />}
            disableElevation
            variant="text"
            color="secondary"
            onClick={props.onClose}
            sx={{ mr: 1 }}
          >
            {t('actions.buttonCancel')}
          </Button>
          <Button
            disableElevation
            type="submit"
            color="secondary"
            variant="outlined"
            startIcon={<SaveOutlined />}
            disabled={!formik.isValid}
          >
            {t('actions.buttonSave')}
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};
