import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import {
  DataType,
  DrawerFormProps,
  EditionMode,
  EntityType,
  EnumType,
  MasterData,
  useEnums,
} from 'models';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback } from 'react';
import { isDevelopment, Logger } from '_helpers';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Box, Button } from '@mui/material';
import { Datepicker, SelectData, SelectEnum, SelectMasterData, TextInput } from 'components';
import { t } from 'i18next';
import dayjs from 'dayjs';
import { useModelConfig, useStoreCache } from 'hooks';

export const GeneralSetupForm = (props: DrawerFormProps) => {
  const { getDataSourceSetup, getConfig } = useModelConfig();
  const { getEnumValueOf, getEnumValues } = useEnums();
  const { getDisciplineEntry } = useStoreCache();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const url = `${appConfig.reportManagerEndPoint}${config.apiNode}`;
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
    if (data.currentEdition) data.currentEdition = { id: data.currentEdition.id };
    if (data.defaultFormat) data.defaultFormat = data.defaultFormat.code;
    if (data.feedFlag) data.feedFlag = data.feedFlag.code;
    if (data.initialDelivery)
      data.initialDelivery = dayjs(data.initialDelivery).format('YYYY-MM-DD');
    if (data.nextDelivery) data.nextDelivery = dayjs(data.nextDelivery).format('YYYY-MM-DD');
    if (data.finalDelivery) data.finalDelivery = dayjs(data.finalDelivery).format('YYYY-MM-DD');
    if (data.defaultDisciplines)
      data.defaultDisciplines = data.defaultDisciplines.map((x: any) => x.key);

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (data.currentEdition)
      data.currentEdition = {
        id: data.currentEdition.id,
        title: data.currentEdition.name,
        code: data.currentEdition.code,
      };
    if (data.defaultFormat)
      data.defaultFormat = getEnumValueOf(data.defaultFormat, EnumType.ReportFormat);
    if (data.feedFlag) data.feedFlag = getEnumValueOf(data.feedFlag, EnumType.FeedFlag);
    if (data.initialDelivery) data.initialDelivery = dayjs(data.initialDelivery);
    if (data.nextDelivery) data.nextDelivery = dayjs(data.nextDelivery);
    if (data.finalDelivery) data.finalDelivery = dayjs(data.finalDelivery);
    if (data.defaultDisciplines)
      data.defaultDisciplines = data.defaultDisciplines.map((x: string) => getDisciplineEntry(x));
    else data.defaultDisciplines = [];

    return data;
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    // validationSchema: Yup.object({
    //   name: Yup.string().min(10, 'The string must be at least 10 characters long').required(t('common.required')),
    //   code: Yup.string().min(3, 'The string must be at least 3 characters long').required(t('common.required')),
    // }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode === EditionMode.Detail) return null;
  if (props.editionMode === EditionMode.Update && !props.data) return null;

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <MainCard size="small" border={false} divider={false} headerSX={{ py: 0 }}>
        <Grid container spacing={2} size={12}>
          <Grid size={{ sm: 12, md: 4, lg: 4 }}>
            <SelectData
              label={t('general.edition')}
              dataSource={getDataSourceSetup(EntityType.Edition)}
              field="currentEdition"
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 8, lg: 8 }}>
            <SelectMasterData
              required
              category={MasterData.Discipline}
              type={DataType.MultiSelect}
              field="defaultDisciplines"
              formik={formik}
              label={t('general.disciplines')}
              group={true}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 4 }}>
            <Datepicker
              field="initialDelivery"
              disableFuture={false}
              formik={formik}
              label={t('general.initialDelivery')}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 4 }}>
            <Datepicker
              field="nextDelivery"
              disableFuture={false}
              formik={formik}
              label={t('general.nextDelivery')}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 4 }}>
            <Datepicker
              field="finalDelivery"
              disableFuture={false}
              formik={formik}
              label={t('general.finalDelivery')}
              required
            />
          </Grid>
          <Grid size={{ sm: 4, md: 4, lg: 6 }}>
            <TextInput
              field="outputFolder"
              label={t('general.outputFolder')}
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ sm: 4, md: 4, lg: 6 }}>
            <TextInput
              field="deliveryFolder"
              label={t('general.deliveryFolder')}
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 4, lg: 4 }}>
            <SelectEnum
              options={getEnumValues(EnumType.ReportFormat)}
              label={t('common.format')}
              field="defaultFormat"
              formik={formik}
            />
          </Grid>
          <Grid size={{ sm: 4, md: 8, lg: 8 }}>
            <TextInput
              label={t('general.fileNameTemplate')}
              field="fileNamingConvention"
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ sm: 6, md: 6, lg: 4 }}>
            <SelectEnum
              options={getEnumValues(EnumType.FeedFlag)}
              label="Feed Flag"
              field="feedFlag"
              formik={formik}
              required
            />
          </Grid>
        </Grid>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
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
      </MainCard>
    </Box>
  );
};
