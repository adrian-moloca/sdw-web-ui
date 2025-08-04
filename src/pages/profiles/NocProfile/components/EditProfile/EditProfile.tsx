import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Box, Button } from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { EditionMode, EntityType, EnumType, MasterData, useEnums } from 'models';
import { Datepicker, MainCard, SelectMasterData, TextInput, TextRichInput } from 'components';
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
  const { getMasterDataValue, clearNocs } = useStoreCache();
  const { getEnumValueOf } = useEnums();
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const url = `${appConfig.biographiesManagerEndPoint}${config.apiNode}`;
  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.put(url, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.data.id}_view`] });
      clearNocs();
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
    if (data.nocFoundedDate) data.nocFoundedDate = dayjs(data.nocFoundedDate).format('YYYY-MM-DD');
    if (data.iocRecognitionYear)
      data.iocRecognitionYear = dayjs(data.iocRecognitionYear).format('YYYY');
    if (data.anthemInducted) data.anthemInducted = dayjs(data.anthemInducted).format('YYYY');
    if (data.country) data.country = data.country.key;
    if (data.accreditationStatus) data.accreditationStatus = data.accreditationStatus.code;

    return data;
  };
  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (data.country) data.country = getMasterDataValue(data.country, MasterData.Country);
    if (data.nocFoundedDate) data.nocFoundedDate = dayjs(data.nocFoundedDate);
    if (data.anthemInducted) data.anthemInducted = dayjs(data.anthemInducted);
    if (data.iocRecognitionYear) data.iocRecognitionYear = dayjs(data.iocRecognitionYear);
    if (data.accreditationStatus)
      data.accreditationStatus = getEnumValueOf(
        data.accreditationStatus,
        EnumType.AccreditationStatus
      );

    return data;
  }, [props.data]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      website: Yup.string().url(t('message.invalid-url')).nullable(),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode !== EditionMode.Update) return null;
  if (props.type !== EntityType.NocBiography) return null;

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
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.name')} field="name" formik={formik} required />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 3 }}>
                <TextInput label={t('common.shortName')} field="shortName" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 5 }}>
                <TextInput label={t('common.longName')} field="longName" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={t('common.officialName')}
                  field="officialName"
                  formik={formik}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <SelectMasterData
                  category={MasterData.Country}
                  field="country"
                  formik={formik}
                  label={t('general.country')}
                  required
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 2 }}>
                <TextInput label={t('general.countryInfo')} field="countryInfo" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 2 }}>
                <TextInput label={t('general.continent')} field="continent" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 3 }}>
                <Datepicker
                  label={t('general.nocFoundedDate')}
                  field={'nocFoundedDate'}
                  disableFuture={true}
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 3 }}>
                <Datepicker
                  field={'iocRecognitionYear'}
                  disableFuture={true}
                  formik={formik}
                  format={'YYYY'}
                  label={t('general.iocRecognitionYear')}
                  views={['year']}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 6 }}>
                <TextInput label={t('general.president')} field="president" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={t('general.generalSecretary')}
                  field="generalSecretary"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={t('general.iocExecutiveBoard')}
                  field="iocExecutiveBoard"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.iocMembers')} field="iocMembers" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 5 }}>
                <TextInput label={t('general.anthemTitle')} field="anthemTitle" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 5 }}>
                <TextInput
                  label={t('general.anthemComposer')}
                  field="anthemComposer"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 2 }}>
                <Datepicker
                  field="anthemInducted"
                  disableFuture={true}
                  formik={formik}
                  format={'YYYY'}
                  label={t('general.anthemInducted')}
                  views={['year']}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput label={t('general.website')} field="website" formik={formik} />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={t('general.gamesFirstAppearance')}
                  field="gamesFirstAppearance"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6, lg: 4 }}>
                <TextInput
                  label={t('general.gamesAppearanceNumber')}
                  field="gamesAppearanceNumber"
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
                <TextRichInput
                  label={t('general.additionalInformation')}
                  field="additionalInformation"
                  formik={formik}
                />
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
