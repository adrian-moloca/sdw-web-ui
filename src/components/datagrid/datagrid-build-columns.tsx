import {
  getGridBooleanOperators,
  GridColDef,
  GridColType,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterOperator,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-pro';
import {
  DisplayEntry,
  EntityType,
  Entry,
  EnumType,
  IEnumProps,
  MetadataModel,
  MetadataOption,
  TemplateType,
  useEnums,
} from 'models';
import { Chip, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import trim from 'lodash/trim';
import get from 'lodash/get';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { EnumTemplate, FieldTemplate } from '../templates';
import { formatMasterCode } from '_helpers';
import dayjs from 'dayjs';
import { TableCellProgress } from '../TableCellProgress';
import {
  EnumFieldItem,
  EnumFilterItem,
  LinkItem,
  MainLinkItem,
  renderCountryCell,
  renderEnumCell,
  renderMasterDataCell,
  renderTemplateCell,
} from './datagrid-render-columns';
import useAppRoutes from 'hooks/useAppRoutes';
import { TypographyLink } from 'components';
import baseConfig from 'baseConfig';
import orderBy from 'lodash/orderBy';

export const filterEnumOperators = (type: EnumType): GridFilterOperator[] => {
  return [
    {
      label: 'Is Any Of',
      value: 'isAnyOf',
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }

        return (params): any => params.value.id;
      },
      InputComponent: (params: GridFilterInputValueProps) => EnumFilterItem(params, type),
      // InputComponentProps: { type: 'singleSelect' },
      getValueAsString: (value: IEnumProps) => value.text,
    },
  ];
};

export const buildDisplayColumn = (
  field: string,
  label: string,
  width = 180,
  filterable = true
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    editable: false,
    filterable,
    renderCell: (params: GridRenderCellParams<any>) => params.value?.display,
  };
};

export const buildClickableColumn = (
  field: string,
  label: string,
  type: GridColType,
  onClick: (entity: any) => void,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    editable: false,
    type,
    renderCell: (params: GridRenderCellParams<any>) => {
      return (
        <Typography
          variant="body1"
          onClick={() => onClick(params.row)}
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
        >
          {params.value}
        </Typography>
      );
    },
  };
};

export const buildMainRouteColumn = (
  field: string,
  label: string,
  type: EntityType,
  width = 200
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => (
      <MainLinkItem params={params} type={type} field={field} fieldId={'id'} />
    ),
  };
};

export const buildRouteColumn = (
  field: string,
  fieldId: string,
  label: string,
  type: EntityType,
  width = 200,
  model?: MetadataModel
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    filterable: model?.allowFiltering ?? false,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => (
      <LinkItem params={params} type={type} field={field} fieldId={fieldId} />
    ),
  };
};
export const buildCompetitionsColumn = (field: string): GridColDef => {
  const { getDetailRoute } = useAppRoutes();
  return {
    field,
    headerName: t('general.competitions'),
    width: 380,
    filterable: false,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) =>
      params.value?.map((competition: any) => (
        <div key={competition.id}>
          <TypographyLink
            value={competition.title}
            route={getDetailRoute(EntityType.Competition, competition.id)}
          />
        </div>
      )),
  };
};
export const buildNameColumn = (width = 180, prefix = 'preferred'): GridColDef => {
  const familyName = prefix === '' ? `familyName` : `${prefix}FamilyName`;
  const givenName = prefix === '' ? `givenName` : `${prefix}GivenName`;

  return {
    field: `${prefix}Name`,
    headerName: t('common.name'),
    width,
    filterable: false,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => (
      <Typography variant="body1">
        {trim(`${params.row[givenName] ?? ''} ${params.row[familyName] ?? ''}`)}
      </Typography>
    ),
  };
};

export const buildLodashColumn = (
  field: string,
  label: string,
  fieldMap: string,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    filterable: true,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => (
      <Typography variant="body1">{get(params.row, fieldMap)}</Typography>
    ),
  };
};

