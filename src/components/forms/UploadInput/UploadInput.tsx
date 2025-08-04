import { Button } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { t } from 'i18next';
import { IInputFieldProps } from 'models';

export const UploadInput = ({ field, disabled }: IInputFieldProps) => {
  return (
    <Button
      disableElevation
      variant="outlined"
      sx={{ mt: 1 }}
      disabled={disabled}
      component="label"
      startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
    >
      {t('actions.buttonUpload')}
      <input hidden accept="*/*" multiple type="file" id={field} name={field} />
    </Button>
  );
};
