import { Logger } from '../_helpers/logger';
import { useDispatch } from 'react-redux';
import { AppDispatch, authActions, IManagerSetup } from 'store';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { EntityType, IConfigProps, MetadataModel, QueryResponse, SearchPayload } from 'models';
import appConfig, { apiConfig } from 'config/app.config';
import {
  buildSearchUrl,
  buildMasterDataUrl,
  buildUrlId,
  isDevelopment,
  isTokenExpired,
} from '_helpers';
import authService from 'services/auth';
import JSZip from 'jszip';
import xmljs from 'xml-js';
import { saveAs } from 'file-saver';
import { useModelConfig } from 'hooks';
import { mockedApiResponse as mockedDeliveryScopeStatusResponse } from 'mocks/delivery-data-scope';
import { useTranslation } from 'react-i18next';

export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Unavailable = 500,
  GatewayTimeout = 504,
  // Add more status codes as needed
}

export type UseApiService = {
  api: AxiosInstance;
  filter: (url: string, payload?: any) => Promise<any>;
  fetch: (url: string, anonymous?: boolean) => Promise<any>;
  execute: (url: string, payload?: any) => Promise<any>;
  patch: (url: string, payload?: any) => Promise<any>;
  fetchPayload: (url: string, payload?: any) => Promise<any>;
  fetchService: (url: string) => Promise<any>;
  search: (url: string, payload?: SearchPayload) => Promise<any>;
  getMasterData: (url: string, payload?: any, anonymous?: boolean) => Promise<any>;
  getMetadata: (type: EntityType) => Promise<{ [p: string]: MetadataModel }>;
  getManagerSetup: () => Promise<IManagerSetup>;
  getHidden: (config: IConfigProps) => Promise<QueryResponse<any>>;
  getById: (config: IConfigProps, id: string, custom_url?: string) => Promise<any>;
  getDeliveryScopeStatusData: (payload: string) => Promise<any>;
  post: (url: string, payload?: any, anonymous?: boolean) => Promise<any>;
  put: (url: string, payload: any) => Promise<any>;
  deleteAny: (url: string, payload?: any) => Promise<any>;
  downloadFile: (url: string, filename: string) => Promise<void>;
  downloadReport: (url: string, filename: string) => Promise<any>;
  downloadReportXML: (downloadUrl: string, filename: string) => Promise<void>;
  downloadReportJson: (downloadUrl: string, filename: string, open: boolean) => Promise<void>;
  downloadExport: (url: string, filename: string) => Promise<void>;
  downloadReportExcel: (downloadUrl: string, filename: string) => Promise<void>;
  downloadExtractor: (url: string, payload: any, filename: string) => Promise<void>;
  uploadFiles: (url: string, files: FileList) => Promise<void>;
};

