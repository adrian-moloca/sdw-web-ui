import { t } from 'i18next';
import { useSecurityProfile } from 'hooks';
import { MenuFlagEnum } from 'models';
import { PageContainer } from '@toolpad/core';

const StartListPage = () => {
  const { checkPermission } = useSecurityProfile();

  checkPermission(MenuFlagEnum.GamesTimeInfo);

  return (
    <PageContainer
      maxWidth="xl"
      title=""
      breadcrumbs={[
        { title: t('navigation.BiographiesManager'), path: '/' },
        { title: t('navigation.StartLists'), path: '/biographies-manager/start-lists' },
      ]}
    ></PageContainer>
  );
};

export default StartListPage;
