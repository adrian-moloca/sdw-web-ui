import {
  CreateURL,
  Logger,
  base64URLEncode,
  decodeJwt,
  getCookie,
  isTokenExpired,
  toURLBaseParams,
  toURLSearchParams,
} from '_helpers';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import appConfig, { apiConfig } from 'config/app.config';
import { IToken, store } from '../store';
import { SESSION_STORAGE } from 'constants/config';
import SessionStorage from '_helpers/session-storage';

const getStoreAccessToken = (): IToken | null => {
  const storedToken = localStorage.getItem(SESSION_STORAGE.AUTHORIZATION_USER_TOKEN);
  return storedToken ? JSON.parse(storedToken) : null;
};

const client = axios.create({
  headers: {
    version: import.meta.env.VITE_VERSION,
    'Access-Control-Allow-Origin': '*',
    'Accept-API-Version': 'resource=3.1, protocol=1.0',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    [appConfig.AUTH_TOKEN_COOKIE_NAME]: getCookie(appConfig.AUTH_TOKEN_COOKIE_NAME),
    Authorization: getStoreAccessToken()?.access_token,
  },
});

export const getSignalRAccessToken = (): string => {
  const storedToken = localStorage.getItem(SESSION_STORAGE.AUTHORIZATION_USER_TOKEN);
  return storedToken ? JSON.parse(storedToken) : '';
};

export const refreshAccessToken = async (): Promise<IToken> => {
  try {
    const codeVerifier = SessionStorage.getItem(SESSION_STORAGE.CODE_VERIFIER);
    const code = store.getState().auth.code;
    const data = {
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      code,
      client_id: apiConfig.clientId,
      redirect_uri: `${appConfig.webEndpoint}/auth`,
    };
    const response = await client.post(CreateURL.auth(), toURLSearchParams(data));
    return response.data;
  } catch (e: any) {
    Logger.warn(e);
    throw e;
  }
};

export const getBaseApiEndPoint = (baseUrl: string, realm: string, url: string) =>
  `${baseUrl}/auth/json/realms/${realm}/${url}`;

export const login = () => {
  try {
    const codeChallengeMethod: string = 'S256';
    const randomStringLength: number = 128;
    const codeVerifier: string = base64URLEncode(CryptoJS.lib.WordArray.random(randomStringLength));
    const codeChallenge: string = base64URLEncode(CryptoJS.SHA256(codeVerifier));
    SessionStorage.setItem(SESSION_STORAGE.CODE_VERIFIER, codeVerifier);
    SessionStorage.setItem(SESSION_STORAGE.GO_TO_LINK, window.location.href);
    const redirectUriAuth: string = `${appConfig.webEndpoint}/auth`;
    const data = {
      client_id: apiConfig.clientId,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
      redirect_uri: redirectUriAuth,
    };
    window.location.href = `${CreateURL.redirectAuth()}?${toURLBaseParams(data)}`;
  } catch (e: any) {
    Logger.warn(e);
    throw e;
  }
};

export const getSignalAccessToken = async (): Promise<string> => {
  return SessionStorage.getItem(SESSION_STORAGE.AUTHORIZATION_USER_TOKEN);
};

export const getAccessToken = async (): Promise<IToken> => {
  try {
    const codeVerifier = SessionStorage.getItem(SESSION_STORAGE.CODE_VERIFIER);
    const code = store.getState().auth.code ?? '';
    const requestOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const data = {
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      code,
      client_id: apiConfig.clientId,
      redirect_uri: `${appConfig.webEndpoint}/auth`,
    };
    const response = await axios.post(CreateURL.auth(), toURLSearchParams(data), requestOptions);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Logger.warn(error.message);
    }
    throw error;
  }
};

export const getSessionInfo = async (): Promise<any> => {
  try {
    const response = await client.get(`${appConfig.apiEndPoint}/auth/json/sessions`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Logger.warn(error.message);
    }
    throw error;
  }
};

export const logout = async (): Promise<string> => {
  const response = await client.post(CreateURL.logout());
  return response.data.json();
};

export const checkToken = async (): Promise<string> => {
  try {
    const response = await client.post(CreateURL.checkToken());
    return response.data.json();
  } catch (e: any) {
    Logger.warn(e);
    throw e;
  }
};

export const decodeToken = (): any => {
  const token = getStoreAccessToken();
  if (token) {
    const decodedPayload = decodeJwt(token.access_token);
    return decodedPayload;
    //const userName = decodedPayload.sub ?? decodedPayload.subname;
    //const userScopes = decodedPayload.scope;
  }
  return null;
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    const codeVerifier = SessionStorage.getItem(SESSION_STORAGE.CODE_VERIFIER);
    const token = getStoreAccessToken();
    if (codeVerifier || (token && !isTokenExpired(token.access_token))) {
      return true;
    }
    const authData = await getAccessToken();
    if (authData) return true;
    return false;
    // eslint-disable-next-line
  } catch (e: any) {
    return false;
  }
};

const authService = {
  refreshAccessToken,
  getSessionInfo,
  getStoreAccessToken,
  getBaseApiEndPoint,
  login,
  checkAuth,
  getAccessToken,
  logout,
  decodeToken,
};

export default authService;
