import { useNavigate } from 'react-router';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import { PageContainer } from '@toolpad/core';
import { ErrorPanel } from 'components';
import { EntityType, IConfigProps } from 'models';
import { ViewSkeleton } from 'components/skeletons';
import useApiService from 'hooks/useApiService';
import useAppRoutes from 'hooks/useAppRoutes';
import { MergeRequestWizardControl } from '../MergeRequestWizardControl';
import { getBreadCrumbData } from 'utils/views';
import { BasicPageHeader } from 'layout/page.layout';
import { formatAthleteName } from '_helpers';

type Props = {
  config: IConfigProps;
  id: string;
};

export const MergeRequestWizard = ({ config, id }: Props) => {
  const navigate = useNavigate();
  const { getIndexRoute } = useAppRoutes();
  const apiService = useApiService();

  const { data, error, isLoading } = useQuery({
    queryKey: [`${config.entityName}_view`, config.type, id],
    queryFn: () => apiService.getById(config, id),
  });

  const getElement = (): any =>
    isLoading || error ? {} : config.type === EntityType.MergeRequest ? data : data?.data;

  const getName = () => {
    if (isLoading || error) return t('common.unknown');

    const element = getElement();
    if (config.type === EntityType.Person) {
      if (get(element, 'dateOfBirth')) {
        return `${formatAthleteName(element)} / ${get(element, 'dateOfBirth')}`;
      }
      return formatAthleteName(element);
    }

    return get(element, config.displayAccessor) ?? t('common.unknown');
  };

  const breadCrumbs = getBreadCrumbData(getElement(), config);

  if (isLoading) return <ViewSkeleton />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <PageContainer
      maxWidth="xl"
      title={getName()}
      breadcrumbs={breadCrumbs}
      slots={{ header: BasicPageHeader }}
    >
      <MergeRequestWizardControl
        config={config}
        id={id}
        onFinish={() => navigate(getIndexRoute(EntityType.MergeRequest))}
      />
    </PageContainer>
  );
};