export const buildDropDownColumn = (
  field: string,
  label: string,
  data: Array<any>,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    filterable: true,
    editable: false,
    type: 'singleSelect',
    valueOptions: data.map((x: any) => ({ label: x.title, value: x.id })),
    renderCell: (params: GridRenderCellParams<any>) => (
      <Typography variant="body1">{get(params.row, field)}</Typography>
    ),
  };
};

export const buildDropDownEdition = (
  field: string,
  label: string,
  data: Array<any>,
  width = 300
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    filterable: true,
    editable: false,
    type: 'singleSelect',
    valueOptions: data.map((x: any) => ({ label: x.title, value: x.id })),
    renderCell: (params: GridRenderCellParams<any>) => (
      <Typography variant="body1">{`${get(params.row, 'edition.name')} - ${get(params.row, 'edition.code')}`}</Typography>
    ),
  };
};

export const buildDropDownDiscipline = (
  field: string,
  label: string,
  data: Array<any>,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    filterable: true,
    editable: false,
    type: 'singleSelect',
    valueOptions: data.map((x: any) => ({ label: x.value, value: x.key })),
    renderCell: (params: GridRenderCellParams<any>) =>
      renderTemplateCell(params, TemplateType.Discipline, field),
  };
};

export const buildScopeColumn = (
  field: string,
  label: string,
  data: Array<any>,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    filterable: true,
    editable: false,
    type: 'singleSelect',
    valueOptions: data.map((x: any) => ({ label: x.title, value: x.id })),
    renderCell: (params: GridRenderCellParams<any>) => (
      <>
        {get(params.row, field)?.map((x: string, index: number) => {
          const value = data.find((y: any) => y.id === x || y.code === x);

          return (
            <Typography variant="body1" key={x}>
              <b>{value?.code}</b>&nbsp;
              <span key={`${index}-${value?.title}`}>{value?.title}</span>
            </Typography>
          );
        })}
      </>
    ),
  };
};

export const buildAthleteColumn = (field: string, width = 90): GridColDef => {
  return {
    field,
    headerName: field === 'innerId' ? t('general.swdId') : t('general.gdsId'),
    width,
    filterable: true,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => {
      const id = get(params.row, field);

      return (
        <Chip
          variant="outlined"
          size="small"
          icon={<VerifiedUserOutlinedIcon color={id ? 'primary' : 'secondary'} fontSize="small" />}
          label={id ? '1' : '0'}
        />
      );
    },
  };
};

export const buildEnumColumn = (
  field: string,
  label: string,
  type: EnumType,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    editable: false,
    filterable: true,
    renderCell: (params: GridRenderCellParams<any>) => renderEnumCell(params, type, false),
    filterOperators: filterEnumOperators(type),
  };
};

export const buildEnumListColumn = (
  field: string,
  label: string,
  type: EnumType,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    editable: false,
    filterable: true,
    filterOperators: filterEnumOperators(type),
    renderCell: (params: GridRenderCellParams<any>) => (
      <Stack alignItems={'flex-start'}>
        {get(params.row, field)?.map((x: string) => {
          return <EnumTemplate key={x} type={type} value={x} withText={true} size="xs" />;
        })}
      </Stack>
    ),
  };
};

export const buildEnumValueColumn = (
  field: string,
  label: string,
  type: EnumType,
  width = 180
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => renderEnumCell(params, type, true),
  };
};

export const buildTemplateRoleColumn = (field: string): GridColDef => {
  return {
    field,
    headerName: t('common.role'),
    width: 120,
    editable: false,
    filterable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'ATH', label: t('general.athlete') },
      { value: 'COACH', label: t('general.coach') },
      { value: 'JUDGE', label: t('general.judge') },
    ],
  };
};

export const buildTemplateStatusColumn = (field: string): GridColDef => {
  return {
    field,
    headerName:
      field === 'accreditationStatus' ? t('general.accreditationStatus') : t('common.status'),
    width: 130,
    editable: false,
    filterable: true,
    type: 'singleSelect',
    valueOptions: [
      { value: 'ACTIVE', label: t('general.active') },
      { value: 'INACTIVE', label: t('general.inactive') },
      { value: 'INVALID', label: t('general.invalid') },
    ],
    renderCell: (params: GridRenderCellParams<any>) =>
      renderTemplateCell(params, TemplateType.Status),
  };
};

