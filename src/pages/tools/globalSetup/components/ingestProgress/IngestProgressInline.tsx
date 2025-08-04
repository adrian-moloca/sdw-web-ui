import { Theme, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { t } from 'i18next';

export const IngestProgressInline: React.FC<{ item: any; theme: Theme }> = ({ item, theme }) => {
  let parsed: any;

  try {
    parsed = JSON.parse(item);
  } catch {
    return <Typography color="error">-</Typography>;
  }
  const doneColor = parsed.done ? 'success.main' : 'warning.main';
  const doneLabel = parsed.done ? t('status.completed') : t('status.inProgress');
  return (
    <Stack spacing={1}>
      <Typography variant="body2">
        <span style={{ color: theme.palette.text.secondary }}>{t('common.current')}</span>:{' '}
        {parsed.current}
      </Typography>
      <Typography variant="body2" sx={{ color: doneColor }}>
        <span style={{ color: theme.palette.text.secondary }}>{t('status.done')}</span>: {doneLabel}
      </Typography>
      <Typography variant="body2">
        <span style={{ color: theme.palette.text.secondary }}>{t('common.mode')}</span>:{' '}
        {parsed.config?.mode}
      </Typography>
      <Typography variant="body2">
        <span style={{ color: theme.palette.text.secondary }}>{t('common.no-cache')}</span>:{' '}
        {parsed.config?.noCache ? t('common.yes') : t('common.no')}
      </Typography>
    </Stack>
  );
};