const useApiService = (): UseApiService => {
  const dispatch = useDispatch<AppDispatch>();
  const { getConfig } = useModelConfig();
  const { i18n } = useTranslation();
  const api: AxiosInstance = axios.create({
    baseURL: apiConfig.apiUsdmEndPoint,
    responseType: 'json',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      'Accept-API-Version': 'resource=3.1, protocol=1.0',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${authService.getStoreAccessToken()?.access_token}`,
    },
    timeout: 15 * 60 * 1000, // Wait for 15 minutes before timing out
  });
  const apiPlain: AxiosInstance = axios.create({
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Authorization: `Bearer ${authService.getStoreAccessToken()?.access_token}`,
    },
  });
  const apiAnonymousService: AxiosInstance = axios.create({
    baseURL: apiConfig.apiUsdmEndPoint,
    responseType: 'json',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-API-Version': 'resource=3.1, protocol=1.0',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    },
    timeout: 15 * 60 * 1000, // Wait for 15 minutes before timing out
  });
  const apiService: AxiosInstance = axios.create({
    baseURL: apiConfig.apiUsdmEndPoint,
    responseType: 'json',
    headers: {
      accept: '*/*',
      origin: 'x-requested-with',
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-API-Version': 'resource=3.1, protocol=1.0',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${authService.getStoreAccessToken()?.access_token}`,
    },
    timeout: 15 * 60 * 1000, // Wait for 15 minutes before timing out
  });

  const handleUnauthorized = () => {
    dispatch(authActions.reset());
    authService.login();
  };

  function logDevelopmentError(error: AxiosError) {
    if (isDevelopment) {
      Logger.error(`Error: ${error.message}`);
      Logger.warn(error.config);
    }
  }

  function handleStatusCode(status: number, error: AxiosError) {
    switch (status) {
      case HttpStatusCode.Ok:
        return;
      case HttpStatusCode.GatewayTimeout:
      case HttpStatusCode.NotFound:
        return {};
      case HttpStatusCode.Unauthorized:
        handleUnauthorized();
        break;
      default:
        logDevelopmentError(error);
    }
  }
  const apiInterceptor = (error: AxiosError) => {
    if (error.response) {
      handleStatusCode(error.response.status, error);
    } else if (error.request) {
      Logger.warn('No response received for the request.');
    } else {
      Logger.warn(`Error setting up the request: ${error.message}`);
    }

    return Promise.reject(error);
  };
  api.interceptors.request.use(async (config) => {
    if (config.headers.Authorization && isTokenExpired(config.headers.Authorization as string)) {
      try {
        const newToken = await authService.getAccessToken();
        dispatch(authActions.setAuthorizationToken(newToken));
        config.headers.Authorization = `Bearer ${newToken.access_token}`;
        return config;
      } catch (refreshError) {
        dispatch(authActions.reset());
        authService.login();
        const error =
          refreshError instanceof Error ? refreshError : new Error('Token refresh failed');
        return Promise.reject(error);
      }
    }
    return config;
  });
  api.interceptors.response.use((response) => response, apiInterceptor);
  apiPlain.interceptors.response.use((response) => response, apiInterceptor);
  const getMetadata = async (type: EntityType): Promise<{ [key: string]: MetadataModel }> => {
    try {
      const url = `${getConfig(type).apiNode}/search/metadata`;
      const response = await api.get(url);
      return response.data as { [key: string]: MetadataModel };
    } catch (error) {
      Logger.error(`Error in GET request: ${error}`);
    }
    return {};
  };
  const getManagerSetup = async (): Promise<IManagerSetup> => {
    try {
      const url = `${apiConfig.reportManagerEndPoint}/setup`;
      const response = await api.get(url);
      return response.data as IManagerSetup;
    } catch (error) {
      Logger.error(`Error in GET request: ${error}`);
    }
    return {} as IManagerSetup;
  };
  const getMasterData = async (
    url: string,
    payload?: any,
    anonymous?: boolean
  ): Promise<QueryResponse<any>> => {
    try {
      if (anonymous === true) {
        const response = await apiAnonymousService.get(buildMasterDataUrl(url, payload));
        return response.data;
      }
      const response = await api.get(buildMasterDataUrl(url, payload));
      return response.data;
    } catch (error) {
      Logger.error(`Error in GET Master Data request: ${error}`);
    }
    return {} as QueryResponse<any>;
  };
  const getHidden = async (config: IConfigProps): Promise<QueryResponse<any>> => {
    try {
      const url = `${apiConfig.apiEndPoint}${appConfig.CONSOLIDATION}/${config.entityName}/hidden`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      Logger.error(`Error in GET Hidden request: ${error}`);
    }
    return {} as QueryResponse<any>;
  };
  async function fetch(url: string, anonymous?: boolean): Promise<any> {
    try {
      if (anonymous === true) {
        const response = await apiAnonymousService.get(url);
        return response.data;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      Logger.error(`Error in FETCH request: ${error}`);
      return null;
    }
  }
  async function fetchPayload(url: string, payload?: any): Promise<any> {
    try {
      const response = await api.get(url, payload);
      return response.data;
    } catch (error) {
      Logger.error(`Error in FETCH request: ${error}`);
      return null;
    }
  }
  async function fetchService(url: string): Promise<any> {
    try {
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      Logger.error(`Error in FETCH request: ${error}`);
      return null;
    }
  }
  const getById = async (config: IConfigProps, id: string, custom_url?: string): Promise<any> => {
    try {
      let url = `${apiConfig.apiUsdmEndPoint}${config.apiNode}/${id}?languageCode=${i18n.language}`;
      if (custom_url) {
        url = custom_url;
        const response = await api.get(buildUrlId(url, id));
        return response.data;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      Logger.error(`Error in GET request: ${error}`);
    }
  };
  const post = async (url: string, payload?: any, anonymous?: boolean): Promise<any> => {
    try {
      if (anonymous === true) {
        const response = await apiAnonymousService.post(url, payload);
        return response.data;
      }
      const response = await api.post(url, payload);
      return response.data;
    } catch (error) {
      Logger.error(`Error in POST request: ${error}`);
      throw error;
    }
  };
  const execute = async (url: string, payload?: any): Promise<any> => {
    try {
      const response = await api.post(url, payload, { timeout: 30 * 60 * 1000 });
      return response.data;
    } catch (error) {
      Logger.error(`Error in EXECUTE request: ${error}`);
      throw error;
    }
  };
  const patch = async (url: string, payload?: any): Promise<any> => {
    try {
      await apiPlain.patch(url, payload);
      return '';
    } catch (error) {
      Logger.error(`Error in PATCH request: ${error}`);
      throw error;
    }
  };
  const filter = async (url: string, payload?: any): Promise<any> => {
    try {
      const finalPayload = payload
        ? {
            enablePagination: payload.enablePagination,
            rows: payload.rows,
            search: payload.search,
            start: payload.start,
            sort: payload.sort,
            filters: payload.filters,
            ...payload.extendedFilters,
          }
        : {};
      const response = await api.post(url, finalPayload);
      return response.data;
    } catch (error) {
      Logger.error(`Error in POST request: ${error}`);
      throw error;
    }
  };
  const search = async (url: string, payload?: SearchPayload): Promise<any> => {
    try {
      const finalPayload = payload
        ? { sort: payload.sort, query: payload.query, ...payload.extendedFilters }
        : {};
      const response = await api.post(buildSearchUrl(url, payload), finalPayload);
      return response.data;
    } catch (error) {
      Logger.error(`Error in SEARCH request: ${error}`);
      throw error;
    }
  };
  const put = async (url: string, payload: any): Promise<any> => {
    try {
      const response = await api.put(url, payload);
      return response.data;
    } catch (error) {
      Logger.error(`Error in PUT request: ${error}`);
      throw error;
    }
  };
  const deleteAny = async (url: string, payload?: any): Promise<any> => {
    try {
      if (payload) {
        const response = await api.delete(url, { data: payload });
        return response.data;
      }
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      Logger.error(`Error in DELETE request: ${error}`);
      throw error;
    }
  };

  const downloadFile = async (url: string, filename: string): Promise<void> => {
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      saveAs(blob, filename);
    } catch (error) {
      Logger.error(`Error in downloading the file ${filename}: ${error}`);
    }
  };
  const downloadExtractor = async (url: string, payload: any, filename: string): Promise<void> => {
    try {
      const response = await api.post(url, payload, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      saveAs(blob, filename);
    } catch (error) {
      Logger.error(`Error in downloading the file ${filename}: ${error}`);
    }
  };
  const downloadExport = async (url: string, filename: string): Promise<void> => {
    try {
      const response = await api.get(url, { responseType: 'arraybuffer' });
      saveAs(response.data, filename);
    } catch (error) {
      Logger.error(`Error in downloading the file ${filename}: ${error}`);
    }
  };
  const downloadReport = async (url: string, filename: string): Promise<any> => {
    try {
      const response = await api.get(url, { responseType: 'arraybuffer' });
      const headerValue = response.headers['x-gds-report-notation'];
      const decodedValue = decodeURIComponent(headerValue);
      const jsonValue = JSON.parse(decodedValue);
      const zip = new JSZip();
      const zipFile = await zip.loadAsync(response.data);
      const xmlContent = await zipFile.files[jsonValue.display].async('string');
      return xmljs.xml2js(xmlContent, { compact: true });
    } catch (error) {
      // Handle error
      Logger.error(`Error in downloading the file ${filename}: ${error}`);
      return '';
    }
  };
  const downloadReportXML = async (downloadUrl: string, filename: string): Promise<void> => {
    try {
      const response = await api.get(downloadUrl, { responseType: 'arraybuffer' });
      const headerValue = response.headers['x-gds-report-notation'];
      const decodedValue = decodeURIComponent(headerValue);
      const jsonValue = JSON.parse(decodedValue);
      const zip = new JSZip();
      const zipFile = await zip.loadAsync(response.data);
      const xmlContent = await zipFile.files[jsonValue.display].async('string');
      const blob = new Blob([xmlContent], { type: 'text/xml' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = jsonValue.display;
      link.click();
      // Clean up the URL object after download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Handle error
      Logger.error(`Error in downloading the file ${filename}: ${error}`);
    }
  };
  const downloadReportExcel = async (downloadUrl: string, filename: string): Promise<void> => {
    try {
      const response = await api.get(downloadUrl, { responseType: 'arraybuffer' });
      const zip = new JSZip();
      const zipFile = await zip.loadAsync(response.data);
      const xmlContent = await zipFile.files[filename].async('string');
      const blob = new Blob([xmlContent], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Logger.error(`Error in downloading the file ${filename}: ${error}`);
    }
  };
  const downloadReportJson = async (
    downloadUrl: string,
    filename: string,
    open: boolean
  ): Promise<void> => {
    try {
      const response = await api.get(downloadUrl, { responseType: 'arraybuffer' });
      const zip = new JSZip();
      const zipFile = await zip.loadAsync(response.data);
      const xmlContent = await zipFile.files[filename].async('string');
      const blob = new Blob([xmlContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      if (open) {
        const newTab = window.open(url, '_blank');
        URL.revokeObjectURL(url);
        if (newTab === null) {
          alert('Popup blocked. Please allow popups for this site.');
        }
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      // Handle error
      Logger.error(`Error in downloading the file ${filename}: ${error}`);
    }
  };
  const uploadFiles = async (url: string, files: FileList): Promise<void> => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));
      const res = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 204) {
        throw new Error('no content');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.message);
      } else {
        throw new Error('Files Upload: Unknown Error');
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getDeliveryScopeStatusData = async (_payload: string) => {
    // try {
    //   const url = `${apiConfig.reportManagerEndPoint}/scope/status`;
    //   const response = await api.post(url, payload);
    //   return response.data;
    // } catch (error) {
    //   Logger.error(`Error in POST request: ${error}`);
    // }
    // return {} as IManagerSetup;

    return Promise.resolve(mockedDeliveryScopeStatusResponse);
  };

  return {
    api,
    filter,
    fetch,
    execute,
    patch,
    fetchPayload,
    fetchService,
    search,
    getMasterData,
    getMetadata,
    getManagerSetup,
    getHidden,
    getById,
    getDeliveryScopeStatusData,
    post,
    put,
    deleteAny,
    downloadFile,
    downloadReport,
    downloadReportXML,
    downloadReportJson,
    downloadExport,
    downloadReportExcel,
    downloadExtractor,
    uploadFiles,
  };
};
export default useApiService;