export const buildQueryStatusColumn = (field: string, label: string): GridColDef => {
  return {
    field,
    headerName: label,
    width: 120,
    type: 'singleSelect',
    valueOptions: [
      { value: 'false', label: t('general.processed') },
      { value: 'true', label: t('common.failed') },
    ],
    editable: false,
    filterable: true,
    renderCell: (params: GridRenderCellParams<any>) =>
      renderTemplateCell(params, TemplateType.QueryStatus),
  };
};

export const buildSkippedColumn = (field: string, label: string): GridColDef => {
  return {
    field,
    headerName: label,
    width: 120,
    type: 'singleSelect',
    valueOptions: [
      { value: 'false', label: t('general.processed') },
      { value: 'true', label: t('common.skipped') },
    ],
    editable: false,
    filterable: true,
    renderCell: (params: GridRenderCellParams<any>) => (
      <Chip
        size="small"
        variant="outlined"
        sx={{ border: 'none!important' }}
        icon={
          params.value == 'True' ? (
            <RemoveCircleOutlineOutlinedIcon color="warning" fontSize="small" />
          ) : (
            <CheckOutlinedIcon fontSize="small" color={'secondary'} />
          )
        }
        label={
          <Typography color={params.value == 'True' ? 'text.primary' : 'text.secondary'}>
            {params.value == 'True' ? t('common.skipped') : t('general.processed')}
          </Typography>
        }
      />
    ),
  };
};

export const buildTemplateColumn = (
  field: string,
  label: string,
  type: TemplateType,
  model?: MetadataModel,
  width = 220,
  filterable = false,
  displayField = '',
  colType?: GridColType | undefined
): GridColDef => {
  const commonFields = {
    field,
    headerName: label,
    width,
    editable: false,
  };

  return model
    ? {
        ...commonFields,
        filterable: field.endsWith('Images') ? false : (model.allowFiltering ?? filterable),
        type: 'singleSelect',
        valueOptions: model.options.map((x: MetadataOption) => ({
          label: x.displayName,
          value: x.value,
        })),
        renderCell: (params: GridRenderCellParams<any>) => (
          <FieldTemplate
            type={type}
            value={params.value}
            withText={true}
            size="sm"
            title={displayField ? params.row[displayField] : ''}
          />
        ),
      }
    : {
        ...commonFields,
        type: colType,
        filterable,
        renderCell: (params: GridRenderCellParams<any>) =>
          renderTemplateCell(params, type, displayField),
      };
};

export const buildExtractDisciplineColumn = (width = 240): GridColDef => {
  return {
    field: 'sportDisciplineId',
    headerName: t('general.discipline'),
    width,
    editable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<any>) =>
      renderTemplateCell(params, TemplateType.Discipline),
  };
};

export const buildSourcesColumn = (
  field: string,
  options: DisplayEntry[],
  label = ''
): GridColDef => {
  return {
    field,
    headerName: label || t('common.sources'),
    width: 260,
    editable: false,
    filterable: true,
    type: 'singleSelect',
    valueOptions: orderBy(options, ['title'], ['asc']).map((x: DisplayEntry) => ({
      label: x.title,
      code: x.code,
    })),
    getOptionValue: (value: any) => (value ? value.code : value),
    getOptionLabel: (value: any) => {
      if (!value) {
        return value;
      }
      const titleUpper = value.label?.toUpperCase();
      const codeUpper = value.code?.toUpperCase();
      const isSame = titleUpper === codeUpper;

      return isSame ? value.label : `${value.label} (${value.code})`;
    },
    renderCell: (params: GridRenderCellParams<any>) =>
      renderTemplateCell(params, TemplateType.Tags),
  };
};

