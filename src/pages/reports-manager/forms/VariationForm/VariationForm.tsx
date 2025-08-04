import useApiService from 'hooks/useApiService';
import {
  DataType,
  DrawerFormProps,
  EditionMode,
  EntityType,
  EnumType,
  MasterData,
  MetaField,
  useEnums,
} from 'models';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { isDevelopment, Logger } from '_helpers';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import { Box, Button, IconButton } from '@mui/material';
import {
  NumberInput,
  SelectData,
  SelectEnum,
  SelectMasterData,
  TextInput,
  Textarea,
} from 'components';
import { t } from 'i18next';
import Close from '@mui/icons-material/Close';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import ContentCopyTwoTone from '@mui/icons-material/ContentCopyTwoTone';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { CloneDialog, DeleteDialog, InitDialog } from '../../components';
import { useModelConfig, useStoreCache } from 'hooks';

export const VariationForm = (props: DrawerFormProps) => {
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const { getDataSourceSetup, getDataSource, getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const { dataInfo, getDisciplineEntry } = useStoreCache();
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [cloneDialog, setCloneDialog] = useState(false);
  const [initDialog, setInitDialog] = useState(false);

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
    if (data.category) data.category = { id: data.category.id };
    if (data.defaultFormat) data.defaultFormat = data.defaultFormat.code;
    if (data.disciplines) data.disciplines = data.disciplines.map((x: any) => x.key);

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (props.editionMode == EditionMode.Create) {
      data.category = {};
      data.defaultFormat = defaultValueOf(EnumType.ReportFormat);
      data.fileNameTemplate = '[DISCIPLINE_CODE][VARIATION_CODE][VARIATION_SUBCODE]_';
    } else {
      if (data.category)
        data.category = {
          id: data.category.id,
          title: data.category.name,
          code: data.category.code,
        };
      if (data.defaultFormat)
        data.defaultFormat = getEnumValueOf(data.defaultFormat, EnumType.ReportFormat);
      if (data.disciplines)
        data.disciplines = data.disciplines.map((x: string) => getDisciplineEntry(x));
      else data.disciplines = [];
    }

    return data;
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(5, 'The string must be at least 5 characters long')
        .required(t('common.required')),
      code: Yup.string()
        .min(3, 'The string must be at least 3 characters long')
        .required(t('common.required')),
      subCode: Yup.string()
        .min(3, 'The string must be at least 3 characters long')
        .required(t('common.required')),
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
          <Grid size={12}>
            <SelectData
              label={t('general.category')}
              dataSource={getDataSourceSetup(EntityType.ReportCategory)}
              field="category"
              formik={formik}
              disablePortal={true}
              sticky={props.editionMode === EditionMode.Update}
              onChange={(value: any) => {
                if (value) {
                  formik.setFieldValue('code', value.code);
                  formik.setFieldValue('name', value.title);
                }
              }}
            />
          </Grid>
          <Grid size={6}>
            <TextInput label={t('common.code')} field="code" formik={formik} required />
          </Grid>
          <Grid size={6}>
            <TextInput label={t('common.subCode')} field="subCode" formik={formik} required />
          </Grid>
          <Grid size={12}>
            <TextInput label={t('common.name')} field="name" formik={formik} required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.ReportFormat)}
              label={t('common.format')}
              field="defaultFormat"
              formik={formik}
              disablePortal={true}
            />
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.Discipline}
              type={DataType.MultiSelect}
              field="disciplines"
              formik={formik}
              disablePortal={true}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <NumberInput label={t('general.cutoff')} field="cutoff" formik={formik} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <NumberInput label={t('general.lineCutoff')} field="lineCutoff" formik={formik} />
          </Grid>
          <Grid size={12}>
            <TextInput
              label={t('general.fileNameTemplate')}
              field="fileNameTemplate"
              formik={formik}
              placeholder={t('general.fileNameTemplate')}
              hint={`Hint: Please use a combination of theses values between brackets: ${dataInfo.metaFields
                .filter((x: MetaField) => x.type == 'all' || x.type == 'reportVariation')
                .map((x: any) => x.code)
                .join(', ')}`}
            />
          </Grid>
          <Grid size={12}>
            <Textarea label={t('common.description')} field={'description'} formik={formik} />
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
      <InitDialog
        onClose={() => setInitDialog(false)}
        data={props.data}
        type={props.type}
        open={initDialog}
      />
    </Box>
  );
};
