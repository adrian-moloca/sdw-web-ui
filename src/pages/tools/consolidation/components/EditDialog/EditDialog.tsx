import 'react-quill-new/dist/quill.snow.css';
import {
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Button,
  Divider,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import SettingsBackupRestoreOutlined from '@mui/icons-material/SettingsBackupRestoreOutlined';
import TextFormatOutlined from '@mui/icons-material/TextFormatOutlined';
import { useFormik } from 'formik';
import get from 'lodash/get';
import { t } from 'i18next';
import dayjs from 'dayjs';
import { Checkbox } from 'components';
import { METADATA_TYPES } from 'constants/config';
import { useAppModel } from 'hooks';
import { humanize } from '_helpers';
import { IConfigProps, MetadataModel, MetadataOption } from 'models';
import type { DialogProps } from 'types/dialog';
import type { EditFieldData } from 'types/tools';
import { EditorHelper } from '../EditorHelper';
import useConsolidation, { ModelProps } from 'hooks/useConsolidation';

interface Props extends DialogProps {
  config: IConfigProps;
  dataItem: ModelProps;
  hidden: Array<string>;
  metadata?: { [key: string]: MetadataModel };
  width?: number;
  onClickSave: (data: EditFieldData) => void;
}

export const EditDialog = (props: Props) => {
  const theme = useTheme();
  const { formatField } = useAppModel();
  const { getInitialValues } = useConsolidation();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const title = props.dataItem ? props.dataItem.id : '';
  const model = get(props.metadata, props.dataItem?.field);

  const handleSubmit = (dataItem: EditFieldData) => {
    dataItem.field = props.dataItem?.field;

    if (model?.type === METADATA_TYPES.COLLECTION && model?.options && model?.options.length > 0) {
      dataItem.data = dataItem.data.map((x: MetadataOption) => x.value);
    } else {
      if (model?.options && model?.options.length > 0) {
        dataItem.data = dataItem.data?.value;
      }

      if (model?.type === METADATA_TYPES.DATE) {
        dataItem.data = dayjs(dataItem.data).format('YYYY-MM-DD');
      }
    }
    props.onClickSave(dataItem);
  };

  const formik = useFormik<EditFieldData>({
    initialValues: getInitialValues(props.dataItem, props.hidden, props.metadata),
    enableReinitialize: true,
    onSubmit: (values: EditFieldData) => {
      handleSubmit(values);
    },
  });

  return (
    <Dialog
      onClose={props.onClickCancel}
      open={props.visible}
      maxWidth="lg"
      fullScreen={fullScreen}
      aria-labelledby="consolidation-edit-title"
    >
      <DialogTitle aria-labelledby="consolidation-edit-title">{title}</DialogTitle>
      <Divider />
      <DialogContent sx={{ minWidth: 500 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={1}>
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'end' }}>
              {props.dataItem?.internal
                ? formatField(props.dataItem?.field, props.dataItem?.internal, props.metadata)
                : t('consolidation.message_NoValue')}
            </Grid>
            <Grid size={12}>
              <Checkbox
                field="hidden"
                label={
                  props.hidden.includes(props.dataItem?.id)
                    ? `Show ${props.dataItem?.id}`
                    : `Hide ${props.dataItem?.id}`
                }
                formik={formik}
              />
            </Grid>
            <Grid size={12}>
              <EditorHelper
                dataItem={props.dataItem}
                formik={formik}
                metadata={props.metadata}
                drawer={false}
              />
            </Grid>
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'end', marginTop: 2 }}>
              <Button
                startIcon={<SettingsBackupRestoreOutlined />}
                color="secondary"
                variant="text"
                onClick={() => {
                  formik.setFieldValue('data', props.dataItem?.internal);
                }}
              >
                {t('actions.buttonReset')}
              </Button>
              {model && model.type === METADATA_TYPES.STRING && (
                <Button
                  startIcon={<TextFormatOutlined />}
                  color="secondary"
                  variant="text"
                  onClick={() => {
                    formik.setFieldValue('data', humanize(props.dataItem?.internal));
                  }}
                >
                  {t('common.format')}
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                disableElevation
                startIcon={<CancelOutlined />}
                color="secondary"
                variant="text"
                onClick={() => {
                  formik.resetForm();
                  props.onClickCancel();
                }}
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};
