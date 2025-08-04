import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useApiService from './useApiService';
import {
  DeliveryDataScopeResponse,
  DeliveryStatus,
  DeliveryStatusBreakDown,
} from 'types/delivery-data-scope';

export type UseDataScopeStatus = {
  packageDeliveryStatus: DeliveryStatus;
  competitionsDeliveryStatus: DeliveryStatus;
  packageDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  competitionsDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  isLoading: boolean;
  isError: boolean;
};

export const useDataScopeStatus = (
  paginationModel: { pageSize: number; page: number },
  selectedStatus: string
): UseDataScopeStatus => {
  const apiService = useApiService();
  const [statusToFetch, setStatusToFetch] = useState(selectedStatus);

  const {
    data: setupData,
    isLoading: isLoadingSetupData,
    isPending: isPendingSetupData,
  } = useQuery({
    queryKey: ['setup'],
    queryFn: () => apiService.getManagerSetup(),
  });

  const editionId = setupData?.currentEdition?.id;

  useEffect(() => {
    setStatusToFetch(selectedStatus);
  }, [selectedStatus]);

  const {
    data: deliveryDataScope,
    isLoading: isLoadingDeliveryDataScope,
    isPending: isPendingDeliveryDataScope,
    isError,
  } = useQuery<DeliveryDataScopeResponse>({
    queryKey: ['deliveryScopeStatus', editionId, paginationModel, statusToFetch],
    queryFn: () => {
      const params = new URLSearchParams({
        editionId: editionId!,
        start: String(paginationModel.page * paginationModel.pageSize),
        rows: String(paginationModel.pageSize),
        ...(statusToFetch !== 'all' && { status: statusToFetch }),
      });

      return apiService.getDeliveryScopeStatusData(
        `/api/manager/scope/status?${params.toString()}`
      );
    },
    enabled: Boolean(editionId),
  });

  const content = deliveryDataScope?.content?.[0];

  return {
    packageDeliveryStatus: content?.packageDeliveryStatus as DeliveryStatus,
    competitionsDeliveryStatus: content?.competitionsDeliveryStatus as DeliveryStatus,
    competitionsDeliveryStatusBreakDown: content?.competitionsDeliveryStatusBreakDown ?? [],
    packageDeliveryStatusBreakDown: content?.packageDeliveryStatusBreakDown ?? [],
    isLoading:
      isLoadingDeliveryDataScope ||
      isLoadingSetupData ||
      isPendingDeliveryDataScope ||
      isPendingSetupData,
    isError,
  };
};
