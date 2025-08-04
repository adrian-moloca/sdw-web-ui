import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import React, { JSX, useState } from 'react';
import { t } from 'i18next';
import { useDataScopeStatus } from 'hooks/useDataScopeStatus';
import { Metrics } from './components';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  DataScopeStatusTable,
  transformDeliveryScopeRows,
  columnsCompetitions,
} from './components/DataScopeStatusTable';

const CompetitionsTab: React.FC = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [paginationModel] = useState({ pageSize: 25, page: 0 });

  const { competitionsDeliveryStatus, competitionsDeliveryStatusBreakDown, isLoading, isError } =
    useDataScopeStatus(paginationModel, selectedStatus);

  const filteredRows = () => {
    if (!competitionsDeliveryStatusBreakDown) return [];

    const raw = competitionsDeliveryStatusBreakDown;

    if (selectedStatus === 'all') {
      return transformDeliveryScopeRows(competitionsDeliveryStatusBreakDown);
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
          deliveryStatus={competitionsDeliveryStatus}
          currentTab="competitions"
          onCardSelect={setSelectedStatus}
          selectedCard={selectedStatus ?? 'all'}
        />
      }
      rightContent={
        <DataScopeStatusTable
          rows={filteredRows()}
          columns={columnsCompetitions}
          isLoading={false}
        />
      }
    />
  );
};

export default CompetitionsTab;
