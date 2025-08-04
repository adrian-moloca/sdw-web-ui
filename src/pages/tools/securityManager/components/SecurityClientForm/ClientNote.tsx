import { Alert, Typography } from '@mui/material';
import { Grid } from '@mui/system';
import { t } from 'i18next';
import { EditionMode } from 'models';

export function ClientFormNote(props: Readonly<{ mode: EditionMode }>) {
  if (props.mode !== EditionMode.Create) {
    return null;
  }
  return (
    <Grid size={12} sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        <u>{t('security-manager.note.title')}</u>
        {': '}
        <Typography
          variant="body2"
          component={'span'}
          dangerouslySetInnerHTML={{ __html: t('security-manager.note.client-id') }}
        />{' '}
        <Typography
          variant="body2"
          component={'span'}
          dangerouslySetInnerHTML={{ __html: t('security-manager.note.client-secret') }}
        />
      </Alert>
    </Grid>
  );
}
