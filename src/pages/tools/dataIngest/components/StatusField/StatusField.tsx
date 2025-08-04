import { Chip } from '@mui/material';
import { t } from 'i18next';

type Props = {
  status: string;
};

export const StatusField = (props: Props) => {
  return (
    <Chip
      label={props.status === 'OK' ? t('status.success') : props.status}
      size="small"
      //variant="outlined"
      sx={{ p: 0, fontSize: '0.675rem' }}
      color={props.status === 'OK' ? 'success' : props.status == 'WARNING' ? 'warning' : 'error'}
    />
  );
};
