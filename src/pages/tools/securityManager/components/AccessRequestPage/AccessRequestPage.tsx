import { Box, Button, Grid, Typography } from '@mui/material';
import { PageContainer, useDialogs } from '@toolpad/core';
import { t } from 'i18next';
import { MasterFooter } from 'layout/MasterFooter';
import bannerOg from 'assets/images/SDW_Locations.avif';
import { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Checkbox,
  CheckboxGenericGroup,
  Datepicker,
  NumberInput,
  RadioGroup,
  SelectMasterData,
  SelectSource,
  Textarea,
  TextInput,
  TypographyLink,
} from 'components';
import { MasterData, DataType, EntityType } from 'models';
import dayjs from 'dayjs';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useNavigate } from 'react-router-dom';
import { UserLisField } from './UserLisField';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { apiConfig } from 'config/app.config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isDevelopment, Logger } from '_helpers';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { useAccessRequestData } from '../useAccessRequestData';

const AccessRequestPage = () => {
  const navigate = useNavigate();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.AccessRequest);
  const auth = useSelector((x: RootState) => x.auth);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const dialogs = useDialogs();
  const { dataAccessOptions, operationAccessOptions, accessTypeOptions, environmentOptions } =
    useAccessRequestData();
  const url = `${apiConfig.toolsEndPoint}${config.apiNode}/create`;
  const environment = import.meta.env.VITE_FORGEROCK_REALM;
  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.post(url, updateData, true),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['security-requests'] });
      await dialogs.alert(t('access-request.request-submitted'));
      navigate(-1);
    },
    onError: (error: any) => error,
  });
  const getInitialValues = useCallback((): any => {
    const data = {
      name: auth.user?.fullName ?? '',
      email: auth.user?.email ?? '',
      role: '',
      organization: '',
      manager: '',
      categories: [],
      disciplines: [],
      countries: [],
      sources: [],
      comments: '',
      type: 'web',
      typeContext: '',
      usageType: '',
      acceptTerms: false,
      multiple: false,
      environments: [environment ?? 'dev'],
      dataType: ['OLYMPIC_RESULTS'],
      operationType: ['DATA_READ_ONLY'],
      purpose: '',
      startDate: dayjs(),
      endDate: dayjs().add(1, 'year'),
      volumePerHour: 100,
      peakUsage: '',
      updatedBy: auth.user?.fullName ?? '',
      users: [],
    };

    return data;
  }, []);

  const handleSubmit = async (dataItem: any) => {
    const data = {
      ...dataItem,
      startDate: dataItem.startDate ? dayjs(dataItem.startDate).format('YYYY-MM-DD') : null,
      endDate: dataItem.endDate ? dayjs(dataItem.endDate).format('YYYY-MM-DD') : null,
      updatedBy: auth.user?.fullName ?? dataItem.name,
    };
    try {
      await mutation.mutateAsync(data);
    } catch {
      if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
    }
  };

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      acceptTerms: Yup.boolean().oneOf([true], t('access-request.accepting-the-terms-message')),
      email: Yup.string().email(t('messages.invalid-email')).required(t('common.required')),
      startDate: Yup.date().required(t('common.required')),
      endDate: Yup.date().required(t('common.required')),
      role: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      manager: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      purpose: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      typeContext: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      usageType: Yup.string()
        .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      organization: Yup.string()
        .min(2, t('message.the-string-must-be-at-least-3-characters-long'))
        .required(t('common.required')),
      operationType: Yup.array()
        .of(Yup.string().required(t('common.required')))
        .min(1, t('messages.at-least-one-profile-is-required')),
      dataType: Yup.array()
        .of(Yup.string().required(t('common.required')))
        .min(1, t('messages.at-least-one-profile-is-required')),
      users: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .min(3, t('message.the-string-must-be-at-least-3-characters-long'))
            .max(50, 'Name is too long!')
            .required(t('common.required')),
          email: Yup.string().email(t('messages.invalid-email')).required(t('common.required')),
        })
      ),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  return (
    <PageContainer
      maxWidth="xl"
      title={t('access-request.title')}
      breadcrumbs={
        auth.isAuthorized
          ? [
              { title: t('navigation.Tools'), path: '/' },
              { title: t('navigation.SecurityManager'), path: '/tools/security-manager' },
            ]
          : []
      }
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <img
            src={bannerOg}
            alt={t('main.project.name')}
            style={{
              height: 'auto',
              width: '100%',
              maxHeight: 340,
              objectFit: 'cover',
              borderRadius: 5,
            }}
          />
        </Grid>
        <Grid size={12}>
          <Typography lineHeight={1.1}>{t('access-request.fillup-form')}</Typography>
          <Typography>{t('access-request.requirement-warning')}</Typography>
        </Grid>
        <Grid size={12}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            border={1}
            borderColor="divider"
            p={2}
            borderRadius={5}
          >
            <Grid container columnSpacing={1}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  label={t('access-request.your-name')}
                  field="name"
                  formik={formik}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput label={t('general.email')} field="email" formik={formik} size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  label={t('access-request.role')}
                  field="role"
                  formik={formik}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  label={t('access-request.organization')}
                  field="organization"
                  formik={formik}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  label={t('access-request.manager')}
                  field="manager"
                  formik={formik}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Checkbox formik={formik} field="multiple" label={t('access-request.multiple')} />
              </Grid>
              {formik.values.multiple && (
                <Grid size={12}>
                  <Box border={1} borderColor="divider" borderRadius={2} p={2} my={0.5}>
                    <UserLisField field={'users'} formik={formik} />
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 12, md: 6 }}>
                <RadioGroup
                  label={t('access-request.type')}
                  field="type"
                  formik={formik}
                  required
                  size="small"
                  direction="row"
                  findByKey={true}
                  options={accessTypeOptions}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  label={t('access-request.typeContext')}
                  field="typeContext"
                  formik={formik}
                  required
                  size="small"
                  hint={t('access-request.typeContext-hint')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CheckboxGenericGroup
                  label={t('access-request.dataType')}
                  field="dataType"
                  formik={formik}
                  options={dataAccessOptions}
                  size="small"
                  hint={t('access-request.dataType-hint')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CheckboxGenericGroup
                  label={t('access-request.operationType')}
                  field="operationType"
                  formik={formik}
                  required
                  options={operationAccessOptions}
                  size="small"
                  hint={t('access-request.operationType-hint')}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <Datepicker
                  label={t('access-request.startDate')}
                  field="startDate"
                  formik={formik}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <Datepicker
                  label={t('access-request.endDate')}
                  field="endDate"
                  formik={formik}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <NumberInput
                  label={t('access-request.volumePerHour')}
                  field="volumePerHour"
                  formik={formik}
                  required={formik.values.type !== 'web'}
                  size="small"
                  hint={t('access-request.volumePerHour-hint')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextInput
                  label={t('access-request.peakUsage')}
                  field="peakUsage"
                  formik={formik}
                  required={formik.values.type !== 'web'}
                  size="small"
                  hint={t('access-request.peakUsage-hint')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CheckboxGenericGroup
                  label={t('access-request.environments')}
                  field="environments"
                  formik={formik}
                  required
                  options={environmentOptions}
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextInput
                  label={t('access-request.purpose')}
                  field="purpose"
                  required
                  formik={formik}
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextInput
                  label={t('access-request.usageType')}
                  field="usageType"
                  formik={formik}
                  required
                  size="small"
                  hint={t('access-request.usageType-hint')}
                />
              </Grid>
              <Grid size={12}>
                <Textarea label={t('access-request.comments')} field="comments" formik={formik} />
              </Grid>
              <Grid size={12}>
                <Typography color="text.secondary" variant="body1">
                  {t('access-request.data-restrictions-title')}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectMasterData
                  category={MasterData.CompetitionCategory}
                  field={'categories'}
                  size="small"
                  formik={formik}
                  findByKey={true}
                  anonymous={true}
                  label={t('general.competitionCategories')}
                  type={DataType.MultiSelect}
                  hint={t('access-request.category_hint')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectMasterData
                  category={MasterData.Discipline}
                  field={'disciplines'}
                  size="small"
                  formik={formik}
                  findByKey={true}
                  anonymous={true}
                  label={t('general.disciplines')}
                  type={DataType.MultiSelect}
                  hint={t('access-request.disciplines_hint')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectMasterData
                  category={MasterData.Country}
                  field={'countries'}
                  size="small"
                  formik={formik}
                  findByKey={true}
                  anonymous={true}
                  label={t('general.countries')}
                  type={DataType.MultiSelect}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <SelectSource
                  field={'sources'}
                  size="small"
                  formik={formik}
                  findByKey={true}
                  anonymous={true}
                  label={t('general.sources')}
                  type={DataType.MultiSelect}
                />
              </Grid>
              <Grid size={12}>
                <RadioGroup
                  label={t('access-request.acceptTerms')}
                  field="acceptTerms"
                  formik={formik}
                  required
                  options={[
                    { value: true.toString(), label: t('common.yes') },
                    { value: false.toString(), label: t('common.no') },
                  ]}
                  size="small"
                />
                <br />
                <TypographyLink
                  value={t('terms-of-use.title')}
                  typoSize="body2"
                  sx={{ color: 'primary.main' }}
                  route={'/terms-of-use'}
                />
              </Grid>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
                <Button
                  startIcon={<CancelOutlined />}
                  disableElevation
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    navigate(-1);
                  }}
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
                  startIcon={<SendOutlinedIcon />}
                  disabled={!formik.isValid}
                >
                  {t('actions.buttonSubmitRequest')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <MasterFooter />
      </Grid>
    </PageContainer>
  );
};
export default AccessRequestPage;
