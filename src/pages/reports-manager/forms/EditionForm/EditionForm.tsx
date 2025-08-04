import useApiService from 'hooks/useApiService';
import { DataType, DrawerFormProps, EditionMode, EnumType, MasterData, useEnums } from 'models';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { isDevelopment, Logger } from '_helpers';
import Grid from '@mui/material/Grid';
import { Box, Button, IconButton } from '@mui/material';
import {
  Datepicker,
  MainCard,
  SelectEnum,
  SelectMasterData,
  Textarea,
  TextInput,
} from 'components';
import { t } from 'i18next';
import { CloneDialog, DeleteDialog, InitDialog } from '../../components';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import Close from '@mui/icons-material/Close';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import FlagCircleOutlined from '@mui/icons-material/FlagCircleOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useStoreCache, useModelConfig } from 'hooks';

export const EditionForm = (props: DrawerFormProps) => {
  const { getDisciplineEntry, getMasterDataValue, clearEditions } = useStoreCache();
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(props.type);
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
      clearEditions();
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
    if (data.startDate) data.startDate = dayjs(data.startDate).format('YYYY-MM-DD');
    if (data.finishDate) data.finishDate = dayjs(data.finishDate).format('YYYY-MM-DD');
    if (data.country) data.country = data.country.key;
    if (data.type) data.type = data.type.code;
    if (data.disciplines) data.disciplines = data.disciplines.map((x: any) => x.key);

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (props.editionMode == EditionMode.Create) {
      data.country = getMasterDataValue('USA', MasterData.Country);
      data.type = defaultValueOf(EnumType.Season);
      data.disciplines = [];
    } else {
      if (data.startDate) data.startDate = dayjs(data.startDate);
      if (data.finishDate) data.finishDate = dayjs(data.finishDate);
      if (data.country) data.country = getMasterDataValue(data.country, MasterData.Country);
      if (data.type) data.type = getEnumValueOf(data.type, EnumType.Season);
      if (data.disciplines)
        data.disciplines = data.disciplines.map((x: string) => getDisciplineEntry(x));
      else data.disciplines = [];
      return data;
    }

    return data;
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required(t('common.required')),
      code: Yup.string().required(t('common.required')),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode === EditionMode.Detail) return null;
  if (props.editionMode === EditionMode.Update && !props.data) return null;

  const title =
    props.editionMode === EditionMode.Create
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
            <Button
              startIcon={<FlagCircleOutlined />}
              variant="outlined"
              color="secondary"
              onClick={() => setInitDialog(true)}
            >
              {t('actions.buttonInitDefault')}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {props.editionMode == EditionMode.Update && (
              <>
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
                  startIcon={<ContentCopyOutlined />}
                  disableElevation
                  variant="outlined"
                  color="secondary"
                  onClick={() => setCloneDialog(true)}
                >
                  {t('actions.buttonClone')}
                </Button>
              </>
            )}
          </Grid>
          <Grid size={{ sm: 4, md: 4, lg: 4 }}>
            <TextInput label={t('common.code')} field="code" formik={formik} required />
          </Grid>
          <Grid size={{ xs: 8, sm: 8, md: 8, lg: 8 }}>
            <TextInput label={t('common.name')} field="name" formik={formik} required />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SelectEnum
              disablePortal={true}
              options={getEnumValues(EnumType.Season)}
              label={t('common.type')}
              field="type"
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextInput label={t('common.longName')} field="longName" formik={formik} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextInput label={t('general.region')} field="region" formik={formik} required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectMasterData
              category={MasterData.Country}
              field="country"
              formik={formik}
              label={t('general.country')}
              required
              group={true}
              disablePortal={true}
            />
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.Discipline}
              type={DataType.MultiSelect}
              field="disciplines"
              formik={formik}
              group={true}
              disablePortal={true}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Datepicker
              field="startDate"
              disableFuture={false}
              formik={formik}
              label={t('common.startDate')}
              disablePortal={true}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Datepicker
              field="finishDate"
              disableFuture={false}
              formik={formik}
              label={t('common.finishDate')}
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
      <InitDialog
        onClose={() => setInitDialog(false)}
        data={props.data}
        type={props.type}
        open={initDialog}
      />
    </Box>
  );
};
