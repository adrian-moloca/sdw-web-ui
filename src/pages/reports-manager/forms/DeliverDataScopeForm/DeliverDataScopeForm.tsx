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
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutline';
import { Box, Button, IconButton } from '@mui/material';
import {
  Datepicker,
  NumberInput,
  SelectData,
  SelectEnum,
  SelectMasterData,
  Textarea,
  TextInput,
} from 'components';
import { t } from 'i18next';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { DeleteDialog } from '../../components';
import Close from '@mui/icons-material/Close';
import baseConfig from 'baseConfig';

export const DeliverDataScopeForm = (props: DrawerFormProps) => {
  const { getEnumValueOf, getEnumValues } = useEnums();
  const { getDataSourceSetup, getDataSource, getConfig } = useModelConfig();
  const { managerSetup } = useStoreCache();
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
    if (data.edition)
      data.edition = { id: data.edition.id, name: data.edition.name, code: data.edition.code };
    if (data.status) data.status = data.status.code;
    if (data.type) data.type = data.type.code;
    if (!data.frequency || data.frequency < 1) data.frequency = 1;
    if (data.deliveryDate)
      data.deliveryDate = dayjs(data.deliveryDate)
        .format(baseConfig.generalDateFormat)
        .toUpperCase();
    if (data.scheduleDate)
      data.scheduleDate = dayjs(data.scheduleDate)
        .format(baseConfig.generalDateFormat)
        .toUpperCase();
    if (data.startDate)
      data.startDate = dayjs(data.startDate)
        .startOf('year')
        .format(baseConfig.generalDateFormat)
        .toUpperCase();
    if (data.finishDate)
      data.finishDate = dayjs(data.finishDate)
        .endOf('year')
        .format(baseConfig.generalDateFormat)
        .toUpperCase();
    if (data.scope) data.scope = data.scope.map((x: any) => x.code);

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
      competitionCategories: [],
      excludedCompetitionCategories: [],
      status: getEnumValueOf('Scheduled', EnumType.DeliveryStatus),
      startDate: dayjs().add(-20, 'year'),
      finishDate: managerSetup.currentEdition?.finishDate
        ? dayjs(managerSetup.currentEdition?.finishDate)
        : dayjs().add(1, 'year'),
      scheduleDate: dayjs().add(2, 'month'),
      frequency: 1,
      minYearlyOccurrences: 1,
      maxYearlyOccurrences: 1,
      minEstimatedCompetitions: 1,
      maxEstimatedCompetitions: 1,
      totalCompetitions: 0,
      scope: [],
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
    if (data.startDate) data.startDate = dayjs(data.startDate);
    if (data.finishDate) data.finishDate = dayjs(data.finishDate);
    if (data.scope)
      data.scope = data.scope.map((x: string) => getEnumValueOf(x, EnumType.ScopeType));

    return data;
  };

  const getInitialValues = useMemo((): any => {
    const data = { ...props.data };
    if (props.editionMode == EditionMode.Create) {
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
        contentSX={{ px: 3 }}
        secondary={
          <IconButton onClick={props.onClose}>
            <Close />
          </IconButton>
        }
      >
        <Grid container columnSpacing={1} size={12}>
          <Grid size={12}>
            <SelectData
              disablePortal={true}
              label={t('general.edition')}
              dataSource={getDataSourceSetup(EntityType.Edition)}
              field="edition"
              formik={formik}
              required
            />
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.Discipline}
              field="disciplineCode"
              formik={formik}
              disablePortal={true}
              required
              findByKey={true}
            />
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.CompetitionCategory}
              type={DataType.MultiSelect}
              field="competitionCategories"
              formik={formik}
              disablePortal={true}
              findByKey={true}
            />
          </Grid>
          <Grid size={12}>
            <SelectMasterData
              category={MasterData.CompetitionCategory}
              type={DataType.MultiSelect}
              field="excludedCompetitionCategories"
              formik={formik}
              label={t('general.excluded-competition-categories')}
              disablePortal={true}
              findByKey={true}
            />
          </Grid>
          <Grid size={12}>
            <TextInput
              label={t('general.competition-name')}
              field="competitionName"
              formik={formik}
              hint={t('messages.no-competition-categories-match')}
            />
          </Grid>
          <Grid size={12}>
            <SelectEnum
              type={DataType.MultiSelect}
              disablePortal={true}
              options={getEnumValues(EnumType.ScopeType)}
              label={t('common.scope')}
              field="scope"
              formik={formik}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6 }}>
            <Datepicker
              field="startDate"
              views={['year']}
              openTo={'year'}
              format="YYYY"
              disablePortal={true}
              formik={formik}
              label={t('common.fromYear')}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6 }}>
            <Datepicker
              field="finishDate"
              views={['year']}
              openTo={'year'}
              format="YYYY"
              disablePortal={true}
              formik={formik}
              label={t('common.toYear')}
              required
            />
          </Grid>
          <Grid size={{ sm: 6, md: 4 }}>
            <NumberInput field="frequency" formik={formik} label={t('common.frequency')} required />
          </Grid>
          <Grid size={{ sm: 6, md: 4 }}>
            <NumberInput
              field="minYearlyOccurrences"
              formik={formik}
              label={t('common.minYearlyOccurrences')}
              required
            />
          </Grid>
          <Grid size={{ sm: 6, md: 4 }}>
            <NumberInput
              field="maxYearlyOccurrences"
              formik={formik}
              label={t('common.maxYearlyOccurrences')}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6 }}>
            <Datepicker
              field="scheduleDate"
              disablePortal={true}
              disableFuture={false}
              formik={formik}
              label={t('common.scheduleDate')}
              required
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6 }}>
            <Datepicker
              field="deliveryDate"
              disablePortal={true}
              disableFuture={false}
              formik={formik}
              label={t('common.deliveryDate')}
            />
          </Grid>
          <Grid size={{ sm: 12, md: 6 }}>
            <SelectEnum
              disablePortal={true}
              options={getEnumValues(EnumType.DeliveryStatus)}
              label={t('common.status')}
              field="status"
              formik={formik}
            />
          </Grid>
          <Grid size={{ sm: 6, md: 6 }}>
            <NumberInput
              field="totalCompetitions"
              formik={formik}
              label={t('general.no-competitions')}
            />
          </Grid>
          <Grid size={{ sm: 6, md: 6 }}>
            <NumberInput
              field="minEstimatedCompetitions"
              formik={formik}
              label={`Min ${t('general.scope-competitions')}`}
              disabled
            />
          </Grid>
          <Grid size={{ sm: 6, md: 6 }}>
            <NumberInput
              field="maxEstimatedCompetitions"
              formik={formik}
              label={`Max ${t('general.scope-competitions')}`}
              disabled
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
