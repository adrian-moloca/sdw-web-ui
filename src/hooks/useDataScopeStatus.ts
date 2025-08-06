import { useEffect, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import useApiService from './useApiService';
import {
  DeliveryDataScopePayload,
  DeliveryStatus,
  DeliveryStatusBreakDown,
} from 'types/delivery-data-scope';
import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-pro';
import { transformSort, transformFilters } from 'utils/data-scope-status';

export interface DataScopeStatusParams {
  paginationModel: { pageSize: number; page: number };
  selectedStatus: string;
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
  searchQuery?: string;
  selectedTab: 'packages' | 'competitions';
}

export type UseDataScopeStatus = {
  packageDeliveryStatus: DeliveryStatus;
  competitionDeliveryStatus: DeliveryStatus;
  packageDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  competitionDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  isLoading: boolean;
  isError: boolean;
  packageDeliveryStatusTotalCount?: number;
  competitionDeliveryStatusTotalCount?: number;
};

export const useDataScopeStatus = ({
  paginationModel,
  selectedStatus,
  filterModel,
  sortModel,
  searchQuery,
  selectedTab,
}: DataScopeStatusParams): UseDataScopeStatus => {
  const apiService = useApiService();
  const [statusToFetch, setStatusToFetch] = useState(selectedStatus);

  const {
    data: setupData,
    isLoading: isLoadingSetupData,
    isPending: isPendingSetupData,
    error: setupError,
  } = useQuery({
    queryKey: ['setup'],
    queryFn: () => apiService.getManagerSetup(),
    retry: 1,
  });

  const editionId = setupData?.currentEdition?.id ?? 'E010003198074';

  useEffect(() => {
    setStatusToFetch(selectedStatus);
  }, [selectedStatus]);

  const competitionsQuery = {
    queryKey: [
      'deliveryScopeStatus',
      editionId,
      paginationModel,
      statusToFetch,
      filterModel,
      sortModel,
      searchQuery,
    ],
    queryFn: async () => {
      const filters = transformFilters(filterModel);
      const sort = transformSort(sortModel);

      const payload: DeliveryDataScopePayload = {
        editionId: String(editionId),
        enablePagination: true,
        start: paginationModel.page * paginationModel.pageSize,
        rows: paginationModel.pageSize,
        filters,
        sort,
        search: searchQuery || '',
        ...(statusToFetch !== 'all' && { status: statusToFetch }),
      };

      return apiService.getDeliveryScopeStatusData(payload);
    },
    enabled: Boolean(editionId) && selectedTab === 'competitions',
    retry: 1,
  };

  const packagesQuery = {
    queryKey: [
      'packagesSummary',
      editionId,
      paginationModel,
      statusToFetch,
      filterModel,
      sortModel,
      searchQuery,
    ],
    queryFn: async () => {
      const filters = transformFilters(filterModel);
      const sort = transformSort(sortModel);

      const payload: DeliveryDataScopePayload = {
        editionId: String(editionId),
        enablePagination: true,
        start: paginationModel.page * paginationModel.pageSize,
        rows: paginationModel.pageSize,
        filters,
        sort,
        search: searchQuery || '',
        ...(statusToFetch !== 'all' && { status: statusToFetch }),
      };

      return apiService.getPackagesSummary(payload);
    },
    enabled: Boolean(editionId) && selectedTab === 'packages',
    retry: 1,
  };

  const results = useQueries({
    queries: [competitionsQuery, packagesQuery],
  });

  if (setupError) {
    console.error('Setup query error:', setupError);
  }

  const competitionsResult = results[0].data?.content?.[0];
  const packagesResult = results[1]?.data;

  return {
    packageDeliveryStatus: competitionsResult?.packageDeliveryStatus,
    competitionDeliveryStatus: competitionsResult?.competitionDeliveryStatus as DeliveryStatus,
    competitionDeliveryStatusBreakDown:
      competitionsResult?.competitionDeliveryStatusBreakDown ?? [],
    packageDeliveryStatusBreakDown: packagesResult?.content,
    packageDeliveryStatusTotalCount: packagesResult?.pagination?.total,
    competitionDeliveryStatusTotalCount: 25,
    isLoading: results.some((query) => query.isLoading) || isPendingSetupData || isLoadingSetupData,
    isError: false,
  };
};
