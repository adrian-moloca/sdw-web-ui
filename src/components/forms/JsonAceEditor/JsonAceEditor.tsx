import { FormikProps } from 'formik';
import { FormHelperText, Typography } from '@mui/material';
import AceEditor from 'react-ace';
import { Logger } from '_helpers';

type Props = {
  field: string;
  label?: string;
  formik: FormikProps<any>;
  helperText?: string;
  onChange?: (value: string) => void;
};

export const JsonAceEditor = ({ field, label, formik, helperText, onChange }: Props) => {
  const { values, touched, errors } = formik;

  const handleJsonChange = (newValue: string) => {
    try {
      formik.setFieldValue(field, newValue);

      const jsonString = JSON.stringify(JSON.parse(newValue), null, 2);

      formik.setFieldValue(field, jsonString);

      if (onChange) {
        onChange(jsonString);
      }
      formik.setFieldError(field, '');
    } catch (error: any) {
      formik.setFieldError(field, 'Invalid JSON');
      Logger.warn(error);
    }
  };

  return (
    <>
      {label && (
        <Typography variant="caption" color={'text.secondary'}>
          {label}
        </Typography>
      )}
      <AceEditor
        mode="json"
        theme="tomorrow"
        value={values[field]}
        onChange={handleJsonChange}
        name={field}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          useWorker: false,
          tabSize: 2, // Set the desired indentation size
          useSoftTabs: true, // Use spaces instead of tabs
          showPrintMargin: false, // Hide the print margin
          highlightActiveLine: true, // Highlight the current line
        }}
        width="100%"
        height="200px"
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {touched[field] && errors[field] && (
        <FormHelperText>{errors[field]?.toString()}</FormHelperText>
      )}
    </>
  );
};
