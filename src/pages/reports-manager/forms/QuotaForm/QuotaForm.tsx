import useApiService from 'hooks/useApiService';
import { DrawerFormProps, EditionMode, EnumType, MasterData, useEnums } from 'models';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import { Box, Button, IconButton } from '@mui/material';
import { NumberInput, SelectEnum, SelectMasterData, TextList } from 'components';
import { t } from 'i18next';
import { DeleteDialog } from '../../components';
import Close from '@mui/icons-material/Close';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';

export const QuotaForm = (props: DrawerFormProps) => {
  const { managerSetup } = useStoreCache();
  const { getDataSource, getConfig } = useModelConfig();
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const { getDisciplineEntry } = useStoreCache();

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
    if (data.edition) data.edition = { id: data.edition.id };
    if (data.type) data.type = data.type.code;
    if (data.subType) data.subType = data.subType.code;
    if (data.disciplineCode) data.disciplineCode = data.disciplineCode.key;

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
      data.type = defaultValueOf(EnumType.BiographyType);
      data.subType = defaultValueOf(EnumType.PersonType);
      data.disciplineCode = null;
    } else {
      if (data.edition)
        data.edition = { id: data.edition.id, title: data.edition.name, code: data.edition.code };
      if (data.disciplineCode) data.disciplineCode = getDisciplineEntry(data.disciplineCode);
      if (data.type) data.type = getEnumValueOf(data.type, EnumType.BiographyType);
      if (data.subType) data.subType = getEnumValueOf(data.subType, EnumType.PersonType);
    }

    return data;
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      quota: Yup.number().required(t('common.required')),
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
      : `${t('actions.buttonEdit')} ${config.display}`;

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
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            <SelectMasterData
              category={MasterData.Discipline}
              field="disciplineCode"
              formik={formik}
              sticky={props.editionMode === EditionMode.Update}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.BiographyType)}
              label={t('common.type')}
              field="type"
              formik={formik}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.PersonType)}
              label={t('common.subtype')}
              field="subType"
              formik={formik}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6, lg: 6 }}>
            <NumberInput label={t('general.quota')} field="quota" formik={formik} required />
          </Grid>
          <Grid size={12}>
            <TextList label={t('general.editors')} field="editors" formik={formik} />
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
