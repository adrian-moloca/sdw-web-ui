import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import { DialogProps } from 'types/dialog';

export const ConfirmDialog = ({
  visible,
  title,
  message,
  description,
  onClickCancel,
  onClickOk,
}: DialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={visible}
      onClose={onClickCancel}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle aria-labelledby="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>
        {message && <Typography component="div" dangerouslySetInnerHTML={{ __html: message }} />}
        {description && (
          <Typography component="div" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClickCancel}>
          {t('common.no')}
        </Button>
        <Button color="secondary" variant="outlined" onClick={onClickOk}>
          {t('common.yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
