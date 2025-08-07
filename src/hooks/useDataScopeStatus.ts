import { useEffect, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import useApiService from './useApiService';
import {
  DeliveryDataScopePayload,
  DeliveryStatus,
  DeliveryStatusBreakDown,
} from 'types/delivery-data-scope';
import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-pro';
import { transformFilters, transformSort } from 'utils/data-scope-status';

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
  packageDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  packageDeliveryStatusTotalCount?: number;
  isLoadingPackages: boolean;
  isLoadingPackagesSummary: boolean;
  isErrorPackages: boolean;
  competitionDeliveryStatus: DeliveryStatus;
  competitionDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  competitionDeliveryStatusTotalCount?: number;
  isLoadingCompetitions: boolean;
  isLoadingCompetitionsSummary: boolean;
  isErrorCompetitions: boolean;
};

export const overallStatusMap: { [key: string]: string } = {
  all: 'all',
  fullyReceived: 'FullyReceived',
  partiallyReceived: 'PartiallyReceivedWithoutErrors',
  partiallyReceivedWithErrors: 'PartiallyReceivedWithErrors',
  notReceived: 'NotReceived',
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

  const editionId = setupData?.currentEdition?.id;

  useEffect(() => {
    setStatusToFetch(selectedStatus);
  }, [selectedStatus]);

  const computePayload = (): DeliveryDataScopePayload => {
    const filters = transformFilters(filterModel);
    const sort = transformSort(sortModel);

    if (statusToFetch !== 'all') {
      filters.push({
        column: 'overallStatus',
        isNot: false,
        operator: 'equal',
        value: overallStatusMap[statusToFetch],
      });
    }

    return {
      editionId: String(editionId),
      enablePagination: true,
      start: paginationModel.page * paginationModel.pageSize,
      rows: paginationModel.pageSize,
      filters,
      sort,
      search: searchQuery || '',
    };
  };

  const deliveryScopeStatusDataQuery = {
    queryKey: [
      'deliveryScopeStatusData',
      editionId,
      paginationModel,
      statusToFetch,
      filterModel,
      sortModel,
      searchQuery,
    ],
    queryFn: async () => {
      const payload = computePayload();

      return apiService.getDeliveryScopeStatusData(payload);
    },
    enabled: Boolean(editionId) && selectedTab === 'competitions',
    retry: 1,
  };

  const deliveryScopeStatusSummaryQuery = {
    queryKey: ['deliveryScopeStatusSummary'],
    queryFn: async () => {
      return apiService.getDeliveryScopeStatusSummary();
    },
    enabled: Boolean(editionId) && selectedTab === 'competitions',
    retry: 1,
  };

  const packagesDataQuery = {
    queryKey: [
      'packagesData',
      editionId,
      paginationModel,
      statusToFetch,
      filterModel,
      sortModel,
      searchQuery,
    ],
    queryFn: async () => {
      const payload = computePayload();

      return apiService.getPackagesData(payload);
    },
    enabled: Boolean(editionId) && selectedTab === 'packages',
    retry: 1,
  };

  const packagesSummaryQuery = {
    queryKey: ['packagesSummary'],
    queryFn: async () => {
      return apiService.getPackagesSummary();
    },
    enabled: Boolean(editionId) && selectedTab === 'packages',
    retry: 1,
  };

  const results = useQueries({
    queries: [
      deliveryScopeStatusDataQuery,
      deliveryScopeStatusSummaryQuery,
      packagesDataQuery,
      packagesSummaryQuery,
    ],
  });

  if (setupError) {
    console.error('Setup query error:', setupError);
  }

  const [
    {
      data: deliveryScopeStatus,
      isLoading: isLoadingDeliveryScopeStatus,
      isPending: isPendingDeliveryScopeStatus,
      isError: isErrorDeliveryScopeStatus,
    },
    {
      data: deliveryScopeStatusSummary,
      isLoading: isLoadingDeliveryScopeStatusSummary,
      isPending: isPendingDeliveryScopeStatusSummary,
      isError: isErrorDeliveryScopeStatusSummary,
    },
    {
      data: packages,
      isLoading: isLoadingPackagesData,
      isPending: isPendingPackagesData,
      isError: isErrorPackagesData,
    },
    {
      data: packagesSummary,
      isLoading: isLoadingPackagesSummaryData,
      isPending: isPendingPackagesSummaryData,
      isError: isErrorPackagesSummaryData,
    },
  ] = results;

  const isLoadingSetup = isPendingSetupData || isLoadingSetupData;

  return {
    packageDeliveryStatus: packagesSummary,
    packageDeliveryStatusBreakDown: packages?.content ?? [],
    packageDeliveryStatusTotalCount: packages?.pagination?.total,
    isLoadingPackages: isLoadingPackagesData || isPendingPackagesData || isLoadingSetup,
    isLoadingPackagesSummary: isLoadingPackagesSummaryData || isPendingPackagesSummaryData,
    isErrorPackages: isErrorPackagesData || isErrorPackagesSummaryData,
    competitionDeliveryStatus: deliveryScopeStatusSummary,
    competitionDeliveryStatusBreakDown: deliveryScopeStatus?.content ?? [],
    competitionDeliveryStatusTotalCount: deliveryScopeStatus?.pagination?.total,
    isLoadingCompetitions:
      isLoadingDeliveryScopeStatus || isPendingDeliveryScopeStatus || isLoadingSetup,
    isLoadingCompetitionsSummary:
      isLoadingDeliveryScopeStatusSummary || isPendingDeliveryScopeStatusSummary,
    isErrorCompetitions: isErrorDeliveryScopeStatus || isErrorDeliveryScopeStatusSummary,
  };
};
