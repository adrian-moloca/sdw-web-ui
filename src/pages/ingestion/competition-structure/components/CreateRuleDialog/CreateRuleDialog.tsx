import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  DialogActions,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { NumberInput, SelectEnum, TextInput } from 'components';
import appConfig from 'config/app.config';
import { useFormik } from 'formik';
import { Logger, isDevelopment } from '_helpers';
import useApiService from 'hooks/useApiService';
import { DataType, EnumType, OdfRuleEnum, useEnums } from 'models';
import type { DialogProps } from 'types/dialog';
import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import { getPhases, getStages, getSubunits, getUnits, removeDashes } from '../../utils/structure';

interface Props extends DialogProps {
  rows: any[];
  data: any;
  width?: string;
  disciplineCode: string;
}

export const CreateRuleDialog = (props: Props) => {
  const theme = useTheme();
  const { getEnumValues, defaultValueOf } = useEnums();
  const apiService = useApiService();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();

  const url = `${appConfig.toolsEndPoint}/odf/structure/rules`;
  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.put(url, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [appConfig.toolsEndPoint] });
      props.onClickOk();
    },
    onError: () => {
      props.onClickOk();
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
    if (data.rule) data.rule = data.rule.code;
    if (data.eventCode) data.eventCode = data.eventCode.code;
    if (data.type) data.type = data.type.code;
    if (data.parentCode) data.parentCode = data.parentCode.code;
    if (data.targetCode) data.targetCode = data.targetCode.code;
    if (data.scheduleFromCode) data.scheduleFromCode = data.scheduleFromCode.code;
    if (data.nextCodes) data.nextCodes = data.nextCodes.map((x: any) => x.code);
    if (data.redirectCodes) data.redirectCodes = data.redirectCodes.map((x: any) => x.code);

    return data;
  };

  const initialValues = useMemo(
    () => ({
      rule: defaultValueOf(EnumType.OdfRule),
      targetCode: null,
      nextCodes: [],
      redirectCodes: [],
      type: '',
      parentCode: '',
      scheduleFromCode: '',
      code: '',
      description: '',
      order: 1,
    }),
    [props.visible]
  );

  const formik = useFormik<any>({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values: any) => {
      handleSubmit(values);
    },
  });

  const events = props.data.events.map((x: any) => ({
    id: x.description,
    code: x.code,
    text: x.code,
    color: '',
    description: x.description,
    order: x.order,
  }));

  const stages = getStages(props.data).map((x: any) => ({
    id: x.code,
    code: x.code,
    text: x.code,
    color: '',
  }));

  const phases = getPhases(props.data).map((x: any) => ({
    id: x.code,
    code: x.code,
    text: x.code,
    color: '',
  }));

  const units = getUnits(props.data).map((x: any) => ({
    id: x.code,
    code: x.code,
    text: x.code,
    color: '',
  }));

  const subunits = getSubunits(props.data).map((x: any) => ({
    id: x.code,
    code: x.code,
    text: x.code,
    color: '',
  }));

  const aggregatedData = [...events, ...stages, ...phases, ...units, ...subunits];

  return (
    <Dialog
      onClose={props.onClickCancel}
      open={props.visible}
      maxWidth="lg"
      fullScreen={fullScreen}
      aria-labelledby="create-rule-title"
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          formik.handleSubmit();
        },
      }}
    >
      <DialogTitle aria-labelledby="create-rule-title">{` ${props.disciplineCode}: Rules Creation`}</DialogTitle>
      <DialogContent>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            <SelectEnum
              options={getEnumValues(EnumType.OdfRule) ?? []}
              label={t('common.rule')}
              field="rule"
              formik={formik}
              required
              onChange={() => {
                formik.setFieldValue('parentCode', '');
                formik.setFieldValue('targetCode', null);
                formik.setFieldValue('nextCodes', []);
                formik.setFieldValue('order', 1);
              }}
            />
          </Grid>
          {formik.values.rule?.code == OdfRuleEnum.CreateStage && (
            <>
              <Grid size={6}>
                <SelectEnum
                  options={events}
                  label={t('general.event')}
                  field="parentCode"
                  formik={formik}
                  hint="Hint: Select the event to be linked to the new stage"
                  required
                  onChange={(e: any) => {
                    formik.setFieldValue('code', e?.code);
                    formik.setFieldValue('description', e?.description);
                    formik.setFieldValue('order', e?.order);
                  }}
                />
              </Grid>
              <Grid size={6}>
                <TextInput label={t('common.code')} field="code" formik={formik} required />
              </Grid>
              <Grid size={6}>
                <SelectEnum
                  options={getEnumValues(EnumType.StageType) ?? []}
                  label={t('common.type')}
                  field="type"
                  formik={formik}
                  hint="Hint: Select the type of the new stage"
                  required
                />
              </Grid>
              <Grid size={4}>
                <NumberInput label={t('general.order')} field="order" formik={formik} required />
              </Grid>
              <Grid size={8}>
                <TextInput label={t('common.name')} field="description" formik={formik} required />
              </Grid>
              <Grid size={12}>
                <SelectEnum
                  options={phases.filter((x: any) =>
                    x.code.startsWith(removeDashes(formik.values.parentCode?.code))
                  )}
                  type={DataType.MultiSelect}
                  disabled={!formik.values.parentCode?.code}
                  label="Linked Phases"
                  field="nextCodes"
                  formik={formik}
                  hint="Hint: Select the phases to be linked to the new stage"
                />
              </Grid>
              <Grid size={12}>
                <SelectEnum
                  options={phases.filter((x: any) =>
                    x.code.startsWith(removeDashes(formik.values.parentCode?.code))
                  )}
                  type={DataType.MultiSelect}
                  disabled={!formik.values.parentCode?.code}
                  label="Message Redirects"
                  field="redirectCodes"
                  formik={formik}
                  hint="Hint: Select the message redirects"
                />
              </Grid>
            </>
          )}
          {formik.values.rule?.code == OdfRuleEnum.ConvertPhaseToStage && (
            <>
              <Grid size={6}>
                <SelectEnum
                  options={events}
                  label={t('general.event')}
                  field="parentCode"
                  formik={formik}
                  hint="Hint: Select the event to be linked to the new stage"
                  required
                  onChange={(e: any) => {
                    formik.setFieldValue('code', e?.code);
                    formik.setFieldValue('description', e?.description);
                    formik.setFieldValue('order', e?.order);
                  }}
                />
              </Grid>
              <Grid size={6}>
                <SelectEnum
                  options={phases.filter((x: any) =>
                    x.code.startsWith(removeDashes(formik.values.parentCode?.code))
                  )}
                  label={t('general.phase')}
                  disabled={!formik.values.parentCode?.code}
                  field="targetCode"
                  formik={formik}
                  hint="Hint: Select the phase to be converted to stage"
                />
              </Grid>
              <Grid size={6}>
                <NumberInput label={t('general.order')} field="order" formik={formik} required />
              </Grid>
              <Grid size={4}>
                <SelectEnum
                  options={getEnumValues(EnumType.StageType) ?? []}
                  label={t('common.type')}
                  field="type"
                  formik={formik}
                  hint="Hint: Select the type of the converted stage"
                />
              </Grid>
              <Grid size={8}>
                <SelectEnum
                  options={phases.filter((x: any) =>
                    x.code.startsWith(removeDashes(formik.values.parentCode?.code))
                  )}
                  type={DataType.MultiSelect}
                  label="Linked Phases"
                  field="nextCodes"
                  formik={formik}
                  hint="Hint: Select the phases to be linked to the converted stage"
                />
              </Grid>
              <Grid size={12}>
                <SelectEnum
                  options={phases.filter((x: any) =>
                    x.code.startsWith(removeDashes(formik.values.parentCode?.code))
                  )}
                  type={DataType.MultiSelect}
                  disabled={!formik.values.parentCode?.code}
                  label="Message Redirects"
                  field="redirectCodes"
                  formik={formik}
                  hint="Hint: Select the message redirects"
                />
              </Grid>
            </>
          )}
          {formik.values.rule?.code === OdfRuleEnum.LinkPhaseToStage && (
            <>
              <Grid size={12}>
                <SelectEnum
                  options={stages}
                  label={t('general.stage')}
                  field="parentCode"
                  formik={formik}
                  hint="Hint: Select the stage you want to linked some phases"
                />
              </Grid>
              <Grid size={12}>
                <SelectEnum
                  options={phases}
                  label={t('general.phase')}
                  field="targetCode"
                  formik={formik}
                  hint="Hint: Select the phase to be linked to the the stage"
                />
              </Grid>
            </>
          )}
          {formik.values.rule?.code === OdfRuleEnum.MessageRedirect && (
            <>
              <Grid size={12}>
                <SelectEnum
                  options={aggregatedData}
                  label="From Code"
                  field="parentCode"
                  formik={formik}
                  hint="Hint: Select the code from being redirected"
                />
              </Grid>
              <Grid size={12}>
                <SelectEnum
                  options={aggregatedData}
                  label="To Code"
                  field="targetCode"
                  formik={formik}
                  hint="Hint: Select the target code to be redirected "
                />
              </Grid>
            </>
          )}
          {formik.values.rule?.code === OdfRuleEnum.ConvertSubunitToUnit && (
            <>
              <Grid size={6}>
                <SelectEnum
                  options={phases}
                  label={t('general.phase')}
                  field="parentCode"
                  formik={formik}
                  hint="Hint: Select the phase of the unit"
                />
              </Grid>
              <Grid size={6}>
                <SelectEnum
                  options={subunits}
                  label={t('general.subunit')}
                  field="targetCode"
                  formik={formik}
                  hint="Hint: Select the subunit to be converted to unit"
                />
              </Grid>
              <Grid size={12}>
                <SelectEnum
                  options={subunits}
                  label="Linked SubUnit"
                  type={DataType.MultiSelect}
                  field="nextCodes"
                  formik={formik}
                  hint="Hint: Select the subunits to be linked to the converted unit"
                />
              </Grid>
            </>
          )}
          {formik.values.rule?.code == OdfRuleEnum.HideUnit && (
            <>
              <Grid size={12}>
                <SelectEnum
                  options={units}
                  label={t('general.units')}
                  field="targetCode"
                  formik={formik}
                  hint="Hint: Select the unit to be hidden"
                />
              </Grid>
              <Grid size={12}>
                <SelectEnum
                  options={subunits}
                  type={DataType.MultiSelect}
                  label="Converted Subunits"
                  field="nextCodes"
                  formik={formik}
                  hint="Hint: Select the subunits to be promoted to unit"
                />
              </Grid>
            </>
          )}
          {formik.values.rule?.code === OdfRuleEnum.HideSubUnit && (
            <Grid size={12}>
              <SelectEnum
                options={subunits}
                label={t('general.subunit')}
                field="targetCode"
                formik={formik}
                hint="Hint: Select the subunit to be hidden"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 2, px: 2 }}>
        <Button
          startIcon={<CancelOutlined />}
          disableElevation
          variant="text"
          color="secondary"
          onClick={props.onClickCancel}
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
      </DialogActions>
    </Dialog>
  );
};
