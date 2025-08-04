import axios, { AxiosInstance } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { store } from 'store';

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      //staleTime: 5 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      //cacheTime: 1*60*60*1000,
      //staleTime: 1*60*60*1000,
    },
  },
});

const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
  responseType: 'json',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-API-Version': 'resource=3.1, protocol=1.0',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
  },
  timeout: 900000, // Wait for 15 minutes before timing out
});

client.interceptors.request.use(async (config) => {
  const bearer = `Bearer ${store.getState().auth.token?.access_token}`;
  config.headers.Authorization = bearer;
  config.timeout = 900000; // Wait for 15 minutes before timing out
  config.withCredentials = true;
  return config;
});
