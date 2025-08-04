import { useQuery } from '@tanstack/react-query';
import { GenericLoadingPanel } from 'components';
import { MenuFlagEnum } from 'models';
import { useSecurityProfile } from 'hooks';
import useApiService from 'hooks/useApiService';
import { apiConfig } from 'config/app.config';
import { PageContainer } from '@toolpad/core';
import { t } from 'i18next';
import { FeatureFlagsDashboard } from './components';

const GlobalSetupPage = () => {
  const { checkPermission } = useSecurityProfile();
  const apiService = useApiService();
  const urlSources = `${apiConfig.toolsEndPoint}/monitor/global-setup`;

  const { data, isLoading } = useQuery({
    queryKey: ['global-setup'],
    queryFn: () => apiService.fetch(urlSources),
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
  });

  checkPermission(MenuFlagEnum.Administrator);

  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;

  return (
    <PageContainer
      maxWidth="xl"
      title={t('navigation.globalSetup')}
      breadcrumbs={[
        { title: t('navigation.Tools'), path: '/' },
        { title: t('navigation.globalSetup'), path: '/tools/global-setup' },
      ]}
    >
      <FeatureFlagsDashboard flags={data.flags} config={data.config} ingest={data.ingest} />
    </PageContainer>
  );
};

export default GlobalSetupPage;
