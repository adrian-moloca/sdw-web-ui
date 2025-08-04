import { Box, Typography } from '@mui/material';
import ReactQuill from 'react-quill-new';
import get from 'lodash/get';
import { IInputFieldProps } from 'models';

export const TextRichInput = ({ field, label, height, formik }: IInputFieldProps) => {
  const { values, touched, errors, setFieldValue } = formik;

  const handleEditorChange = (value: string) => {
    setFieldValue(field, value);
  };

  const errorText = errors[field] ? errors[field] : undefined;

  return (
    <Box sx={{ mt: 1, width: '100%' }}>
      <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
        {label}
      </Typography>
      <ReactQuill
        theme="snow"
        value={get(values, field, '')} // Ensure value is correctly bound to Formik's value
        onChange={handleEditorChange} // Use a separate function for cleaner handling
        style={{ height, width: '100%' }} // Set height to 600px to show 30 lines
      />
      {touched[field] && Boolean(errors[field]) && (
        <Typography variant="caption" color="error">
          {errorText?.toString()}
        </Typography>
      )}
    </Box>
  );
};
