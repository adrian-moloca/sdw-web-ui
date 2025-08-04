import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { useStoreCache } from 'hooks';
import { EntityType } from 'models';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Datepicker, SelectOptions, TextInput } from 'components';

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
    if (data.yearOfBirth) data.yearOfBirth = dayjs(data.yearOfBirth).format('YYYY');
    if (data.sex) data.sex = data.sex.value;
    if (data.colour) data.colour = data.colour.value;
    if (data.breed) data.breed = data.breed.value;
    if (data.countryOfBirth) data.countryOfBirth = data.countryOfBirth.value;
    if (data.nationality) data.nationality = data.nationality.value;

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data: any = {};
    data.editionId = managerSetup.currentEdition?.id;
    data.yearOfBirth = dayjs('1900');
    data.nationality = metadata!.nationality.options[0];
    data.countryOfBirth = metadata!.countryOfBirth.options[0];
    data.colour = metadata!.colour.options[0];
    data.sex = metadata!.sex.options[0];
    data.breed = metadata!.breed.options[0];
    data.name = '';

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
      <Grid size={{ sm: 12, md: 6, lg: 4 }}>
        <TextInput label={metadata!.name.displayName} field="name" formik={formik} required />
      </Grid>
      <Grid size={{ sm: 12, md: 4, lg: 2 }}>
        <Datepicker
          field="yearOfBirth"
          disableFuture={false}
          formik={formik}
          label={t('general.yearOfBirth')}
          views={['year']}
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6, lg: 4 }}>
        <SelectOptions
          options={metadata!.sex.options}
          field="sex"
          formik={formik}
          label={t('general.sex')}
          required
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6, lg: 4 }}>
        <SelectOptions
          options={metadata!.colour.options}
          field="colour"
          formik={formik}
          label={t('general.colour')}
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6, lg: 4 }}>
        <SelectOptions
          options={metadata!.breed.options}
          field="breed"
          formik={formik}
          label={t('general.breed')}
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
