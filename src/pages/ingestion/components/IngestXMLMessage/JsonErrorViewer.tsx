import { Alert, AlertTitle, Typography, Box } from '@mui/material';
import { t } from 'i18next';

export function JsonErrorViewer({ json }: Readonly<{ json: any }>) {
  if (!json) return null;

  return (
    <Box my={2}>
      {!json.valid && (
        <Alert severity="error" variant="outlined">
          <AlertTitle>{t('messages.xml-validation-failed')}</AlertTitle>
          {json.errors?.length > 0 && (
            <ul style={{ paddingLeft: '10px', margin: 0, listStyleType: 'none' }}>
              {json.errors.map((err: string, i: number) => (
                <li key={i}>
                  <Typography variant="body2">{err}</Typography>
                </li>
              ))}
            </ul>
          )}
        </Alert>
      )}

      {json.warnings?.length > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }} variant="outlined">
          <AlertTitle>{t('common.warnings')}</AlertTitle>
          <ul style={{ paddingLeft: '10px', margin: 0, listStyleType: 'none' }}>
            {json.warnings.map((warn: string, i: number) => (
              <li key={i}>
                <Typography variant="body2">{warn}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </Box>
  );
}
