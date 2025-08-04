import {
  BlockTypeEnum,
  DataType,
  EditionMode,
  EntityType,
  EnumType,
  IEnumProps,
  TextAlignmentEnum,
  useEnums,
} from 'models';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Box, Button } from '@mui/material';
import { NumberInput, SelectEnum, TextInput, TextRichInput } from 'components';
import { t } from 'i18next';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteDialog } from 'pages/reports-manager/components';
import DeleteOutlined from '@mui/icons-material/DeleteOutline';

type Props = {
  data: any;
  section?: any;
  editionMode: EditionMode;
  onClose: () => void;
};

export const BlockForm = (props: Props) => {
  const { getDataSource, getConfig } = useModelConfig();
  const { getEnumValueOf, getEnumValues, defaultValueOf } = useEnums();
  const { dataInfo } = useStoreCache();
  const config = getConfig(EntityType.ReportBlock);
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
    if (data.type) data.type = data.type.code;
    if (data.alignment) data.alignment = data.alignment.map((x: IEnumProps) => x.code);
    if (data.style) data.style = data.style.map((x: IEnumProps) => x.code);

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data = { ...props.data };
    if (props.editionMode == EditionMode.Create) {
      data.section = { id: props.section.id, title: props.section.name, code: props.section.code };
      data.type = defaultValueOf(EnumType.BlockType);
      data.alignment = [
        getEnumValueOf(TextAlignmentEnum.Left, EnumType.TextAlignment),
        getEnumValueOf(TextAlignmentEnum.Middle, EnumType.TextAlignment),
      ];
      data.style = [defaultValueOf(EnumType.TextStyle)];
      data.order = 1;
      data.value = '';
    } else {
      data.section = { id: props.section.id, title: props.section.name, code: props.section.code };
      if (data.type) data.type = getEnumValueOf(data.type, EnumType.BlockType);
      if (data.alignment)
        data.alignment = data.alignment.map((x: string) =>
          getEnumValueOf(x, EnumType.TextAlignment)
        );
      if (data.style)
        data.style = data.style.map((x: string) => getEnumValueOf(x, EnumType.TextStyle));
    }

    return data;
  }, [props.data, props.editionMode, props.section]);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      value: Yup.string()
        .min(2, t('messages.the-string-must-be-at-least-2-characters-long'))
        .required(t('common.required')),
      order: Yup.number()
        .required()
        .moreThan(0, t('messages.order-should-not-be-zero-or-less-than-zero')),
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
      <MainCard size="small" divider={false} border={false} title={title} headerSX={{ py: 0.5 }}>
        <Grid container spacing={2} size={12}>
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2 }}>
            <SelectEnum
              options={getEnumValues(EnumType.BlockType)}
              required
              label={t('common.type')}
              field="type"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8, lg: 5 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextAlignment)}
              type={DataType.MultiSelect}
              label={t('common.alignment')}
              field="alignment"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
            <SelectEnum
              options={getEnumValues(EnumType.TextStyle)}
              type={DataType.MultiSelect}
              label={t('common.style')}
              field="style"
              formik={formik}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 3, lg: 2 }}>
            <NumberInput label={t('general.order')} field={'order'} formik={formik} required />
          </Grid>
          <Grid size={{ xs: 8, sm: 8, md: 9, lg: 10 }}>
            {formik.values.type.code == BlockTypeEnum.HTML ? (
              <TextRichInput field="value" formik={formik} required />
            ) : (
              <TextInput
                label="Value"
                field="value"
                formik={formik}
                required
                hint={`${t('messages.hint-please-use-a-combination-of-theses-values-between-brackets')}: ${dataInfo.metaFields.map((x: any) => x.code).join(', ')}`}
              />
            )}
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
