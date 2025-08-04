import { Box, Grid, Stack, Typography } from '@mui/material';
import { t } from 'i18next';

export const renderField = (label: any, value: any, size: 'standard' | 'large' = 'standard') => {
  return (
    <Grid size={size === 'large' ? 12 : { xs: 12, md: 6 }}>
      <Box>
        <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
          {label}
        </Typography>
        <Typography variant="body1" lineHeight={1.2}>
          {value ?? '-'}
        </Typography>
      </Box>
    </Grid>
  );
};
export const renderBooleanField = (label: any, value: any) => (
  <Grid size={{ xs: 12, md: 6 }}>
    <Box>
      <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
        {label}
      </Typography>
      <Typography variant="body1">{value ? t('common.yes') : t('common.no')}</Typography>
    </Box>
  </Grid>
);
export const renderArrayField = (
  label: any,
  values: any[],
  size: 'standard' | 'large' = 'standard'
) => (
  <Grid size={size === 'large' ? 12 : { xs: 12, md: 6 }}>
    <Box>
      <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
        {label}
      </Typography>
      <Typography variant="body1" lineHeight={1.2}>
        {values && values.length > 0
          ? values
              .map((item) => (typeof item === 'object' && item.label ? item.label : item))
              .join(', ')
          : '-'}
      </Typography>
    </Box>
  </Grid>
);
export const renderUserField = (label: any, values: any[]) => {
  if (!values || values.length === 0) return null;
  return (
    <Grid size={12}>
      <Box>
        <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
          {label}
        </Typography>
        <Stack>
          {values && values.length > 0
            ? values.map((item) => (
                <Typography
                  lineHeight={1.2}
                  key={item.id}
                  variant="body1"
                >{`${item.name} (${item.email})`}</Typography>
              ))
            : '-'}
        </Stack>
      </Box>
    </Grid>
  );
};
export const renderStatus = (label: any, value: any, statusOptions: any[]) => {
  const currentStatus = statusOptions.find(
    (option) => option.value.toLowerCase() === value.toLowerCase()
  );
  const Icon = currentStatus?.icon;

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box>
        <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
          {label}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {Icon && <Icon sx={{ fontSize: '16px', color: currentStatus?.color }} />}
          <Typography variant="body1">{currentStatus?.label ?? value}</Typography>
        </Stack>
      </Box>
    </Grid>
  );
};
