import { ViewPanel } from 'components';
import { useModelConfig, useSecurityProfile, useStoreCache } from 'hooks';
import { EntityType, MenuFlagEnum } from 'models';
import { useEffect } from 'react';
import { MainCard } from 'components/cards/MainCard';
import Grid from '@mui/material/Grid';
import { VariationSetup } from 'pages/reports-manager/components';

const ReportVariationDetailsPage = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.ReportVariation);
  const { checkPermission } = useSecurityProfile();
  const { getMetadata } = useStoreCache();

  useEffect(() => {
    checkPermission(MenuFlagEnum.Reports);
  }, []);

  return (
    <ViewPanel
      config={config}
      expandInfo={true}
      metadata={getMetadata(config.type)}
      overrideViewPanel={(dataItem: any) => (
        <MainCard>
          <Grid container spacing={2}>
            <VariationSetup id={dataItem.id} />
          </Grid>
        </MainCard>
      )}
      displayBoxes={[]}
      dataSource={getDataSource(config.type)}
    />
  );
};

export default ReportVariationDetailsPage;
