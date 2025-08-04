import { Box, CircularProgress, Typography } from '@mui/material';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import { Metrics } from './components';
import { t } from 'i18next';
import React, { JSX, useState } from 'react';
import {
  DataScopeStatusTable,
  transformDeliveryScopeRows,
  columnsIngestionPackages,
} from './components/DataScopeStatusTable';
import { useDataScopeStatus } from 'hooks/useDataScopeStatus';

const IngestionPackagesTab: React.FC = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [paginationModel] = useState({ pageSize: 25, page: 0 });

  const { ingestionDeliveryStatus, ingestionDeliveryStatusBreakDown, isLoading, isError } =
    useDataScopeStatus(paginationModel, selectedStatus);

  const filteredRows = () => {
    if (!ingestionDeliveryStatusBreakDown) return [];

    const raw = ingestionDeliveryStatusBreakDown;

    if (selectedStatus === 'all') {
      return transformDeliveryScopeRows(raw);
    }

    const filtered = raw.filter((item) => item.scope?.some((s) => s.status === selectedStatus));

    return transformDeliveryScopeRows(
      filtered.map((item) => ({
        ...item,
        scope: item.scope?.filter((s) => s.status === selectedStatus),
      }))
    );
  };

  if (isLoading) {
    return (
      <Box
        height="calc(100vh - 185px)"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography>{t('message.could-not-fetch-data')}</Typography>;
  }

  return (
    <DashboardLayout
      leftContent={
        <Metrics
          deliveryStatus={ingestionDeliveryStatus}
          currentTab="ingestion-packages"
          onCardSelect={setSelectedStatus}
          selectedCard={selectedStatus ?? 'all'}
        />
      }
      rightContent={
        <DataScopeStatusTable
          rows={filteredRows()}
          columns={columnsIngestionPackages}
          isLoading={false}
        />
      }
    />
  );
};

export default IngestionPackagesTab;
