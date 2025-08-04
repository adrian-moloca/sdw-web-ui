import { DrawerFormProps, EditionMode, EntityType, EnumType, useEnums } from 'models';
import useApiService from 'hooks/useApiService';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import Grid from '@mui/material/Grid';
import { Box, Button, IconButton } from '@mui/material';
import { MainCard, NumberInput, SelectData, SelectEnum, Textarea, TextInput } from 'components';
import { t } from 'i18next';
import { CloneDialog, DeleteDialog } from 'pages/reports-manager/components';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import Close from '@mui/icons-material/Close';
import ContentCopyTwoTone from '@mui/icons-material/ContentCopyTwoTone';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import SaveOutlined from '@mui/icons-material/SaveOutlined';

export const CategoryForm = (props: DrawerFormProps) => {
  const { managerSetup } = useStoreCache();
  const { getDataSource, getDataSourceSetup, getConfig } = useModelConfig();
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [cloneDialog, setCloneDialog] = useState(false);

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
    if (data.edition) data.edition = { id: data.edition.id };
    if (data.type) data.type = data.type.code;
    if (data.defaultFormat) data.defaultFormat = data.defaultFormat.code;

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (props.editionMode == EditionMode.Create) {
      data.edition = managerSetup.currentEdition
        ? {
            id: managerSetup.currentEdition.id,
            title: managerSetup.currentEdition.name,
            code: managerSetup.currentEdition.code,
          }
        : null;
      data.type = defaultValueOf(EnumType.ReportType);
      data.defaultFormat = defaultValueOf(EnumType.ReportFormat);
    } else {
      if (data.edition)
        data.edition = { id: data.edition.id, title: data.edition.name, code: data.edition.code };
      if (data.type) data.type = getEnumValueOf(data.type, EnumType.ReportType);
      if (data.defaultFormat)
        data.defaultFormat = getEnumValueOf(data.defaultFormat, EnumType.ReportFormat);
    }

    return data;
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(10, t('messages.the-string-must-be-at-least-10-characters-long'))
        .required(t('common.required')),
      code: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode === EditionMode.Detail) return null;

  const title =
    props.editionMode == EditionMode.Create
      ? `${t('actions.create-new')} ${config.display}`
      : `${t('actions.buttonEdit')}${props.data.name}`;

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
            <Button
              startIcon={<ContentCopyTwoTone />}
              disableElevation
              variant="outlined"
              color="secondary"
              onClick={() => setCloneDialog(true)}
            >
              {t('actions.buttonClone')}
            </Button>
          </Grid>
          <Grid size={{ sm: 12, md: 4, lg: 4 }}>
            <NumberInput label={t('common.index')} field="index" formik={formik} required />
          </Grid>
          <Grid size={{ sm: 12, md: 8, lg: 8 }}>
            <SelectData
              label={t('general.edition')}
              dataSource={getDataSourceSetup(EntityType.Edition)}
              disablePortal={true}
              field="edition"
              formik={formik}
              sticky={props.editionMode === EditionMode.Update}
            />
          </Grid>
          <Grid size={{ sm: 4, md: 4, lg: 4 }}>
            <TextInput label={t('common.code')} field="code" formik={formik} required />
          </Grid>
          <Grid size={{ sm: 8, md: 8, lg: 8 }}>
            <TextInput label={t('common.name')} field="name" formik={formik} required />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.ReportFormat)}
              label={t('common.format')}
              field="defaultFormat"
              formik={formik}
              required
              disablePortal={true}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.ReportType)}
              label={t('common.type')}
              field="type"
              formik={formik}
              required
              disablePortal={true}
            />
          </Grid>
          <Grid size={12}>
            <Textarea label={t('common.description')} field="description" formik={formik} />
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
      <CloneDialog
        onClose={() => setCloneDialog(false)}
        data={props.data}
        type={props.type}
        open={cloneDialog}
      />
    </Box>
  );
};
