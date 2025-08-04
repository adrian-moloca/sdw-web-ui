import { useQuery } from '@tanstack/react-query';
import { GenericLoadingPanel } from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { ReportBulkGeneratorControl } from '../ReportBulkGeneratorControl';

type Props = {
  id: any;
};

export const ReportBulkGenerator = (props: Props) => {
  const apiService = useApiService();
  const urlVersion = `${appConfig.gdsReportEndpoint}/config?key=${props.id}`;

  const { data, isLoading } = useQuery({
    queryKey: [`report_version_${props.id}`, props.id],
    queryFn: () => apiService.fetch(urlVersion),
    refetchOnMount: true,
  });

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return <ReportBulkGeneratorControl {...props} data={data} isLoadingVersion={isLoading} />;
};