export const buildMasterDataColumn = (
  field: string,
  data: Array<Entry>,
  label: string,
  width = 180
): GridColDef => {
  const commonFields = {
    field,
    width,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => renderMasterDataCell(params, data),
  };

  return data && data.length > 0
    ? {
        ...commonFields,
        headerName: label,
        filterable: true,
        type: 'singleSelect',
        valueOptions: data.map((x: Entry) => ({
          label: x.value,
          value: x.key,
        })),
      }
    : {
        ...commonFields,
        headerName: label ?? field,
        filterable: true,
      };
};

export const buildCompetitionCategories = (
  field: string,
  categories: Array<Entry>,
  width = 280,
  label: string = t('general.competitionCategories')
): GridColDef => {
  return {
    field,
    headerName: label,
    width,
    editable: false,
    filterable: true,
    type: 'singleSelect',
    valueOptions: categories?.map((x: Entry) => ({ label: x.value, value: x.key })) ?? [],
    renderCell: (params: GridRenderCellParams<any>) => {
      if (!params.value) return '-';

      if (!Array.isArray(params.value)) return formatMasterCode(params.value);

      return params.value
        .map((x: string) => {
          const value = categories.find((y: Entry) => y.key === x);
          return get(value, 'displayName') ?? get(value, 'value') ?? formatMasterCode(x);
        })
        .join(', ');
    },
  };
};

export const buildCountryColumn = (
  field: string,
  data: Array<Entry>,
  label: string = t('general.country'),
  width = 300
): GridColDef => {
  const commonFields = {
    field,
    width,
    editable: false,
    renderCell: (params: GridRenderCellParams<any>) => renderCountryCell(params, data),
  };
  return data && data.length > 0
    ? {
        ...commonFields,
        headerName: label,
        filterable: true,
        type: 'singleSelect',
        valueOptions: data.map((x: any) => ({
          label: x.value,
          value: x.key,
        })),
      }
    : { ...commonFields, headerName: label ?? field, filterable: true };
};

export const buildDateColumn = (
  field: string,
  label: string,
  width = 140,
  model?: MetadataModel,
  format?: string
): GridColDef => ({
  field,
  headerName: label,
  width,
  type: 'date',
  editable: false,
  filterable: model?.allowFiltering ?? false,
  valueFormatter: (value?: any) =>
    value
      ? dayjs(value)
          .format(format ?? baseConfig.generalDateFormat)
          .toUpperCase()
      : '',
});

export const buildNumericColumn = (
  field: string,
  label: string,
  width = 100,
  filterable = false
): GridColDef => ({
  field,
  headerName: label,
  width,
  type: 'number',
  editable: false,
  filterable,
});

export const buildProgressColumn = (
  field: string,
  label: string,
  width = 200,
  filterable = true
): GridColDef => ({
  field,
  headerName: label,
  width,
  type: 'number',
  editable: false,
  filterable,
  sortable: true,
  renderCell: (params: GridRenderCellParams<any>) => <TableCellProgress value={params.value} />,
});

export const buildNoMappingColumn = (field: string, label: string): GridColDef => ({
  field,
  headerName: label,
  width: 90,
  type: 'number',
  editable: false,
  filterable: false,
  sortable: false,
  filterOperators: getGridBooleanOperators(),
  renderCell: (params: GridRenderCellParams<any>) =>
    renderTemplateCell(params, TemplateType.NoMappings),
});

export const buildEditableEnumColumn = (
  field: string,
  label: string,
  type: EnumType,
  width = 180,
  options?: Array<IEnumProps>
): GridColDef => {
  const { getEnumValues } = useEnums();

  return {
    field,
    headerName: label,
    width,
    editable: true,
    type: 'singleSelect',
    renderCell: (params: GridRenderCellParams<IEnumProps>) => renderEnumCell(params, type, false),
    renderEditCell: (params: GridRenderEditCellParams<IEnumProps>) => (
      <EnumFieldItem params={params} options={options ?? getEnumValues(type)} />
    ),
    filterOperators: filterEnumOperators(type),
  };
};
