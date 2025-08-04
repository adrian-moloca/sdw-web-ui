import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { DataType, DrawerFormProps, EditionMode, EntityType, EnumType, useEnums } from 'models';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutline';
import { Box, Button, useColorScheme, useTheme } from '@mui/material';
import { Datepicker, SelectData, SelectEnum, Textarea } from 'components';
import { t } from 'i18next';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { DeleteDialog } from '../../components';

export const DeliveryPlanForm = (props: DrawerFormProps) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const color = mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300];
  const { getDataSourceSetup, getConfig } = useModelConfig();
  const { managerSetup, getReportCategoryEntry } = useStoreCache();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [deleteDialog, setDeleteDialog] = useState(false);

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
    if (data.edition)
      data.edition = { id: data.edition.id, name: data.edition.name, code: data.edition.code };
    if (data.status) data.status = data.status.code;
    if (data.type) data.type = data.type.code;
    if (data.deliveryDate) data.deliveryDate = dayjs(data.deliveryDate).format('YYYY-MM-DD');
    if (data.scheduleDate) data.scheduleDate = dayjs(data.scheduleDate).format('YYYY-MM-DD');
    if (data.scope) data.scope = data.scope.map((x: any) => x.id);

    return data;
  };

  const createModeInitialValues = (baseData: any) => {
    return {
      ...baseData,
      edition: managerSetup.currentEdition
        ? {
            id: managerSetup.currentEdition.id,
            title: managerSetup.currentEdition.name,
            code: managerSetup.currentEdition.code,
          }
        : null,
      status: getEnumValueOf('Scheduled', EnumType.DeliveryStatus),
      type: defaultValueOf(EnumType.DeliveryType),
      deliveryDate: dayjs(),
      scheduleDate: dayjs(),
    };
  };

  const initializeEditModeValues = (baseData: any) => {
    const data = { ...baseData };

    if (data.edition)
      data.edition = { id: data.edition.id, title: data.edition.name, code: data.edition.code };
    if (data.status) data.status = getEnumValueOf(data.status, EnumType.DeliveryStatus);
    if (data.type) data.type = getEnumValueOf(data.type, EnumType.DeliveryType);
    if (data.deliveryDate) data.deliveryDate = dayjs(data.deliveryDate);
    if (data.scheduleDate) data.scheduleDate = dayjs(data.scheduleDate);
    if (data.scope) data.scope = data.scope.map((x: string) => getReportCategoryEntry(x));

    return data;
  };

  const getInitialValues = useMemo((): any => {
    const data = { ...props.data };
    if (props.editionMode === EditionMode.Create) {
      return createModeInitialValues(data);
    }
    return initializeEditModeValues(data);
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues,
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

  const title =
    props.editionMode == EditionMode.Create
      ? `${t('actions.create-new')} ${config.display}`
      : `${t('actions.buttonEdit')} ${config.display}`;

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <MainCard
        size="small"
        title={title}
        border={false}
        divider={false}
        headerSX={{ py: 1, backgroundColor: color }}
      >
        <Grid container spacing={2} size={12}>
          <Grid size={{ sm: 12, md: 10, lg: 6 }}>
            <SelectData
              label={t('general.edition')}
              dataSource={getDataSourceSetup(EntityType.Edition)}
              field="edition"
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ sm: 0, md: 2, lg: 6 }}></Grid>
          <Grid size={{ sm: 12, md: 6, lg: 3 }}>
            <SelectEnum
              options={getEnumValues(EnumType.DeliveryType)}
              label={t('common.type')}
              field="type"
              formik={formik}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 3 }}>
            <SelectEnum
              options={getEnumValues(EnumType.DeliveryStatus)}
              label={t('common.status')}
              field="status"
              formik={formik}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 3 }}>
            <Datepicker
              field="scheduleDate"
              disableFuture={false}
              formik={formik}
              label={t('common.scheduleDate')}
              required
              onChange={(date: any) => {
                formik.setFieldValue('deliveryDate', date);
              }}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 3 }}>
            <Datepicker
              field="deliveryDate"
              disableFuture={false}
              formik={formik}
              label={t('common.deliveryDate')}
            />
          </Grid>
          <Grid size={12}>
            <SelectData
              label={t('common.scope')}
              type={DataType.MultiSelect}
              dataSource={getDataSourceSetup(EntityType.ReportCategory)}
              field="scope"
              formik={formik}
              hint="Hint: Select the report categories for this delivery"
            />
          </Grid>
          <Grid size={12}>
            <Textarea label={t('general.notes-and-comments')} field="comments" formik={formik} />
          </Grid>
          <Grid size={12}>
            <Textarea label={t('general.risk-mitigation')} field="risks" formik={formik} />
          </Grid>
        </Grid>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
          {props.editionMode == EditionMode.Update && (
            <Button
              startIcon={<DeleteOutlined />}
              disableElevation
              variant="outlined"
              color="secondary"
              onClick={() => setDeleteDialog(true)}
              sx={{ mr: 1 }}
            >
              {t('actions.buttonDelete')}
            </Button>
          )}
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
      <DeleteDialog
        onClose={() => setDeleteDialog(false)}
        data={props.data}
        type={props.type}
        open={deleteDialog}
      />
    </Box>
  );
};
