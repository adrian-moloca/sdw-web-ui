import { Alert, Typography } from '@mui/material';
import { t } from 'i18next';

export interface IErrorPanelProps {
  error: any;
  onClose?: () => void;
}

export const ErrorPanel = (props: IErrorPanelProps): React.ReactElement | null => {
  if (!props.error) return null;
  return (
    <Alert severity="error" title={t('common.errorTitle')} onClose={props.onClose}>
      <Typography variant="body1">{`${t('common.errorTitle')} -  ${props.error.toString()}`}</Typography>
    </Alert>
  );
};
