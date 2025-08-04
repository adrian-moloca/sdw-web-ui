import { useQuery } from '@tanstack/react-query';
import { GenericLoadingPanel } from 'components';
import { MenuFlagEnum } from 'models';
import { useSecurityProfile } from 'hooks';
import useApiService from 'hooks/useApiService';
import { apiConfig } from 'config/app.config';
import { DataIngestLayout } from './components';

const DataIngestPage = () => {
  const { checkPermission } = useSecurityProfile();
  const apiService = useApiService();
  const urlSources = `${apiConfig.apiEndPoint}/data-ingest/system/sources`;

  const { data, isLoading } = useQuery({
    queryKey: ['ingest_services'],
    queryFn: () => apiService.fetch(urlSources),
  });

  checkPermission(MenuFlagEnum.Administrator);

  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;

  return <DataIngestLayout data={isLoading ? [] : data} />;
};

export default DataIngestPage;
