import { SearchPayload } from 'models';
import CryptoJS from 'crypto-js';
import has from 'lodash/has';
import size from 'lodash/size';

type RequestParameters = {
  [key: string]: string | number | boolean | null;
};

export const toURLBaseParams = (params: RequestParameters): string => {
  const urlParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return urlParams;
};

export const toURLParams = (params: RequestParameters): string => {
  const urlParams = Object.entries(params)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
    .join('&');

  return urlParams;
};

export const toURLSearchParams = (params: RequestParameters): URLSearchParams => {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null) urlSearchParams.append(key, String(value));
  }

  return urlSearchParams;
};

export const base64URLEncode = (words: CryptoJS.lib.WordArray): string => {
  return CryptoJS.enc.Base64.stringify(words)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

export const hasReport = (data: Array<any>, reports: Array<any>): boolean =>
  data && data.length > 0 && reports?.filter((e) => e.key == data[0].key).length > 0;

export function decodeJwt(jwtToken: string) {
  const [, payload] = jwtToken.split('.');
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload;
}

export const isTokenExpired = (token: string): boolean => {
  const decodedToken = decodeJwt(token);
  if (decodedToken?.exp) {
    // Convert expiration time to milliseconds
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    // Check if the token has expired
    return expirationTime < currentTime;
  }
  // Token is considered expired if decoding fails or expiration time is not present
  return true;
};

export const buildMasterDataUrl = (url: string, params?: any): string => {
  const uri = url.indexOf('?') === -1 ? `${url}?` : url;
  if (params) {
    const queryParams = [];
    if (has(params, 'start')) {
      queryParams.push(`start=${params.start}`);
    }
    if (has(params, 'rows')) {
      queryParams.push(`rows=${params.rows}`);
    }
    if (has(params, 'languageCode')) {
      queryParams.push(`languageCode=${params.languageCode}`);
    }
    if (has(params, 'search')) {
      queryParams.push(`search=${params.search}`);
    }
    return `${uri}${queryParams.join('&')}`;
  }
  return uri;
};

export const buildUrlId = (url: string, id: string): string => {
  return `${url}/${id}`;
};

export const buildSearchUrl = (url: string, params?: SearchPayload): string => {
  const uri = url.indexOf('?') === -1 ? `${url}?` : url;
  if (params) return `${uri}${processSearchPayload(params)}`;

  return uri;
};

export const processSearchPayload = (params: SearchPayload): string => {
  const queryParams = [];
  if (has(params, 'pagination') && size(params.pagination) > 0) {
    queryParams.push(`start=${params.pagination.start}`);
    if (params.pagination.rows) {
      queryParams.push(`rows=${params.pagination.rows}`);
    }
  }

  if (has(params, 'search') && (params.search?.length ?? 0) > 0) {
    queryParams.push(`search=${params.search}`);
  }

  return queryParams.join('&');
};

export const getUrlPart = (id: string): string => {
  if (id.startsWith('CMP')) return 'Competition';
  if (id.startsWith('DSP')) return 'Discipline';
  if (id.startsWith('EVT')) return 'Event';
  if (id.startsWith('STG')) return 'Stage';
  if (id.startsWith('PHA')) return 'Phase';
  if (id.startsWith('UNT')) return 'Unit';
  if (id.startsWith('SBU')) return 'SubUnit';
  if (id.startsWith('VEN')) return 'Venue';
  if (id.startsWith('TEM')) return 'Team';
  if (id.startsWith('IND')) return 'Individual';
  return 'Competition';
};

export const getFilterPart = (id: string): string => {
  if (id.startsWith('CMP')) return 'competition_id';
  if (id.startsWith('DSP')) return 'discipline_id';
  if (id.startsWith('EVT')) return 'event_id';
  if (id.startsWith('STG')) return 'stage_id';
  if (id.startsWith('PHA')) return 'phase_id';
  if (id.startsWith('UNT')) return 'unit_id';
  if (id.startsWith('SBU')) return 'subunit_id';
  if (id.startsWith('VEN')) return 'venue_id';
  if (id.startsWith('TEM')) return 'team_id';
  if (id.startsWith('IND')) return 'individual_id';
  return 'Competition';
};

export function getCookie(name: string): string | null {
  const matches = RegExp(
    // eslint-disable-next-line no-useless-escape
    new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`)
  ).exec(document.cookie);

  // Use optional chaining (?.) to safely access the property
  return matches?.[1] ? decodeURIComponent(matches[1]) : null;
}
