import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Box, Button, Divider, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { EditionMode, EntityType, EnumType, useEnums } from 'models';
import {
  Datepicker,
  MainCard,
  NumberInput,
  SelectData,
  SelectEnum,
  SelectOptions,
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
  const { getMetadata } = useStoreCache();
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
    if (data.yearOfBirth) data.yearOfBirth = dayjs(data.yearOfBirth).format('YYYY');
    if (data.sex) data.sex = data.sex.value;
    if (data.colour) data.colour = data.colour.value;
    if (data.breed) data.breed = data.breed.value;
    if (data.countryOfBirth) data.countryOfBirth = data.countryOfBirth.value;
    if (data.nationality) data.nationality = data.nationality.value;
    if (data.accreditationStatus) data.accreditationStatus = data.accreditationStatus.code;

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (data.yearOfBirth) data.yearOfBirth = dayjs(data.yearOfBirth);
    if (data.sex) data.sex = metadata!.sex.options.find((x) => x.value === data.sex);
    if (data.colour) data.colour = metadata!.colour.options.find((x) => x.value === data.colour);
    if (data.breed) data.breed = metadata!.breed.options.find((x) => x.value === data.breed);
    if (data.countryOfBirth)
      data.countryOfBirth = metadata!.countryOfBirth.options.find(
        (x) => x.value === data.countryOfBirth
      );
    if (data.nationality)
      data.nationality = metadata!.nationality.options.find((x) => x.value === data.nationality);
    if (data.accreditationStatus)
      data.accreditationStatus = getEnumValueOf(
        data.accreditationStatus,
        EnumType.AccreditationStatus
      );
    data.noc = data.noc ? { id: data.noc.id, title: data.noc.name, code: data.noc.country } : null;
    if (!data.height) data.height = null;

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
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode !== EditionMode.Update) return null;
  if (props.type !== EntityType.HorseBiography) return null;

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
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 7 }}>
                <TextInput label={t('general.name')} field="name" formik={formik} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2 }}>
                <Datepicker
                  field="yearOfBirth"
                  disableFuture={true}
                  formik={formik}
                  label={t('general.yearOfBirth')}
                  views={['year']}
                  format={'YYYY'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <TextInput label={t('general.passport')} field="passport" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.sex.options}
                  field="sex"
                  formik={formik}
                  label={t('general.sex')}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.colour.options}
                  field="colour"
                  formik={formik}
                  label={t('general.colour')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.breed.options}
                  field="breed"
                  formik={formik}
                  label={t('general.breed')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <SelectOptions
                  options={metadata!.countryOfBirth.options}
                  field="countryOfBirth"
                  formik={formik}
                  label={t('general.countryOfBirth')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.dam')} field="dam" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.sire')} field="sire" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.groom')} field="groom" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.breeder')} field="breeder" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.owner')} field="owner" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 4, lg: 2 }}>
                <NumberInput label={t('general.height')} field="height" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 8, md: 8, lg: 4 }}>
                <TextInput label={t('general.secondOwner')} field="secondOwner" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <TextInput
                  label={t('general.profileImages')}
                  field="profileImages"
                  formik={formik}
                />
              </Grid>
              <Grid size={12}>
                <Divider>
                  <Typography variant="h5">{t('general.participationInfo')}</Typography>
                </Divider>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                <SelectData
                  dataSource={getDataSourceSetup(EntityType.NocBiography)}
                  label={t('general.noc')}
                  field="noc"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <TextInput
                  label={t('general.accreditation')}
                  field="accreditationId"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <SelectEnum
                  options={getEnumValues(EnumType.AccreditationStatus)}
                  label={t('general.accreditationStatus')}
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
              <Grid size={{ sm: 12, md: 6 }}>
                <TextRichInput label={t('general.awards')} field="awards" formik={formik} />
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
