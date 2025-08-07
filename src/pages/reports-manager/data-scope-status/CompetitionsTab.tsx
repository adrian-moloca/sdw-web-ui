import React, { JSX, useState, useCallback } from 'react';
import { t } from 'i18next';
import { useDataScopeStatus } from 'hooks/useDataScopeStatus';
import { Metrics } from './components';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataScopeStatusTable, useColumnsCompetitions } from './components/DataScopeStatusTable';
import {
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import { DeliveryStatusBreakDown } from 'types/delivery-data-scope';

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
    competitionDeliveryStatusTotalCount,
    isLoadingCompetitions,
    isLoadingCompetitionsSummary,
    isErrorCompetitions,
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

  if (isLoadingCompetitions && isLoadingCompetitionsSummary) {
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
          deliveryStatus={competitionDeliveryStatus}
          currentTab="competitions"
          onCardSelect={handleStatusSelect}
          selectedCard={selectedStatus}
        />
      }
      rightContent={
        <DataScopeStatusTable
          rows={competitionDeliveryStatusBreakDown as DeliveryStatusBreakDown[]}
          columns={columnsCompetitions as GridColDef[]}
          isLoading={isLoadingCompetitions}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          onSearchChange={handleSearchChange}
          rowCount={competitionDeliveryStatusTotalCount}
        />
      }
    />
  );
};

export default CompetitionsTab;
