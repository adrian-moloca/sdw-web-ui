import { useParams } from 'react-router';
import { t } from 'i18next';
import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { PageContainer } from '@toolpad/core';
import baseConfig from 'baseConfig';
import { EntityType, MenuFlagEnum } from 'models';
import { EntryDetails } from './components';
import { useModelConfig, useSecurityProfile } from 'hooks';
import { BasicPageHeader } from 'layout/page.layout';
import { getBreadCrumbData } from 'utils/views';

const CategoryDetailsPage = () => {
  const { id } = useParams();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Category);
  const { checkPermission } = useSecurityProfile();
  const breadCrumbs = getBreadCrumbData({ id, title: id }, config);

  useEffect(() => {
    checkPermission(MenuFlagEnum.Explorer);
  }, []);

  return (
    <PageContainer
      maxWidth="xl"
      title={`${t('general.master_category')}: ${id}`}
      slots={{ header: BasicPageHeader }}
      breadcrumbs={breadCrumbs}
    >
      <Grid container spacing={baseConfig.gridSpacing}>
        <Grid size={12}>
          <EntryDetails parameter={{ id: id ?? '', display: id, type: config.type }} data={{}} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default CategoryDetailsPage;
