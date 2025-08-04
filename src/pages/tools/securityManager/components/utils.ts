import split from 'lodash/split';
import map from 'lodash/map';
import trim from 'lodash/trim';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import { GridFilterInputSingleSelect, GridFilterOperator } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import { AugmentedUser, AugmentedApiClient, ApiClient, User } from './types';
export function safeJsonParse(value?: string): string {
  try {
    const parsed = JSON.parse(value ?? '');
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).join(', ');
    }
    return String(parsed);
  } catch {
    return value ?? '';
  }
}

export function mapUsersWithProfiles(users: User[]): AugmentedUser[] {
  return map(users, (user) => {
    const rawGroups = split(user.groups, ',');
    const cleanGroups = compact(map(rawGroups, (g) => trim(g)));
    const dataProfiles = filter(cleanGroups, (g) => g.includes('$'));
    const operationsProfiles = filter(cleanGroups, (g) => !g.includes('$'));

    return {
      ...user,
      dataProfiles,
      operationsProfiles,
    };
  });
}
function uppercaseFirstBlock(value: string): string {
  const parts = split(value, '|');

  if (parts.length === 0) return value;

  parts[0] = trim(parts[0]).toUpperCase();

  return parts[0];
}
export function mapClientsWithProfiles(clients: ApiClient[]): AugmentedApiClient[] {
  return map(clients, (client) => {
    const rawScopes = [
      ...split(client.defaultScopes ?? '', ','),
      ...split(client.scopes ?? '', ','),
    ];

    const cleanScopes = compact(map(rawScopes, (s) => uppercaseFirstBlock(trim(s))));
    const dataProfiles = filter(cleanScopes, (s) => s.includes('$'));
    const operationsProfiles = filter(cleanScopes, (s) => !s.includes('$'));

    return {
      ...client,
      dataProfiles,
      operationsProfiles,
    };
  });
}

export function getUniqueProfiles(
  data: AugmentedApiClient[] | AugmentedUser[],
  field: 'dataProfiles' | 'operationsProfiles'
): string[] {
  const all = data.flatMap((item) => item[field]);
  if (field == 'dataProfiles') {
    return Array.from(new Set([...all, t('general.all-data')])).sort((a, b) => a.localeCompare(b));
  }
  return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
}
export function getUniqueCompanies(data: AugmentedUser[], field: 'company'): string[] {
  const all = data.filter((x) => x.company).map((item) => item[field] ?? '');
  return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
}
export const arrayIncludesOperator: GridFilterOperator = {
  label: 'Contains (any)',
  value: 'arrayIncludes',
  getApplyFilterFn: (filterItem) => {
    if (!filterItem.value) {
      return null;
    }
    const filterValueLower = String(filterItem.value).toLowerCase();
    return (params) => {
      const cellValue = params.split(', '); // Cast to string[] assuming operationsProfiles is an array of strings
      if (!cellValue || cellValue.length === 0) {
        return false; // No profiles to check against, so it doesn't contain the filter value
      }
      return cellValue.some((profile: any) =>
        String(profile).toLowerCase().includes(filterValueLower)
      );
    };
  },
  InputComponent: GridFilterInputSingleSelect, // Use this for a dropdown with predefined options
};
