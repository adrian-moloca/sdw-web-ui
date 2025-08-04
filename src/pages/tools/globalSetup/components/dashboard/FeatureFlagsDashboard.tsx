import { Grid, useTheme } from '@mui/material';
import { MainCard } from 'components';
import { t } from 'i18next';
import { FeatureFlagsDisplay } from '../featureFlagDisplay';
import { ConfigDisplay } from '../configDisplay';
import { IngestDisplay } from '../ingestDisplay';
import { GlobalSetup } from '../types';

export const FeatureFlagsDashboard: React.FC<GlobalSetup> = ({ config, flags, ingest }) => {
  const theme = useTheme();
  return (
    <Grid container spacing={2}>
      {/* Flags section */}
      <Grid size={{ xs: 12, md: 12, lg: 6 }}>
        <MainCard
          title={t('global-setup.feature-flags')}
          sx={{ height: '100%', px: theme.spacing(2) }}
          border={false}
          divider={false}
        >
          <FeatureFlagsDisplay flags={flags} />
        </MainCard>
      </Grid>

      {/* Configs section */}
      <Grid container size={{ xs: 12, md: 12, lg: 6 }}>
        <Grid size={12}>
          <MainCard
            title={t('global-setup.analytic-db-configuration')}
            sx={{ height: '100%', px: theme.spacing(2) }}
            border={false}
            divider={false}
          >
            <ConfigDisplay config={config} flags={flags} ingest={ingest} />
          </MainCard>
        </Grid>
        <Grid size={12}>
          <MainCard
            title={t('global-setup.ingest-progress')}
            sx={{ height: '100%', px: theme.spacing(2) }}
            border={false}
            divider={false}
          >
            <IngestDisplay config={config} flags={flags} ingest={ingest} />
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
};
