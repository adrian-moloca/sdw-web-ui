import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import useApiService from 'hooks/useApiService';
import { useQuery } from '@tanstack/react-query';
import appConfig from 'config/app.config';
import { GenericLoadingPanel } from 'components';
import { CompetitionStructureContent } from './components';
import { PageContainer } from '@toolpad/core';
import { useLocation } from 'react-router-dom';

const CompetitionStructurePage = () => {
  const apiService = useApiService();
  const location = useLocation();

  const url = `${appConfig.toolsEndPoint}/odf/structure/editions`;
  const { data, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => apiService.fetch(url),
  });

  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;

  return (
    <PageContainer
      maxWidth="xl"
      breadcrumbs={[
        { title: 'ODF', path: '/' },
        { title: t('navigation.CompetitionStructure'), path: location.pathname },
      ]}
    >
      <Grid container spacing={2}>
        <CompetitionStructureContent editions={data} />
      </Grid>
    </PageContainer>
  );
};

export default CompetitionStructurePage;
