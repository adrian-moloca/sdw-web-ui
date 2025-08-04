import { isDevelopment, Logger } from '_helpers';
import useApiService from 'hooks/useApiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EntityType, EnumType, useEnums } from 'models';
import appConfig from 'config/app.config';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { Box, Button, Grid, Stack } from '@mui/material';
import { MainCard, SelectEnum, TextRichInput } from 'components';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { t } from 'i18next';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { useModelConfig } from 'hooks';

type Props = { type: EntityType; data: any };

export const NoteCreateControl = (props: Props): React.ReactElement | null => {
  const { getConfig } = useModelConfig();
  const config = getConfig(props.type);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const { getEnumValueOf, getEnumValues } = useEnums();
  const url = `${appConfig.biographiesManagerEndPoint}${config.apiNode}/${props.data.id}/notes`;

  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.put(url, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${props.data.id}_view`],
      });
    },
    onError: (error: any) => {
      return error;
    },
  });

  const handleSubmit = async (dataItem: any) => {
    const data = formatOutput(dataItem);
    try {
      await mutation.mutateAsync(data);
    } catch {
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  const formatOutput = (dataItem: any): any => {
    const data = { ...dataItem };
    if (data.type) data.type = data.type.code;
    return data;
  };

  const formik = useFormik<any>({
    initialValues: {
      date: dayjs(),
      note: '',
      type: getEnumValueOf('INFORMATION', EnumType.NoteType),
      notify: false,
    },
    validationSchema: Yup.object({
      note: Yup.string().min(10, 'The note must have a minimum length').required('Required'),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <Grid size={12}>
      <MainCard contentSX={{ paddingBottom: 0 }} size="small" border={false}>
        <Grid container size={12} component="form" onSubmit={formik.handleSubmit} spacing={1}>
          <Grid size={12}>
            <TextRichInput field="note" formik={formik} />
          </Grid>
          <Grid size={6}>
            <SelectEnum
              options={getEnumValues(EnumType.NoteType)}
              label="Note Type"
              field="type"
              formik={formik}
            />
          </Grid>
          <Grid size={6} alignContent="flex-end">
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction={'row'} sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                startIcon={<CancelOutlined />}
                disableElevation
                variant="text"
                color="secondary"
                onClick={() => formik.resetForm()}
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
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Grid>
  );
};
