import React, { JSX } from 'react';
import useAppRoutes from 'hooks/useAppRoutes';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  GridFilterInputValueProps,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-pro';
import { EntityType, Entry, EnumType, IEnumProps, TemplateType, useEnums } from '../../models';
import { AutocompleteFilterCell } from './AutocompleteFilterCell';
import { EnumTemplate, FieldTemplate } from '../templates';
import { AutocompleteEditInputCell } from './AutocompleteEditInputCell';

type RenderProps = {
  params: GridRenderCellParams<any>;
  type: EntityType;
  field: string;
  fieldId: string;
};

type EditEnumRenderProps = {
  params: GridRenderEditCellParams<IEnumProps>;
  options: Array<IEnumProps>;
};

export const LinkItem = ({ params, type, field, fieldId }: RenderProps): JSX.Element => {
  const { getDetailRoute } = useAppRoutes();
  if (!params.value) return <Typography variant="body1">{'-'}</Typography>;
  return (
    <Typography variant="body1" component={Link} to={getDetailRoute(type, params.row[fieldId])}>
      {params.row[field]}
    </Typography>
  );
};

export const MainLinkItem = ({ params, type }: RenderProps): React.ReactElement => {
  const { getDetailRoute } = useAppRoutes();
  const { row } = params;

  return (
    <Typography variant="body1" component={Link} to={getDetailRoute(type, row.id)}>
      {row.title}
    </Typography>
  );
};

export const EnumFilterItem = (params: GridFilterInputValueProps, type: EnumType) => {
  const { getEnumValues } = useEnums();

  return (
    <AutocompleteFilterCell
      params={params}
      options={getEnumValues(type)}
      loading={false}
      textField="text"
      keyField="code"
    />
  );
};

export const renderEnumCell = (
  params: GridRenderCellParams<any>,
  type: EnumType,
  plain: boolean
): JSX.Element => {
  return (
    <EnumTemplate type={type} value={params.value} withText={true} size={plain ? 'xs' : 'sm'} />
  );
};

export const renderTemplateCell = (
  params: GridRenderCellParams<any>,
  type: TemplateType,
  displayField = ''
): JSX.Element => {
  return (
    <FieldTemplate
      type={type}
      value={params.value}
      withText={true}
      title={displayField ? params.row[displayField] : ''}
    />
  );
};

export const renderMasterDataCell = (
  params: GridRenderCellParams<any>,
  data: Array<Entry>
): JSX.Element => {
  const value = data.find((x) => x.key === params.value);

  return (
    <FieldTemplate
      type={TemplateType.MasterData}
      value={value?.value ?? params.value}
      withText={true}
      size={'sm'}
    />
  );
};

export const renderCountryCell = (
  params: GridRenderCellParams<any>,
  data: Array<Entry>
): JSX.Element | null => {
  const value = data.find((x) => x.key === params.value);

  if (!params.value || params.value.indexOf('ABK') > -1) return null;

  return (
    <FieldTemplate
      type={TemplateType.IsoCode}
      value={params.value}
      title={value?.description ?? params.value}
      withText={true}
      size={'sm'}
    />
  );
};

export const EnumFieldItem = ({ params, options }: EditEnumRenderProps) => (
  <AutocompleteEditInputCell
    params={params}
    options={options}
    loading={false}
    textField="text"
    keyField="code"
  />
);
