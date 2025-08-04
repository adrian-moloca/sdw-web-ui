import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  buildLodashColumn,
  buildEnumColumn,
  buildDateColumn,
  buildNumericColumn,
  DataGridPanel,
} from 'components/datagrid';
import { MainCard } from 'components/cards/MainCard';
import { useModelConfig, useSecurity } from 'hooks';
import { EntityType, EnumType, ViewType } from 'models';
import { t } from 'i18next';

export const ReportsDetails = () => {
  const { getDataSource, getConfig } = useModelConfig();
  const config = getConfig(EntityType.Report);
  const dataSource = getDataSource(EntityType.Report);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">{t('report-manager.latest-10-reports')}</Typography>
        </Grid>
        <Grid />
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <DataGridPanel
          config={config}
          showHeader={false}
          toolbarType="none"
          flags={useSecurity(config.type, ViewType.Index, false).flags}
          dataSource={{ ...dataSource, queryKey: 'latest_reports' }}
          fixPageSize={10}
          disableColumnMenu={true}
          disablePagination={true}
          //sorting={[{ column: 'ts', operator: 'DESC' }]}
          columns={[
            buildLodashColumn('variationCode', t('common.code'), 'variation.code', 90),
            buildLodashColumn('variation', t('general.reportVariation'), 'variation.name', 300),
            {
              field: 'displayName',
              headerName: t('common.scope'),
              width: 380,
              filterable: false,
              sortable: false,
            },
            //buildLodashColumn('disciplines', t('general.discipline, 'variation.disciplineDisplay', 300),
            buildNumericColumn('days', 'Remaining', 100),
            buildEnumColumn('status', t('common.status'), EnumType.ReportStatus, 120),
            buildEnumColumn('statusData', `Data ${t('common.status')}`, EnumType.DataStatus, 120),
            buildEnumColumn('format', t('common.format'), EnumType.ReportFormat, 120),
            buildNumericColumn('noExecutions', '#Exe', 80),
            buildNumericColumn('noDeliverables', '#Del', 80),
            buildDateColumn('generatedOn', 'Last Generation', 160, undefined, 'YYYY-MM-DD HH:mm'),
            buildDateColumn('nextDelivery', t('general.nextDelivery'), 140),
          ]}
        />
      </MainCard>
    </>
  );
};
