import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAsyncState, ISystemInfoProps, MenuFlagEnum, asyncStates } from '../models';
import axios from 'axios';
import { t } from 'i18next';
import { SECURITY_GROUP, SECURITY_SCOPE, SESSION_STORAGE } from 'constants/config';
import authService from 'services/auth';
import { Logger, decodeJwt, isDevelopment, isTokenExpired } from '_helpers';
import appConfig from 'config/app.config';
import SessionStorage from '_helpers/session-storage';

export interface IToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}
export interface IProfile {
  scopes: Array<string>;
  groups: Array<string>;
  flags: number;
}
export interface IUserInfo {
  loginName: string;
  fullName: string;
  email: string;
}
export interface IAuthState {
  isAuthorized: boolean;
  hasAuthorizationCode: boolean;
  error: any;
  registerError: any;
  forgotError: any;
  user?: IUserInfo | null;
  token: IToken | null;
  code: string | null;
  profile: IProfile;
  status: IAsyncState;
  systemInfo: ISystemInfoProps | undefined;
}
const name = 'authentication';
const initialState: IAuthState = createInitialState();
const logout = createAsyncThunk(`${name}/logout`, async () => {
  try {
    return await authService.logout();
  } catch (error: any) {
    if (error instanceof Error) {
      return Promise.reject(error);
    }
    return Promise.reject(new Error('An unknown error occurred'));
  }
});
const SECURITY_SCOPE_FLAGS_MAP: Map<SECURITY_SCOPE, MenuFlagEnum> = new Map([
  [SECURITY_SCOPE.CONSOLIDATION, MenuFlagEnum.Explorer | MenuFlagEnum.Consolidation],
  [SECURITY_SCOPE.INGEST, MenuFlagEnum.Explorer | MenuFlagEnum.Ingest],
  [SECURITY_SCOPE.READER, MenuFlagEnum.Explorer],
  [SECURITY_SCOPE.DATA, MenuFlagEnum.Explorer],
]);
const SECURITY_GROUP_FLAGS_MAP: Map<SECURITY_GROUP, MenuFlagEnum> = new Map([
  [SECURITY_GROUP.SDW_VIEWER, MenuFlagEnum.Explorer],
  [SECURITY_GROUP.SDW_EDITOR, MenuFlagEnum.Explorer | MenuFlagEnum.Consolidation],
  [SECURITY_GROUP.SDW_INGEST, MenuFlagEnum.Explorer | MenuFlagEnum.Ingest],
  [SECURITY_GROUP.GDS_VIEWER, MenuFlagEnum.Explorer | MenuFlagEnum.Extractor],
  [
    SECURITY_GROUP.GDS_EDITOR,
    MenuFlagEnum.Explorer |
      MenuFlagEnum.Reports |
      MenuFlagEnum.Biography |
      MenuFlagEnum.GamesTimeInfo,
  ],
  [
    SECURITY_GROUP.GDS_ADMIN,
    MenuFlagEnum.Explorer |
      MenuFlagEnum.Reports |
      MenuFlagEnum.ReportsSetup |
      MenuFlagEnum.Biography |
      MenuFlagEnum.GamesTimeInfo,
  ],
]);
const getFlagsFromGroup = (group: Array<string>): number => {
  if (group.includes(SECURITY_GROUP.SDW_ADMIN)) {
    return MenuFlagEnum.All;
  }
  let flag = MenuFlagEnum.None;
  for (const groupName of group) {
    const upperCaseGroupName = groupName.toUpperCase() as SECURITY_GROUP;
    const associatedFlag = SECURITY_GROUP_FLAGS_MAP.get(upperCaseGroupName);
    if (associatedFlag !== undefined) {
      flag |= associatedFlag;
    }
  }
  return flag;
};
const getFlagsFromScope = (scopes: Array<string>): number => {
  let flag = MenuFlagEnum.None;
  for (const scope of scopes) {
    const upperCaseScope = scope.toUpperCase() as SECURITY_SCOPE;
    const associatedFlag = SECURITY_SCOPE_FLAGS_MAP.get(upperCaseScope);
    if (associatedFlag !== undefined) {
      flag |= associatedFlag;
    }
  }
  return flag;
};
const slice = createSlice({
  name,
  initialState,
  reducers: {
    setAuthorizationCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
      state.status = asyncStates.pending;
      state.hasAuthorizationCode = true;
      SessionStorage.setItem(SESSION_STORAGE.AUTHORIZATION_CODE, JSON.stringify(action.payload));
      return state;
    },
    setAuthorizationToken: (state, action: PayloadAction<IToken>) => {
      localStorage.setItem(
        SESSION_STORAGE.AUTHORIZATION_USER_TOKEN,
        JSON.stringify(action.payload)
      );
      state.token = action.payload;
      const decodedPayload = decodeJwt(action.payload.access_token);
      if (decodedPayload) {
        state.user = {
          loginName: decodedPayload.sub ?? decodedPayload.subname,
          email: decodedPayload.email[0],
          fullName: decodedPayload.fullName[0],
        };
        state.profile = {
          scopes: decodedPayload.scope ?? [],
          groups: decodedPayload.groups ?? [],
          flags: getFlagsFromGroup(decodedPayload.groups),
        };
        if (!state.profile.groups || state.profile.groups.length === 0)
          state.profile.flags = getFlagsFromScope(decodedPayload.scope);
      }
      state.error = null;
      state.isAuthorized = true;
      state.status = asyncStates.resolved;
      axios.defaults.baseURL = import.meta.env.VITE_API_CONFIG_RESOURCE_URI;
      axios.defaults.headers.common.Authorization = `Bearer ${action.payload?.access_token ?? ''}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      return state;
    },
    decodeToken: (state) => {
      const token = getAuthToken();
      if (!token) return state;
      const decodedPayload = decodeJwt(token?.access_token);
      if (decodedPayload) {
        state.user = {
          loginName: decodedPayload.sub ?? decodedPayload.subname,
          email: decodedPayload.email ? decodedPayload.email[0] : '',
          fullName: decodedPayload.fullName ? decodedPayload.fullName[0] : '',
        };
        state.profile = {
          scopes: decodedPayload.scope ?? [],
          groups: decodedPayload.groups ?? [],
          flags: getFlagsFromGroup(decodedPayload.groups),
        };
        if (state.profile.groups.length === 0)
          state.profile.flags = getFlagsFromScope(decodedPayload.scope);
        if (isDevelopment) {
          Logger.info(state.user);
          Logger.info(state.profile);
        }
      }
      state.systemInfo = {
        applicationName: t('main.project.name'),
        environment: import.meta.env.NODE_ENV ?? 'development',
        version: import.meta.env.VITE_VERSION,
        server: import.meta.env.VITE_API_HOST,
      };
      return state;
    },
    reset: (state) => {
      state.user = null;
      state.token = null;
      state.code = null;
      state.isAuthorized = state.hasAuthorizationCode = false;
      state.status = asyncStates.idle;
      state.profile = { scopes: [], groups: [], flags: MenuFlagEnum.None };
      SessionStorage.clear();
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.code = null;
      state.isAuthorized = state.hasAuthorizationCode = false;
      state.status = asyncStates.resolved;
      axios.defaults.headers.common.Authorization = '';
      SessionStorage.clear();
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_USER_KEY);
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_USER_TOKEN);
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_CODE);
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_CODE);
      return state;
    });
    builder.addCase(logout.rejected, (state) => {
      state.user = null;
      state.token = null;
      state.code = null;
      state.isAuthorized = state.hasAuthorizationCode = false;
      state.status = asyncStates.resolved;
      axios.defaults.headers.common.Authorization = '';
      SessionStorage.clear();
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_USER_KEY);
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_USER_TOKEN);
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_CODE);
      localStorage.removeItem(SESSION_STORAGE.AUTHORIZATION_CODE);
      return state;
    });
  },
});

// exports
export const authActions = { ...slice.actions, logout };
export const authReducer = slice.reducer;
export const authSelector = (state: IAuthState) => state.user;
// implementation
function getAuthToken(): IToken | null {
  const storedToken = localStorage.getItem(SESSION_STORAGE.AUTHORIZATION_USER_TOKEN);
  return storedToken ? JSON.parse(storedToken) : null;
}
function createInitialState(): IAuthState {
  const userLocal = localStorage.getItem(SESSION_STORAGE.AUTHORIZATION_USER_KEY);
  const storedToken = localStorage.getItem(SESSION_STORAGE.AUTHORIZATION_USER_TOKEN);
  const token = storedToken ? JSON.parse(storedToken) : null;
  return {
    // initialize state from local storage to enable user to stay logged in
    user: userLocal ? JSON.parse(userLocal) : {},
    status: asyncStates.idle,
    hasAuthorizationCode: Boolean(SessionStorage.getItem(SESSION_STORAGE.CODE_VERIFIER)),
    isAuthorized: Boolean(token) && !isTokenExpired(token.access_token),
    error: null,
    code: SessionStorage.getItem(SESSION_STORAGE.AUTHORIZATION_CODE),
    token: null,
    profile: { scopes: [], groups: [], flags: MenuFlagEnum.None },
    registerError: null,
    forgotError: null,
    systemInfo: {
      applicationName: t('general.ApplicationName'),
      environment: appConfig.forgeRockRealm,
      version: appConfig.version,
      server: import.meta.env.VITE_API_HOST,
    },
  };
}
