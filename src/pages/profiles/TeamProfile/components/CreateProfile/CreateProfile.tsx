import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Button } from '@mui/material';
import { useStoreCache } from 'hooks';
import { EntityType } from 'models';
import { SelectOptions, TextInput } from 'components';

type Props = {
  type: EntityType;
  disciplines: Array<any>;
  onCreate: (dataItem: any) => void;
};

export const CreateProfile = (props: Props) => {
  const { getMetadata, managerSetup } = useStoreCache();
  const metadata = getMetadata(props.type);

  const handleSubmit = async (dataItem: any) => {
    const data = formatOutput(dataItem);
    props.onCreate(data);
  };

  const formatOutput = (dataItem: any): any => {
    const data = { ...dataItem };
    if (data.gender) data.gender = data.gender.value;
    if (data.type) data.type = data.type.value;
    if (data.sportDisciplineId) data.sportDisciplineId = data.sportDisciplineId.value;
    if (data.nationality) data.nationality = data.nationality.value;

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data: any = {};
    data.editionId = managerSetup.currentEdition?.id;
    data.nationality = metadata!.nationality.options[0];
    data.gender = metadata!.gender.options[0];
    data.type = metadata!.type.options[0];
    data.name = '';
    if (props.disciplines.length > 0)
      data.sportDisciplineId = metadata!.sportDisciplineId.options.find(
        (x) => x.value === props.disciplines[0]
      );

    return data;
  }, []);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t('message.string-3-characters-long'))
        .required(t('common.required')),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  return (
    <Grid container spacing={2} size={12} component="form" onSubmit={formik.handleSubmit}>
      <Grid size={{ sm: 12, md: 6, lg: 5 }}>
        <TextInput label={metadata!.name.displayName} field="name" formik={formik} required />
      </Grid>
      <Grid size={{ sm: 12, md: 6, lg: 3 }}>
        <SelectOptions
          options={metadata!.gender.options}
          field="gender"
          formik={formik}
          label={t('common.gender')}
          required
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6, lg: 4 }}>
        <SelectOptions
          options={metadata!.nationality.options}
          field="nationality"
          formik={formik}
          label={t('common.nationality')}
          required
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6, lg: 4 }}>
        <SelectOptions
          options={metadata!.sportDisciplineId.options}
          field="sportDisciplineId"
          formik={formik}
          label={t('general.discipline')}
          required
        />
      </Grid>
      <Grid size={12}>
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
  );
};
