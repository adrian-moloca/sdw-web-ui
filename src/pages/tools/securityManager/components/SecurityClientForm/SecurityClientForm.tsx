import useApiService from 'hooks/useApiService';
import { DataType, DrawerFormProps, EditionMode, MasterData } from 'models';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback } from 'react';
import { isDevelopment, Logger } from '_helpers';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import { Box, Button, IconButton, Typography } from '@mui/material';
import {
  CheckboxGenericGroup,
  SelectMasterData,
  SelectSource,
  Textarea,
  TextInput,
} from 'components';
import { t } from 'i18next';
import Close from '@mui/icons-material/Close';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useModelConfig } from 'hooks';
import { apiConfig } from 'config/app.config';
import { ClientFormNote } from './ClientNote';
import { SecurityScopes } from '../config';

export const SecurityClientForm = (props: DrawerFormProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const urlRun = `${apiConfig.toolsEndPoint}/security/build`;
  const url =
    props.editionMode == EditionMode.Create
      ? `${apiConfig.toolsEndPoint}/security/clients/create`
      : `${apiConfig.toolsEndPoint}/security/clients/update`;

  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.post(url, updateData),
    onSuccess: async () => {
      await apiService.post(urlRun);
      queryClient.invalidateQueries({ queryKey: ['security-clients'] });
      queryClient.invalidateQueries({ queryKey: ['security-users'] });
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
    const data = {
      id: dataItem.clientId,
      clientName: dataItem.clientName,
      mail: dataItem.mail,
      description: dataItem.description,
      groups: [
        ...dataItem.operationsProfiles,
        ...dataItem.categories,
        ...dataItem.countries,
        ...dataItem.disciplines,
        ...(dataItem.sources?.map((x: any) => `SRC$${x}`) ?? []),
      ],
    };
    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data.data };

    if (props.editionMode == EditionMode.Create) {
      data.clientName = '';
      data.mail = '';
      data.description = '';
      data.operationsProfiles = ['DATA_READER'];
      data.categories = [];
      data.disciplines = [];
      data.countries = [];
      data.sources = [];
    } else {
      data.id = props.data.clientId;
      data.categories = data.dataProfiles.filter((x: string) =>
        x.startsWith(MasterData.CompetitionCategory)
      );
      data.disciplines = data.dataProfiles.filter((x: string) =>
        x.startsWith(MasterData.Discipline)
      );
      data.countries = data.dataProfiles.filter((x: string) => x.startsWith(MasterData.Country));
      data.sources = data.dataProfiles
        .filter((x: string) => x.startsWith('SRC'))
        .map((x: string) => x.replace('SRC$', ''));
    }
    return data;
  }, [props.data, props.type, props.editionMode]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      clientName: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      mail: Yup.string().email(t('messages.invalid-email')).required(t('common.required')),
      operationsProfiles: Yup.array()
        .of(Yup.string().required())
        .min(1, t('messages.at-least-one-profile-is-required')),
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
      : `${t('actions.buttonEdit')} ${props.data.data[config.displayAccessor]}`;

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
        <Grid container spacing={1} size={12}>
          <Grid size={12}>
            <TextInput
              label={t('general.clientName')}
              field="clientName"
              formik={formik}
              required
              disabled={props.editionMode === EditionMode.Update}
              hint={
                props.editionMode == EditionMode.Create
                  ? t('security-manager.hints.clientName')
                  : undefined
              }
            />
          </Grid>
          <Grid size={12}>
            <TextInput
              label={t('general.email')}
              field="mail"
              formik={formik}
              required={props.editionMode == EditionMode.Create}
              hint={t('security-manager.hints.clientEmail')}
            />
          </Grid>
          <Grid size={12}>
            <Textarea
              label={`${t('common.description')}/${t('common.warnings')}`}
              field="description"
              formik={formik}
              required={props.editionMode == EditionMode.Create}
            />
          </Grid>
          <Grid size={12} sx={{ mt: 1, px: 2, py: 1, border: '1px solid #ccc', borderRadius: 1 }}>
            <CheckboxGenericGroup
              label={t('common.operationsProfile')}
              field="operationsProfiles"
              formik={formik}
              required
              options={SecurityScopes}
            />
          </Grid>
          <Grid size={12} sx={{ mt: 1 }}>
            <Typography color="text.secondary">{t('common.dataProfile')}</Typography>
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.CompetitionCategory}
              field={'categories'}
              formik={formik}
              findByKey={true}
              label={t('general.competitionCategories')}
              disablePortal={true}
              type={DataType.MultiSelect}
            />
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.Discipline}
              field={'disciplines'}
              formik={formik}
              findByKey={true}
              disablePortal={true}
              label={t('general.disciplines')}
              type={DataType.MultiSelect}
            />
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.Country}
              field={'countries'}
              formik={formik}
              findByKey={true}
              disablePortal={true}
              label={t('general.countries')}
              type={DataType.MultiSelect}
            />
          </Grid>
          <Grid size={12}>
            <SelectSource
              field={'sources'}
              formik={formik}
              findByKey={true}
              disablePortal={true}
              label={t('general.sources')}
              type={DataType.MultiSelect}
            />
          </Grid>
        </Grid>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
          <Button
            startIcon={<CancelOutlined />}
            disableElevation
            variant="outlined"
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
            disabled={!formik.isValid || mutation.isPending}
          >
            {t('actions.buttonSave')}
          </Button>
        </Grid>
        <ClientFormNote mode={props.editionMode} />
      </MainCard>
    </Box>
  );
};
