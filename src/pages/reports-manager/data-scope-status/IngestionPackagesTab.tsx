import React, { JSX, useState, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import { Metrics } from './components';
import { t } from 'i18next';
import {
  DataScopeStatusTable,
  useColumnsIngestionPackages,
} from './components/DataScopeStatusTable';
import { useDataScopeStatus } from 'hooks/useDataScopeStatus';
import {
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import { DeliveryStatusBreakDown } from 'types/delivery-data-scope';

const IngestionPackagesTab: React.FC = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 25,
    page: 0,
  });
  const columnsIngestionPackages = useColumnsIngestionPackages();
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    packageDeliveryStatus,
    packageDeliveryStatusBreakDown,
    packageDeliveryStatusTotalCount,
    isLoadingPackages,
    isLoadingPackagesSummary,
    isErrorCompetitions,
  } = useDataScopeStatus({
    paginationModel,
    selectedStatus,
    filterModel,
    sortModel,
    searchQuery,
    selectedTab: 'packages',
  });

  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);
  }, []);

  const handleFilterModelChange = useCallback((model: GridFilterModel) => {
    setFilterModel(model);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    setSortModel(model);
  }, []);

  const handleStatusSelect = useCallback((status: string) => {
    setSelectedStatus(status);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  if (isErrorCompetitions) {
    return (
      <Box
        height="calc(100vh - 185px)"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography color="error">{t('message.could-not-fetch-data')}</Typography>
      </Box>
    );
  }

  if (isLoadingPackages && isLoadingPackagesSummary) {
    return (
      <Box
        height="calc(100vh - 185px)"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardLayout
      leftContent={
        <Metrics
          deliveryStatus={packageDeliveryStatus}
          currentTab="ingestion-packages"
          onCardSelect={handleStatusSelect}
          selectedCard={selectedStatus}
        />
      }
      rightContent={
        <DataScopeStatusTable
          rows={packageDeliveryStatusBreakDown as DeliveryStatusBreakDown[]}
          columns={columnsIngestionPackages as GridColDef[]}
          isLoading={isLoadingPackages}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          onSearchChange={handleSearchChange}
          rowCount={packageDeliveryStatusTotalCount || packageDeliveryStatusBreakDown?.length}
        />
      }
    />
  );
};

export default IngestionPackagesTab;
