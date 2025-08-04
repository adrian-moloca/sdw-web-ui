import uniq from 'lodash/uniq';
import { ILabelValue } from 'models';
export const InactiveStatus = 'Inactive';
export const ActiveStatus = 'Active';
export const SecurityGroups: ILabelValue[] = [
  { value: 'SDW_ADMIN', label: 'SDW Administrator' },
  { value: 'SDW_VIEWER', label: 'SDW Viewer' },
  { value: 'SDW_INGEST', label: 'SDW Ingest' },
  { value: 'SDW_EDITOR', label: 'SDW Editor' },
  { value: 'SDW_GDS_VIEWER', label: 'SDW Extractor' },
  { value: 'SDW_GDS_EDITOR', label: 'SDW Reports' },
  { value: 'SDW_GDS_ADMIN', label: 'SDW Reports Administrator' },
  { value: 'GDS_EDITOR', label: 'GDS Editor (no-SDW)' },
  { value: 'GDS_SUPER_EDITOR', label: 'GDS Super-Editor (no-SDW)' },
  { value: 'GDS_ADMIN', label: 'GDS Administrator (no-SDW)' },
];
export const SecurityScopes: ILabelValue[] = [
  { value: 'DATA_READER', label: 'Data Reader' },
  { value: 'DATA_SERVICE', label: 'Data Manager' },
  { value: 'USDF_INGEST', label: 'USDF Ingest' },
  { value: 'USDM_SYNC_HORD', label: 'USDM Sync' },
  { value: 'INGEST_SERVICE', label: 'Ingest Service' },
  { value: 'CONSOLIDATION_SERVICE', label: 'Consolidation Service' },
  { value: 'SCHEMA_MANAGER', label: 'Schema Manager' },
  { value: 'SERVICE_MANAGER', label: 'Service Manager' },
  { value: 'OQS2024', label: 'OQS Reader' },
  { value: 'GDS_SUPER_EDITOR', label: 'GDS Editor' },
  { value: 'data_service', label: 'HORD Data Manager' },
  { value: 'ingest_service', label: 'HORD Ingest Service' },
];
export function mapSecurityGroupLabels(groupKeys: string[]): string[] {
  return uniq(groupKeys)
    .map((key) => SecurityGroups.find((g) => g.value === key)?.label)
    .filter((label): label is string => Boolean(label))
    .sort((a, b) => b.localeCompare(a));
}
export function mapSecurityScopesLabels(groupKeys: string[]): string[] {
  return uniq(groupKeys)
    .map((key) => SecurityScopes.find((g) => g.value === key)?.label)
    .filter((label): label is string => Boolean(label))
    .sort((a, b) => a.localeCompare(b));
}
