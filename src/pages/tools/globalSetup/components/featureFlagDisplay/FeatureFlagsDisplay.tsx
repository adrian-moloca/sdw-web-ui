import { Card, Typography, Grid, CardActionArea, useTheme, Alert, AlertTitle } from '@mui/material';
import { getFlagDescriptions } from './data';
import { t } from 'i18next';
import { useDialogs } from '@toolpad/core';
import { apiConfig } from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FlagContent } from '../flagContent';
import { canStartSync, getCardStyle, isEnabled } from '../utils';

export function FeatureFlagsDisplay({
  flags,
}: {
  readonly flags: Readonly<Record<string, boolean | string>>;
}) {
  const theme = useTheme();
  const flagDescriptions = getFlagDescriptions();
  const dialogs = useDialogs();
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const syncCanStart = canStartSync(flags);
  const urlChange = `${apiConfig.toolsEndPoint}/monitor/global-setup/change-flag`;
  const mutationChange = useMutation({
    mutationFn: async ({ flagKey, flagValue }: { flagKey: string; flagValue: boolean }) =>
      apiService.post(urlChange, { key: flagKey, value: flagValue }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-setup'] });
    },
    onError: (error: any) => error,
  });

  const handleFlagClick = async (
    flagKey: string,
    flagValue: boolean | string,
    enabled: boolean
  ) => {
    const meta = flagDescriptions[flagKey];
    if (!meta.editable) return dialogs.alert(t('global-setup.flag-cannot-changed'));
    if (!enabled) return dialogs.alert(t('global-setup.disabled-message'));
    const confirmed = await dialogs.confirm(
      <Typography variant="body1">
        {t('global-setup.are-you-sure-you-want-to')}{' '}
        {!flagValue ? t('general.enabled').toUpperCase() : t('general.disabled').toUpperCase()}{' '}
        <span style={{ fontWeight: 500 }}>{meta.label}</span>?
      </Typography>,
      {
        okText: t('common.yes'),
        cancelText: t('common.no'),
      }
    );
    if (confirmed) {
      mutationChange.mutate({ flagKey, flagValue: !flagValue });
    }
  };
  return (
    <Grid container spacing={2}>
      {Object.entries(flags)
        .map(([key, value]) => {
          const meta = flagDescriptions[key] || {
            label: key,
            description: '',
            order: Infinity,
            editable: false,
          };
          return {
            key,
            value,
            meta,
          };
        })
        .sort((a, b) => {
          const orderA = a.meta.order ?? Infinity;
          const orderB = b.meta.order ?? Infinity;
          return orderA - orderB;
        })
        .map(({ key, value, meta }) => {
          const cardStyle = getCardStyle(key, theme);
          const enabled = isEnabled(key, flags);
          return (
            <Grid size={{ xs: 6, md: 4 }} key={key}>
              <Card variant="outlined" sx={{ height: '100%', ...cardStyle }}>
                {meta.editable ? (
                  <CardActionArea onClick={() => handleFlagClick(key, value, enabled)}>
                    <FlagContent flag={key} value={value} meta={meta} enabled={enabled} />
                  </CardActionArea>
                ) : (
                  <CardActionArea sx={{ cursor: 'default' }}>
                    <FlagContent flag={key} value={value} meta={meta} enabled={enabled} />
                  </CardActionArea>
                )}
              </Card>
            </Grid>
          );
        })}
      {syncCanStart ? (
        <Grid size={12}>
          <Alert severity="warning" variant="outlined" icon={false}>
            <AlertTitle>{t('global-setup.sync-could-start-title')}</AlertTitle>
            {t('global-setup.sync-could-start')}
          </Alert>
        </Grid>
      ) : (
        <Grid size={12}>
          <Alert severity="info" variant="outlined">
            <AlertTitle>{t('global-setup.syncAlert.title')}</AlertTitle>
            {t('global-setup.syncAlert.message')}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
}
