import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  TextField,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import { Stack } from '@mui/system';
import {
  Textarea,
  TextInput,
  JsonAceEditor,
  SelectOptions,
  Datepicker,
  NumberInput,
  TextRichInput,
} from 'components';
import { METADATA_TYPES } from 'constants/config';
import { FormikProps } from 'formik';
import { t } from 'i18next';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import { useState } from 'react';
import { ModelProps } from 'hooks/useConsolidation';
import { DataType, HtmlFields, IMetaType, LongFields, MetadataModel } from 'models';

interface UseEditorProps {
  dataItem: ModelProps;
  formik: FormikProps<any>;
  metadata?: IMetaType;
  drawer: boolean;
}

export const EditorHelper = ({ dataItem, formik, metadata, drawer }: UseEditorProps) => {
  const [collectionValue, setCollectionValue] = useState('');
  const hint_type = drawer
    ? ''
    : t('messages.type-a-new-value-for').replace('{0}', dataItem?.id.toLowerCase());
  const model: MetadataModel | undefined = get(metadata, dataItem?.field);
  const field = drawer ? dataItem?.field : 'data';
  if (HtmlFields.includes(dataItem?.field)) {
    return (
      <TextRichInput
        label={model?.displayName}
        disabled={model?.readonly}
        disablePortal={drawer}
        field={field}
        formik={formik}
        hint={hint_type}
      />
    );
  }

  if (LongFields.includes(dataItem?.field)) {
    return (
      <Textarea
        label={model?.displayName}
        disabled={model?.readonly}
        disablePortal={drawer}
        field={field}
        formik={formik}
        hint={hint_type}
      />
    );
  }

  if (!model) {
    return (
      <TextInput
        label={dataItem?.field}
        disablePortal={drawer}
        field={field}
        formik={formik}
        placeholder={hint_type}
      />
    );
  }

  switch (model.type) {
    case METADATA_TYPES.MAP:
      return (
        <JsonAceEditor
          label={model?.displayName}
          field={field}
          formik={formik}
          helperText={
            hint_type ? t('messages.valid-json') : `${hint_type}.${t('messages.valid-json')}`
          }
        />
      );
    case METADATA_TYPES.COLLECTION: {
      if (model?.options && model.options.length > 1) {
        return (
          <SelectOptions
            disablePortal={drawer}
            label={model?.displayName}
            type={DataType.MultiSelect}
            field={field}
            formik={formik}
            disabled={model?.readonly}
            options={model.options}
          />
        );
      }
      const renderData = isArray(formik.values[field])
        ? formik.values[field]
        : [formik.values[field]];
      return (
        <Stack spacing={1} sx={{ width: '100%' }}>
          <OutlinedInput
            margin="dense"
            type="text"
            placeholder={hint_type}
            fullWidth
            value={collectionValue}
            onChange={(e) => setCollectionValue(e.target.value.toString())}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Add"
                  disabled={!collectionValue}
                  onClick={async () => {
                    if (formik.values[field]?.length > 0) {
                      await formik.setFieldValue(
                        field,
                        [...formik.values[field], collectionValue],
                        false
                      );
                    } else {
                      await formik.setFieldValue(field, [collectionValue], false);
                    }
                    setCollectionValue('');
                  }}
                  edge="end"
                >
                  <AddCircleOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
          <List dense sx={{ border: `1px solid grey`, borderRadius: '8px', px: 1 }} tabIndex={0}>
            {renderData?.map((value, index) => (
              <ListItem
                key={index}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() =>
                      formik.setFieldValue(
                        field,
                        formik.values[field].filter((x: any) => x !== value)
                      )
                    }
                  >
                    <DeleteOutlined />
                  </IconButton>
                }
              >
                <ListItemText primary={value} />
              </ListItem>
            ))}
          </List>
        </Stack>
      );
    }
    case METADATA_TYPES.DATE:
      return (
        <Datepicker
          disabled={model?.readonly}
          disablePortal={drawer}
          label={model?.displayName}
          format="YYYY-MM-DD"
          field={field}
          formik={formik}
          hint={hint_type}
        />
      );
    case METADATA_TYPES.NUMBER:
      return (
        <NumberInput
          disabled={model?.readonly}
          disablePortal={drawer}
          label={model?.displayName}
          field={field}
          formik={formik}
          placeholder={model?.displayName}
          hint={hint_type}
        />
      );
    default:
      if (model?.options.length > 0) {
        return (
          <Autocomplete
            disablePortal={drawer}
            disabled={model?.readonly}
            options={model.options}
            key={field}
            value={get(formik.values, field) ?? null}
            onBlur={formik.handleBlur}
            onChange={(_event, newValue) => formik.setFieldValue(field, newValue)}
            fullWidth
            getOptionLabel={(option: any) => option.displayName ?? ''}
            getOptionKey={(option) => option.value ?? ''}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label={model?.displayName}
                variant="outlined"
                placeholder={`Select a ${dataItem?.id.toLowerCase()}`}
              />
            )}
          />
        );
      }
      return (
        <TextInput
          label={model?.displayName}
          field={field}
          formik={formik}
          placeholder={dataItem?.id}
          hint={hint_type}
        />
      );
  }
};
