import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import get from 'lodash/get';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { EditionMode, EntityType, Entry, EnumType, MasterData, useEnums } from 'models';
import {
  MainCard,
  SelectData,
  SelectEnum,
  SelectMasterData,
  SelectOptions,
  Textarea,
  TextInput,
  TextRichInput,
} from 'components';
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
  const { getDisciplineEntry, getMasterDataValue, getMetadata } = useStoreCache();
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
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.data.id}_view`] });
      props.onClose();
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
    if (data.gender) data.gender = data.gender.value;
    if (data.type) data.type = data.type.value;
    if (data.accreditationStatus) data.accreditationStatus = data.accreditationStatus.code;
    if (data.discipline) {
      data.discipline = data.discipline.key;
      data.sportDisciplineId = data.discipline.key;
    }
    if (data.nationality) data.nationality = data.nationality.value;
    if (data.eventType) data.eventType = data.eventType.key;
    data.socialNetworks = {
      tiktok: data.tiktok || undefined,
      twitter: data.twitter || undefined,
      website: data.officialWebsite || undefined,
      instagram: data.instagram || undefined,
      facebook: data.facebook || undefined,
    };

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (data.nationality)
      data.nationality = metadata!.nationality.options.find((x) => x.value === data.nationality);
    if (data.gender) data.gender = metadata!.gender.options.find((x) => x.value === data.gender);
    if (data.type) data.type = metadata!.type.options.find((x) => x.value === data.type);
    if (data.discipline) data.discipline = getDisciplineEntry(data.discipline);
    if (data.eventType) data.eventType = getMasterDataValue(data.eventType, MasterData.EventType);
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
      data.officialWebsite = get(props.data, 'socialNetworks.website');
    if (get(props.data, 'socialNetworks.instagram'))
      data.instagram = get(props.data, 'socialNetworks.instagram');
    if (get(props.data, 'socialNetworks.tiktok'))
      data.instagram = get(props.data, 'socialNetworks.tiktok');

    return data;
  }, [props.data]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      website: Yup.string().url(t('message.invalid-url')).nullable(),
      tiktok: Yup.string().url(t('message.invalid-url')).nullable(),
      twitter: Yup.string().url(t('message.invalid-url')).nullable(),
      officialWebsite: Yup.string().url(t('message.invalid-url')).nullable(),
      instagram: Yup.string().url(t('message.invalid-url')).nullable(),
      facebook: Yup.string().url(t('message.invalid-url')).nullable(),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode !== EditionMode.Update) return null;
  if (props.type !== EntityType.TeamBiography) return null;

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
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={metadata!.name.displayName}
                  field="name"
                  formik={formik}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.gender.options}
                  field="gender"
                  formik={formik}
                  label={t('common.gender')}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.nationality.options}
                  field="nationality"
                  formik={formik}
                  label={t('common.nationality')}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.type.options}
                  field="type"
                  formik={formik}
                  label={metadata!.type.displayName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput label={metadata!.city.displayName} field="city" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={metadata!.nickname.displayName}
                  field="nickname"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={metadata!.shortName.displayName}
                  field="shortName"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput label={metadata!.website.displayName} field="website" formik={formik} />
              </Grid>
              <Grid size={12}>
                <Divider>
                  <Typography variant="h5">{t('general.participationInfo')}</Typography>
                </Divider>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectMasterData
                  category={MasterData.Discipline}
                  field="discipline"
                  formik={formik}
                  label={t('general.discipline')}
                  group={true}
                  required
                  onChange={() => {
                    formik.setFieldValue('eventType', undefined);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectMasterData
                  category={MasterData.EventType}
                  field="eventType"
                  formik={formik}
                  label={t('general.event')}
                  disabled={!formik.values.discipline}
                  filter={(x: Entry | undefined) =>
                    x?.key?.startsWith(
                      formik.values?.discipline?.key?.replace(
                        MasterData.Discipline,
                        MasterData.EventType
                      )
                    ) || false
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectData
                  dataSource={getDataSourceSetup(EntityType.NocBiography)}
                  label={t('general.noc')}
                  field="noc"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                <TextInput label="Accreditation" field="accreditationId" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                <SelectEnum
                  options={getEnumValues(EnumType.AccreditationStatus)}
                  label="Accreditation Status"
                  field="accreditationStatus"
                  formik={formik}
                />
              </Grid>
              <Grid size={12}>
                <Divider>
                  <Typography variant="h5">{t('general.socialMedia')}</Typography>
                </Divider>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput label="Facebook" field="facebook" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput label="Twitter" field="twitter" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput label="Instagram" field="instagram" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput label="TikTok" field="tiktok" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextInput label="Official Website" field="officialWebsite" formik={formik} />
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
                  label={metadata!.generalBiography.displayName}
                  field="generalBiography"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextRichInput
                  label={metadata!.awards.displayName}
                  field="awards"
                  formik={formik}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
        <Grid size={12}>
          <MainCard size="small" title={'Sport Information'} expandable={true} border={false}>
            <Grid container spacing={2}>
              <Grid size={{ sm: 12, md: 6 }}>
                <Textarea label={metadata!.training.displayName} field="training" formik={formik} />
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
