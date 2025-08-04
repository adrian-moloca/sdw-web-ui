import { renderHook } from '@testing-library/react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useDataScopeStatus } from './useDataScopeStatus';
import { UseStoreCache, useStoreCache } from './useStoreCache';
import useApiService, { type UseApiService } from './useApiService';
import { mockedApiResponse } from 'mocks/delivery-data-scope';

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('./useStoreCache', () => ({
  useStoreCache: vi.fn(),
}));

vi.mock('./useApiService', () => ({
  default: vi.fn(),
}));

const mockUseQuery = vi.mocked(useQuery);
const mockUseStoreCache = vi.mocked(useStoreCache);
const mockUseApiService = vi.mocked(useApiService);

const defaultMockQueryResult = {
  data: undefined,
  error: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  refetch: vi.fn(),
};

describe('useDataScopeStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseApiService.mockReturnValue({
      getDeliveryScopeStatusData: vi.fn().mockResolvedValue({ content: [] }),
    } as unknown as UseApiService);
  });

  it('should return loading state initially', () => {
    mockUseStoreCache.mockReturnValue({
      managerSetup: { currentEdition: { id: 'edition-123' }, defaultFormat: 'xml' },
      handleManagerSetup: vi.fn(),
    } as unknown as UseStoreCache);
    mockUseQuery.mockReturnValue({
      ...defaultMockQueryResult,
      isLoading: true,
      isPending: true,
    } as unknown as UseQueryResult);

    const { result } = renderHook(() => useDataScopeStatus({ page: 0, pageSize: 25 }, 'all'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should return data on successful fetch', () => {
    mockUseStoreCache.mockReturnValue({
      managerSetup: { currentEdition: { id: 'edition-123' }, defaultFormat: 'xml' },
      handleManagerSetup: vi.fn(),
    } as unknown as UseStoreCache);

    mockUseQuery.mockReturnValue({
      ...defaultMockQueryResult,
      isLoading: false,
      isPending: false,
      data: mockedApiResponse,
    } as unknown as UseQueryResult);

    const { result } = renderHook(() => useDataScopeStatus({ page: 0, pageSize: 25 }, 'all'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.ingestionDeliveryStatus.fullyReceived.count).toBe(90);
    expect(result.current.deliveryStatusBreakDown?.[0].competitionName).toBe(
      'Ingestion Archive One'
    );
  });

  it('should return error state on fetch failure', () => {
    mockUseStoreCache.mockReturnValue({
      managerSetup: { currentEdition: { id: 'edition-123' }, defaultFormat: 'xml' },
      handleManagerSetup: vi.fn(),
    } as unknown as UseStoreCache);

    mockUseQuery.mockReturnValue({
      ...defaultMockQueryResult,
      isLoading: false,
      isPending: false,
      isError: true,
      data: undefined,
    } as unknown as UseQueryResult);

    const { result } = renderHook(() => useDataScopeStatus({ page: 0, pageSize: 25 }, 'all'));

    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return an empty array for deliveryStatusBreakDown when API content is empty', () => {
    mockUseStoreCache.mockReturnValue({
      managerSetup: { currentEdition: { id: 'edition-123' }, defaultFormat: 'xml' },
      handleManagerSetup: vi.fn(),
    } as unknown as UseStoreCache);

    mockUseQuery.mockReturnValue({
      ...defaultMockQueryResult,
      isLoading: false,
      isPending: false,
      data: { ...mockedApiResponse, content: [] },
    } as unknown as UseQueryResult);

    const { result } = renderHook(() => useDataScopeStatus({ page: 0, pageSize: 25 }, 'all'));

    expect(result.current.deliveryStatusBreakDown).toEqual([]);
    expect(result.current.ingestionDeliveryStatus).toBeUndefined();
  });

  it('should not fetch data if editionId is missing', () => {
    mockUseStoreCache.mockReturnValue({
      managerSetup: { currentEdition: undefined, defaultFormat: 'xml' },
      handleManagerSetup: vi.fn(),
    } as unknown as UseStoreCache);

    mockUseQuery.mockReturnValue({
      ...defaultMockQueryResult,
      isLoading: false,
      isPending: false,
      data: undefined,
    } as unknown as UseQueryResult);

    renderHook(() => useDataScopeStatus({ page: 0, pageSize: 25 }, 'all'));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});
