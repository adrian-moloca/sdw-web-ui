import React, { JSX, useState, useCallback } from 'react';
import { t } from 'i18next';
import { useDataScopeStatus } from 'hooks/useDataScopeStatus';
import { Metrics } from './components';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  DataScopeStatusTable,
  transformDeliveryScopeRows,
  useColumnsCompetitions,
} from './components/DataScopeStatusTable';
import {
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';

const CompetitionsTab: React.FC = (): JSX.Element => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 25,
    page: 0,
  });
  const columnsCompetitions = useColumnsCompetitions();
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    competitionDeliveryStatus,
    competitionDeliveryStatusBreakDown,
    isLoading,
    isError,
    competitionDeliveryStatusTotalCount,
  } = useDataScopeStatus({
    paginationModel,
    selectedStatus,
    filterModel,
    sortModel,
    searchQuery,
    selectedTab: 'competitions',
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

  if (isError) {
    return (
      <Box
        height="calc(100vh - 185px)"
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography color="error">{t('message.could-not-fetch-data')}</Typography>
      </Box>
    );
  }

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

  const rows = transformDeliveryScopeRows(competitionDeliveryStatusBreakDown || []);

  return (
    <DashboardLayout
      leftContent={
        <Metrics
          deliveryStatus={competitionDeliveryStatus}
          currentTab="competitions"
          onCardSelect={handleStatusSelect}
          selectedCard={selectedStatus}
        />
      }
      rightContent={
        <DataScopeStatusTable
          rows={rows}
          columns={columnsCompetitions as GridColDef[]}
          isLoading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          onSearchChange={handleSearchChange}
          rowCount={competitionDeliveryStatusTotalCount || rows.length}
        />
      }
    />
  );
};

export default CompetitionsTab;
