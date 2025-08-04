import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { useStoreCache } from 'hooks';
import { EntityType, EnumType, useEnums } from 'models';
import { Datepicker, SelectEnum, SelectOptions, TextInput } from 'components';
import { formatAthleteName } from '_helpers';

type Props = {
  type: EntityType;
  disciplines: Array<any>;
  onCreate: (dataItem: any) => void;
};

export const CreateProfile = (props: Props) => {
  const { getDisciplineEntry, getMetadata, managerSetup } = useStoreCache();
  const { getEnumValueOf, getEnumValues } = useEnums();
  const metadata = getMetadata(props.type);

  const handleSubmit = async (dataItem: any) => {
    const data = formatOutput(dataItem);
    props.onCreate(data);
  };

  const formatOutput = (dataItem: any): any => {
    const data = { ...dataItem };
    if (data.gender) data.gender = data.gender.value;
    if (data.nationality) data.nationality = data.nationality.value;
    if (data.type) data.type = data.type.code;
    if (data.disciplines) data.disciplines = data.disciplines.map((x: any) => x.key);
    if (data.dateOfBirth) data.dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD');
    data.displayName = formatAthleteName(data);

    return data;
  };

  const getInitialValues = useCallback((): any => {
    const data: any = {};
    data.editionId = managerSetup.currentEdition?.id;
    data.nationality = metadata!.nationality.options[0];
    data.gender = metadata!.gender.options[0];
    data.type = getEnumValueOf('Athlete', EnumType.PersonType);
    data.dateOfBirth = dayjs('1900-01-01');
    data.preferredGivenName = '';
    data.preferredFamilyName = '';
    data.disciplines = props.disciplines.map((x: string) => getDisciplineEntry(x));

    return data;
  }, []);

  const formik = useFormik<any>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: Yup.object({
      preferredGivenName: Yup.string()
        .min(1, t('message.string-1-characters-long'))
        .required(t('common.required')),
      preferredFamilyName: Yup.string()
        .min(1, t('message.string-1-characters-long'))
        .required(t('common.required')),
    }),
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  return (
    <Grid container spacing={2} size={12} component="form" onSubmit={formik.handleSubmit}>
      <Grid size={{ sm: 12, md: 6 }}>
        <TextInput
          label={t('general.preferredGivenName')}
          field="preferredGivenName"
          formik={formik}
          placeholder={t('general.preferredGivenName')}
          required
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6 }}>
        <TextInput
          label={t('general.preferredFamilyName')}
          field="preferredFamilyName"
          formik={formik}
          placeholder={t('general.preferredFamilyName')}
          required
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6 }}>
        <SelectOptions
          options={metadata!.gender.options}
          field="gender"
          formik={formik}
          label={t('common.gender')}
          required
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6 }}>
        <Datepicker
          field="dateOfBirth"
          disableFuture={true}
          formik={formik}
          label={t('common.dateOfBirth')}
          required
        />
      </Grid>
      <Grid size={{ sm: 12, md: 6 }}>
        <SelectOptions
          options={metadata!.nationality.options}
          field="nationality"
          formik={formik}
          label={t('common.nationality')}
        />
      </Grid>
      <Grid size={{ sm: 6, md: 6 }}>
        <SelectEnum
          options={getEnumValues(EnumType.PersonType)}
          label={t('common.role')}
          field="type"
          formik={formik}
        />
      </Grid>
      <Grid size={12}>
        <Button
          disableElevation
          type="submit"
          color="primary"
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
