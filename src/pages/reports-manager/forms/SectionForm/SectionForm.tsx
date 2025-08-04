import useApiService from 'hooks/useApiService';
import {
  ContentTypeEnum,
  DataType,
  EditionMode,
  EntityType,
  Entry,
  EnumType,
  IEnumProps,
  MasterData,
  useEnums,
} from 'models';
import * as Yup from 'yup';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Box, Button, Divider, Typography } from '@mui/material';
import {
  Checkbox,
  Datepicker,
  NumberInput,
  SelectCategory,
  SelectData,
  SelectEnum,
  SelectMasterData,
  SelectSource,
  TextInput,
} from 'components';
import { t } from 'i18next';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import DeleteOutlined from '@mui/icons-material/DeleteOutline';
import { CloneDialog, DeleteDialog } from '../../components';
import dayjs from 'dayjs';

type Props = {
  data: any;
  variation?: any;
  type: EntityType;
  editionMode: EditionMode;
  sectionType?: IEnumProps;
  onClose: () => void;
};

export const SectionForm = (props: Props) => {
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const { getDataSource, getDataSourceSetup } = useModelConfig();
  const { getDisciplineEntry, getMasterDataValue, getSourceEntry } = useStoreCache();
  const { getConfig } = useModelConfig();
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
      queryClient.invalidateQueries({ queryKey: [`${props.variation.id}_view`] });
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
    data.variation = {
      id: props.variation.id,
      name: props.variation.name,
      code: props.variation.code,
    };
    if (data.startDate) data.startDate = dayjs(data.startDate).format('YYYY-MM-DD');
    if (data.finishDate) data.finishDate = dayjs(data.finishDate).format('YYYY-MM-DD');
    if (data.dataSource) data.dataSource = { id: data.dataSource.id };
    if (data.availability) data.availability = data.availability.code;
    if (data.type) data.type = data.type.code;
    if (data.section) data.section = data.section.code;
    if (data.disciplines) data.disciplines = data.disciplines.map((x: any) => x.key);
    if (data.genders) data.genders = data.genders.map((x: any) => x.key);
    if (data.sources) data.sources = data.sources.map((x: any) => x.code);
    if (data.participantTypes)
      data.participantTypes = data.participantTypes.map((x: IEnumProps) => x.code);
    data.blocks = [];
    data.fields = [];

    return data;
  };

  const createModeInitialValues = (data: any) => {
    return {
      ...data,
      dataSource: {},
      type: defaultValueOf(EnumType.ContentType),
      availability: defaultValueOf(EnumType.DataStatus),
      section: props.sectionType ?? defaultValueOf(EnumType.SectionType),
      order: 1,
      startDate: null,
      finishDate: null,
      displayName: `${data.section.text} ${data.order} (${data.type.text.toLowerCase()})`,
      disciplines: props.variation.disciplines
        ? props.variation.disciplines.map((x: string) => getDisciplineEntry(x))
        : [],
      genders: [],
      eventTypes: [],
      categories: [],
      sources: [],
      blocks: [],
      description: null,
    };
  };

  const editModeInitialValues = (data: any) => {
    const processedData = { ...data };

    if (processedData.startDate) processedData.startDate = dayjs(processedData.startDate);
    if (processedData.finishDate) processedData.finishDate = dayjs(processedData.finishDate);
    if (processedData.variation) {
      processedData.variation = {
        id: processedData.variation.id,
        title: processedData.variation.name,
        code: processedData.variation.code,
      };
    }

    if (processedData.dataSource) {
      processedData.dataSource = {
        id: processedData.dataSource.id,
        title: processedData.dataSource.displayName,
        code: processedData.dataSource.code,
      };
    }

    if (processedData.section)
      processedData.section = getEnumValueOf(processedData.section, EnumType.SectionType);
    if (processedData.type)
      processedData.type = getEnumValueOf(processedData.type, EnumType.ContentType);
    if (processedData.availability)
      processedData.availability = getEnumValueOf(processedData.availability, EnumType.DataStatus);

    if (processedData.participantTypes)
      processedData.participantTypes = processedData.participantTypes.map((x: string) =>
        getEnumValueOf(x, EnumType.ReportParticipantType)
      );
    processedData.disciplines = processedData.disciplines
      ? processedData.disciplines.map((x: string) => getDisciplineEntry(x))
      : [];
    processedData.genders = processedData.genders
      ? processedData.genders.map((x: string) => getMasterDataValue(x, MasterData.SportGender))
      : [];
    processedData.eventTypes = processedData.eventTypes
      ? processedData.eventTypes.map((x: string) => getMasterDataValue(x, MasterData.EventType))
      : [];
    processedData.sources = processedData.sources
      ? processedData.sources.map((x: string) => getSourceEntry(x))
      : [];
    processedData.categories = processedData.categories ?? [];

    return processedData;
  };

  const getInitialValues = useCallback((): any => {
    const baseData = {
      ...props.data,
      variation: {
        id: props.variation.id,
        title: props.variation.name,
        code: props.variation.code,
      },
    };

    if (props.editionMode === EditionMode.Create) {
      return createModeInitialValues(baseData);
    }
    editModeInitialValues(baseData);
  }, [props.data, props.type, props.editionMode, props.variation]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      displayName: Yup.string()
        .min(5, 'The string must be at least 5 characters long')
        .required(t('common.required')),
      order: Yup.number().required().moreThan(0, 'Order should not be zero or less than zero'),
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
      <MainCard size="small" title={title} divider={false} border={false}>
        <Grid container spacing={2} size={12}>
          <Grid size={{ xs: 4, sm: 4, md: 3, lg: 3 }}>
            <NumberInput
              label={t('general.order')}
              field="order"
              formik={formik}
              required
              onChange={(e: any) =>
                formik.setFieldValue(
                  'displayName',
                  `${formik.values.section.text} ${e} (${formik.values.type.text.toLowerCase()})`
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 3 }}>
            <SelectEnum
              options={getEnumValues(EnumType.SectionType)}
              required
              label={t('general.section')}
              field="section"
              formik={formik}
              onChange={(e: any) =>
                formik.setFieldValue(
                  'displayName',
                  `${e.text} ${formik.values.order} (${formik.values.type.text.toLowerCase()})`
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 3 }}>
            <SelectEnum
              options={getEnumValues(EnumType.ContentType)}
              required
              label={t('common.type')}
              field="type"
              formik={formik}
              onChange={(e: any) =>
                formik.setFieldValue(
                  'displayName',
                  `${formik.values.section.text} ${formik.values.order} (${e.text.toLowerCase()})`
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 6, lg: 3 }}>
            <SelectEnum
              options={getEnumValues(EnumType.DataStatus)}
              required
              label={t('common.availability')}
              field="availability"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
            <TextInput label={t('common.name')} field="displayName" formik={formik} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 8 }}>
            <TextInput label={t('common.description')} field="description" formik={formik} />
          </Grid>
          {(formik.values.type.code == ContentTypeEnum.Table ||
            formik.values.type.code == ContentTypeEnum.LoopTable) && (
            <>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <SelectData
                  label={t('general.reportSource')}
                  dataSource={getDataSourceSetup(EntityType.ReportSource)}
                  field="dataSource"
                  formik={formik}
                  required={[ContentTypeEnum.Table, ContentTypeEnum.LoopTable].includes(
                    formik.values.type.code
                  )}
                  //sticky={props.editionMode == EditionMode.Update && formik.values.dataSource}
                />
              </Grid>
              {formik.values.type.code == ContentTypeEnum.LoopTable && (
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                  <SelectData
                    label={t('general.tableColumn')}
                    field="delimiterField"
                    formik={formik}
                    textField="columnName"
                    keyField="columnName"
                    findByKey={props.editionMode === EditionMode.Update}
                    disabled={!formik.values.dataSource?.id}
                    dataSource={{
                      url: `${getDataSource(EntityType.ReportSource).url}/${formik.values.dataSource?.id}/columns`,
                      queryKey: `${formik.values.dataSource?.id}columns`,
                      apiVersion: 'filter',
                    }}
                    onChange={(value: any) => {
                      if (value) {
                        formik.setFieldValue('delimiterField', value.columnName);
                      }
                    }}
                  />
                </Grid>
              )}
              <Grid size={12}>
                <Divider>
                  <Typography variant="h5">{t('general.filters')}</Typography>
                </Divider>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <SelectMasterData
                  category={MasterData.Discipline}
                  type={DataType.MultiSelect}
                  field="disciplines"
                  formik={formik}
                  group={true}
                  onChange={() => {
                    formik.setFieldValue('eventTypes', []);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <SelectMasterData
                  category={MasterData.SportGender}
                  type={DataType.MultiSelect}
                  field="genders"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <SelectMasterData
                  category={MasterData.EventType}
                  type={DataType.MultiSelect}
                  field="eventTypes"
                  formik={formik}
                  filter={(x: Entry | undefined) =>
                    formik.values?.discipline?.some((d: Entry) =>
                      x?.key?.startsWith(
                        d?.key?.replace(MasterData.Discipline, MasterData.EventType)
                      )
                    ) || false
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <SelectCategory type={DataType.MultiSelect} field="categories" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <SelectSource type={DataType.MultiSelect} field="sources" formik={formik} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <SelectEnum
                  options={getEnumValues(EnumType.ReportParticipantType)}
                  type={DataType.MultiSelect}
                  label={t('general.participationTypes')}
                  field="participantTypes"
                  formik={formik}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <Datepicker
                  field="startDate"
                  disableFuture={false}
                  formik={formik}
                  label={t('common.startDate')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <Datepicker
                  field="finishDate"
                  disableFuture={false}
                  formik={formik}
                  label={t('common.finishDate')}
                />
              </Grid>
            </>
          )}
          <Grid size={6}>
            <TextInput
              label={t('common.emptyDataMessage')}
              field="emptyDataMessage"
              formik={formik}
            />
          </Grid>
          <Grid size={6}>
            <Checkbox label="Hide Empty Columns" field="hideEmptyColumns" formik={formik} />
          </Grid>
        </Grid>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
          {props.editionMode == EditionMode.Update && (
            <>
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
              <Button
                startIcon={<ContentCopyTwoToneIcon />}
                disableElevation
                variant="outlined"
                color="secondary"
                onClick={() => setCloneDialog(true)}
              >
                {t('actions.buttonClone')}
              </Button>
            </>
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
      <CloneDialog
        onClose={() => setCloneDialog(false)}
        data={props.data}
        type={props.type}
        open={cloneDialog}
      />
    </Box>
  );
};
