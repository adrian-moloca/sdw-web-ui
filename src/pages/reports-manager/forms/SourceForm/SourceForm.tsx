import useApiService from 'hooks/useApiService';
import {
  DrawerFormProps,
  EditionMode,
  EntityType,
  EnumType,
  SourceTypeEnum,
  useEnums,
} from 'models';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { humanize, isDevelopment, Logger } from '_helpers';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import { Box, Button, IconButton } from '@mui/material';
import { SelectData, SelectEnum, TextInput } from 'components';
import { t } from 'i18next';
import { DeleteDialog } from '../../components';
import Close from '@mui/icons-material/Close';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useModelConfig } from 'hooks';

export const SourceForm = (props: DrawerFormProps) => {
  const { getDataSource, getConfig } = useModelConfig();
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [deleteDialog, setDeleteDialog] = useState(false);

  const url =
    props.editionMode == EditionMode.Create
      ? `${getDataSource(props.type).url}/create`
      : getDataSource(props.type).url;

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
    if (data.startDate) data.startDate = dayjs(data.startDate).format('YYYY-MM-DD');
    if (data.finishDate) data.finishDate = dayjs(data.finishDate).format('YYYY-MM-DD');
    if (data.country) data.country = data.country.value;
    if (data.type) data.type = data.type.code;
    if (data.category) data.category = data.category.code;
    if (data.organization) data.organization = data.organization.code;
    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (props.editionMode == EditionMode.Create) {
      data.type = defaultValueOf(EnumType.SourceType);
      data.category = defaultValueOf(EnumType.SourceCategory);
      data.organization = getEnumValueOf('SDW', EnumType.IngestSource);
      data.displayName = null;
      data.url = null;
      data.description = null;
      data.schema = null;
      data.table = null;
    } else {
      if (data.type) data.type = getEnumValueOf(data.type, EnumType.SourceType);
      if (data.category) data.category = getEnumValueOf(data.category, EnumType.SourceCategory);
      if (data.organization)
        data.organization = getEnumValueOf(data.organization, EnumType.IngestSource);
      if (!data.displayName) data.displayName = null;
      if (!data.url) data.url = null;
      if (!data.description) data.description = null;
    }

    return data;
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      displayName: Yup.string()
        .min(10, 'The string must be at least 10 characters long')
        .required(t('common.required')),
      schema: Yup.string()
        .min(3, 'The string must be at least 3 characters long')
        .matches(/^\S*$/, 'The string must not contain any spaces'),
      tableName: Yup.string()
        .min(3, 'The string must be at least 3 characters long')
        .matches(/^\S*$/, 'The string must not contain any spaces'),
      url: Yup.string().url('Invalid URL').nullable(),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode === EditionMode.Detail) return null;
  if (props.editionMode === EditionMode.Update && !props.data) return null;

  const title =
    props.editionMode == EditionMode.Create
      ? `${t('actions.create-new')} ${config.display}`
      : `${t('actions.buttonEdit')} ${props.data[config.displayAccessor]}`;

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <MainCard
        title={title}
        border={false}
        sx={{ height: '100%' }}
        contentSX={{ px: 3 }}
        secondary={
          <IconButton onClick={props.onClose}>
            <Close />
          </IconButton>
        }
      >
        <Grid container spacing={2} size={12}>
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              startIcon={<DeleteOutline />}
              disableElevation
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialog(true)}
              sx={{ mr: 1 }}
            >
              {t('actions.buttonDelete')}
            </Button>
          </Grid>
          <Grid size={{ sm: 6, md: 4, lg: 4 }}>
            <SelectEnum
              options={getEnumValues(EnumType.SourceType)}
              label={t('common.type')}
              field="type"
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ sm: 8, md: 8, lg: 8 }}>
            <TextInput label={t('common.name')} field="displayName" formik={formik} required />
          </Grid>
          {formik.values.type?.code === SourceTypeEnum.Table ? (
            <>
              <Grid size={12}>
                <SelectData
                  label="Schema"
                  field="schema"
                  formik={formik}
                  mode="simple"
                  disablePortal={true}
                  disabled={formik.values.type?.code !== SourceTypeEnum.Table}
                  dataSource={{
                    url: `${getDataSource(EntityType.ReportSource).url}/schemas`,
                    queryKey: `schemas`,
                    apiVersion: 'filter',
                  }}
                  onChange={() => {
                    formik.setFieldValue('tableName', null);
                  }}
                />
              </Grid>
              <Grid size={12}>
                <SelectData
                  label="Table"
                  field="tableName"
                  formik={formik}
                  mode="simple"
                  disablePortal={true}
                  disabled={
                    formik.values.type?.code !== SourceTypeEnum.Table || !formik.values.schema
                  }
                  dataSource={{
                    url: `${getDataSource(EntityType.ReportSource).url}/schemas/${formik.values.schema}/tables`,
                    queryKey: `tables`,
                    apiVersion: 'filter',
                  }}
                  onChange={(value: any) => {
                    formik.setFieldValue('displayName', humanize(value));
                  }}
                />
              </Grid>
            </>
          ) : (
            <Grid size={{ sm: 8, md: 8, lg: 12 }}>
              <TextInput
                label={t('common.url')}
                field="url"
                formik={formik}
                placeholder={t('common.url')}
                disabled={formik.values.type?.code == 'TABLE'}
              />
            </Grid>
          )}
          <Grid size={{ sm: 6, md: 6, lg: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.SourceCategory)}
              label={t('general.category')}
              field="category"
              formik={formik}
              disablePortal={true}
            />
          </Grid>
          <Grid size={{ sm: 6, md: 6, lg: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.IngestSource)}
              label={t('general.organisation')}
              field="organization"
              formik={formik}
              disablePortal={true}
            />
          </Grid>
          <Grid size={12}>
            <TextInput label={t('common.description')} field="description" formik={formik} />
          </Grid>
        </Grid>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
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
          <Box sx={{ flexGrow: 1 }} />
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
