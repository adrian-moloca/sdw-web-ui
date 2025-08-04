import {
  DataType,
  EditionMode,
  EntityType,
  EnumType,
  IEnumProps,
  TextAlignmentEnum,
  TextStyleEnum,
  useEnums,
} from 'models';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import { Box, Button, Typography } from '@mui/material';
import { NumberInput, SelectData, SelectEnum, TextInput } from 'components';
import { t } from 'i18next';
import { humanize, isDevelopment, Logger } from '_helpers';
import useApiService from 'hooks/useApiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteDialog } from '../../components';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useModelConfig } from 'hooks';

type Props = {
  data: any;
  section?: any;
  editionMode: EditionMode;
  onClose: () => void;
};

export const FieldForm = (props: Props) => {
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.ReportField);
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const [deleteDialog, setDeleteDialog] = useState(false);

  const url =
    props.editionMode == EditionMode.Create
      ? `${getDataSource(config.type).url}/create`
      : getDataSource(config.type).url;
  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.put(url, updateData),
    onSuccess: () => {
      props.onClose();
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${props.section?.id}_view`] });
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
    if (data.section) data.section = { id: data.section.id };
    if (data.format) data.format = data.format.code;
    if (data.style) data.style = data.style.code;
    if (data.headerStyle) data.headerStyle = data.headerStyle.code;
    if (data.alignment) data.alignment = data.alignment.map((x: IEnumProps) => x.code);
    if (data.headerAlignment)
      data.headerAlignment = data.headerAlignment.map((x: IEnumProps) => x.code);
    if (data.settings) data.settings = data.settings.map((x: IEnumProps) => x.code);

    return data;
  };

  const createModeInitialValues = (baseData: any) => {
    return {
      ...baseData,
      column: null,
      section: { id: props.section.id, title: props.section.name, code: props.section.code },
      format: defaultValueOf(EnumType.DisplayFormat),
      style: defaultValueOf(EnumType.TextStyle),
      headerStyle: getEnumValueOf(TextStyleEnum.Bold, EnumType.TextStyle),
      summaryStyle: defaultValueOf(EnumType.TextStyle),
      settings: [],
      alignment: [
        getEnumValueOf(TextAlignmentEnum.Left, EnumType.TextAlignment),
        getEnumValueOf(TextAlignmentEnum.Middle, EnumType.TextAlignment),
      ],
      headerAlignment: [
        getEnumValueOf(TextAlignmentEnum.Left, EnumType.TextAlignment),
        getEnumValueOf(TextAlignmentEnum.Middle, EnumType.TextAlignment),
      ],
      summaryAlignment: [],
      order: 1,
    };
  };

  const initializeEditModeValues = (baseData: any) => {
    const data = { ...baseData };

    data.column = null;
    data.section = { id: props.section.id, title: props.section.name, code: props.section.code };

    if (data.format) data.format = getEnumValueOf(data.format, EnumType.DisplayFormat);
    if (data.style) data.style = getEnumValueOf(data.style, EnumType.TextStyle);
    if (data.headerStyle) data.headerStyle = getEnumValueOf(data.headerStyle, EnumType.TextStyle);
    if (data.summaryStyle)
      data.summaryStyle = getEnumValueOf(data.summaryStyle, EnumType.TextStyle);
    if (data.alignment)
      data.alignment = data.alignment.map((x: string) => getEnumValueOf(x, EnumType.TextAlignment));
    if (data.headerAlignment)
      data.headerAlignment = data.headerAlignment.map((x: string) =>
        getEnumValueOf(x, EnumType.TextAlignment)
      );
    if (data.summaryAlignment)
      data.summaryAlignment = data.summaryAlignment.map((x: string) =>
        getEnumValueOf(x, EnumType.TextAlignment)
      );
    if (data.settings)
      data.settings = data.settings.map((x: string) => getEnumValueOf(x, EnumType.FieldSettings));

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const baseData = { ...props.data };

    if (props.editionMode == EditionMode.Create) {
      return createModeInitialValues(baseData);
    }
    return initializeEditModeValues(baseData);
  }, [props.data, props.editionMode, props.section]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      displayName: Yup.string()
        .min(1, 'The Header Name must be at least 1 characters long')
        .required(t('common.required')),
      order: Yup.number().required().moreThan(0, 'Order should not be zero or less than zero'),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  if (props.editionMode === EditionMode.Detail) return null;

  if (props.editionMode === EditionMode.Update && !props.data) return null;

  const dataSource = props.section.dataSource;
  const title =
    props.editionMode === EditionMode.Create
      ? `${t('actions.create-new')} ${config.display}`
      : `${t('actions.buttonEdit')} ${props.data[config.displayAccessor]} ${config.display}`;

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <MainCard size="small" divider={false} border={false} title={title} headerSX={{ py: 0.5 }}>
        <Grid container spacing={2} size={12}>
          <Grid size={12}>
            <SelectData
              label={t('general.tableColumn')}
              field="columnName"
              formik={formik}
              textField="columnName"
              keyField="columnName"
              findByKey={props.editionMode === EditionMode.Update}
              dataSource={{
                url: `${getDataSource(EntityType.ReportSource).url}/schemas/${dataSource.schema}/tables/${dataSource.tableName}/columns`,
                queryKey: `${dataSource.schema}${dataSource.tableName}`,
                apiVersion: 'filter',
              }}
              onChange={(value: any) => {
                if (value) {
                  formik.setFieldValue('columnName', value.columnName);
                  formik.setFieldValue('displayName', humanize(value.columnName));
                  formik.setFieldValue('columnType', value.dataType);
                }
              }}
            />
            <Typography
              variant="body2"
              sx={{ px: 2 }}
            >{`${t('general.columnInfo')}: ${formik.values.columnName} (${formik.values.columnType})`}</Typography>
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 3, lg: 2 }}>
            <NumberInput label={t('general.order')} field="order" formik={formik} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 8, md: 5, lg: 6 }}>
            <TextInput label={`Header ${t('common.name')}`} field="displayName" formik={formik} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
            <SelectEnum
              options={getEnumValues(EnumType.DisplayFormat)}
              label={t('common.format')}
              field="format"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextStyle)}
              label={t('common.style')}
              field="style"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8, lg: 4 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextAlignment)}
              type={DataType.MultiSelect}
              label={t('common.alignment')}
              field="alignment"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextStyle)}
              label={`Header ${t('common.style')}`}
              field="headerStyle"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8, lg: 4 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextAlignment)}
              type={DataType.MultiSelect}
              label={`Header ${t('common.alignment')}`}
              field="headerAlignment"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextStyle)}
              label={`Summary ${t('common.style')}`}
              field="summaryStyle"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8, lg: 4 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextAlignment)}
              type={DataType.MultiSelect}
              label={`Summary ${t('common.alignment')}`}
              field="summaryAlignment"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
            <SelectEnum
              options={getEnumValues(EnumType.FieldSettings)}
              type={DataType.MultiSelect}
              label={t('common.settings')}
              field="settings"
              formik={formik}
            />
          </Grid>
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
            {props.editionMode == EditionMode.Update && (
              <Button
                startIcon={<DeleteOutline />}
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
        </Grid>
      </MainCard>
      <DeleteDialog
        onClose={() => setDeleteDialog(false)}
        data={props.data}
        type={config.type}
        open={deleteDialog}
      />
    </Box>
  );
};
