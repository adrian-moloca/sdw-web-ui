import { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import { JSX } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { StatusCell } from './StatusCell';
import { getScopeTypeConfig, isValidStatus } from './utilities';
import { filterEnumOperators, TableCellProgress } from 'components';
import { olympicsDesignColors } from 'themes/colors';
import { useStoreCache } from 'hooks';
import { Entry, EnumType, MasterData } from 'models';
import { formatMasterCode } from '_helpers';

export const useColumnsIngestionPackages = () => {
  const { dataInfo } = useStoreCache();

  return [
    {
      field: 'overallStatus',
      headerName: t('general.overall-status'),
      flex: 1,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams<any, string>): string | JSX.Element => {
        if (!params.value || !isValidStatus(params.value)) return '';
        return <StatusCell status={params.value} />;
      },
    },
    {
      field: 'disciplineCode',
      headerName: t('general.discipline'),
      flex: 1,
      filterable: true,
      type: 'singleSelect',
      minWidth: 180,
      valueOptions: dataInfo[MasterData.Discipline].map((x: any) => ({
        label: x.value,
        value: x.key,
      })),
      renderCell: (params: any) => {
        return (
          <Typography>{`${params.value.replace('SDIS$', '')} - ${params.row.disciplineName}`}</Typography>
        );
      },
    },
    {
      field: 'competitionCategories',
      headerName: t('general.category'),
      flex: 2,
      minWidth: 220,
      filterable: true,
      type: 'singleSelect',
      valueOptions:
        dataInfo[MasterData.CompetitionCategory].map((x: Entry) => ({
          label: x.value,
          value: x.key,
        })) ?? [],
      renderCell: (params: GridRenderCellParams<any>) => {
        if (!params.value) return '-';

        if (!Array.isArray(params.value)) return formatMasterCode(params.value);

        return params.value
          .map((x: string) => {
            return x.toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase());
          })
          .join(', ');
      },
    },
    {
      field: 'startDate',
      headerName: t('common.fromYear'),
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<any, string[]>): JSX.Element => {
        return (
          <Typography
            sx={[
              () => ({
                color: olympicsDesignColors.base.neutral.black,
                lineHeight: 'inherit',
              }),
              (theme) =>
                theme.applyStyles('dark', {
                  color: olympicsDesignColors.base.neutral.white,
                }),
            ]}
          >
            {params.value && new Date(params.value?.toString()).getFullYear()}
          </Typography>
        );
      },
    },
    {
      field: 'finishDate',
      headerName: t('common.toYear'),
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<any, string[]>): JSX.Element => {
        return (
          <Typography
            sx={[
              () => ({
                color: olympicsDesignColors.base.neutral.black,
                lineHeight: 'inherit',
              }),
              (theme) =>
                theme.applyStyles('dark', {
                  color: olympicsDesignColors.base.neutral.white,
                }),
            ]}
          >
            {params.value && new Date(params.value?.toString()).getFullYear()}
          </Typography>
        );
      },
    },
    {
      field: 'scope',
      headerName: t('general.scope-type'),
      flex: 2.5,
      minWidth: 160,
      filterable: true,
      filterOperators: filterEnumOperators(EnumType.ScopeType),
      sortComparator: (v1: string[], v2: string[]) => {
        const length1 = v1?.length || 0;
        const length2 = v2?.length || 0;

        if (length1 !== length2) {
          return length1 - length2;
        }

        const str1 = v1?.sort().join(',') || '';
        const str2 = v2?.sort().join(',') || '';

        return str1.localeCompare(str2);
      },
      renderCell: (params: GridRenderCellParams<any, string[]>): JSX.Element => {
        const scopeTypes: string[] = params.value ?? [];

        return (
          <Stack spacing={0.5} direction="column" flexWrap="wrap" gap={0.5}>
            {scopeTypes.map((type) => {
              const config = getScopeTypeConfig(type);
              if (!config) return null;

              return (
                <Box key={type} display="flex" alignItems="center" gap={0.5}>
                  {config.icon}
                  <Typography
                    sx={[
                      () => ({
                        color: olympicsDesignColors.base.neutral.black,
                        lineHeight: 'inherit',
                      }),
                      (theme) =>
                        theme.applyStyles('dark', {
                          color: olympicsDesignColors.base.neutral.white,
                        }),
                    ]}
                  >
                    {config.label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        );
      },
    },
    {
      field: 'completionRate',
      headerName: t('general.readiness'),
      flex: 1,
      minWidth: 150,
      renderCell: (
        params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
      ): JSX.Element => {
        const value = Number(params.value);
        return <TableCellProgress value={value} />;
      },
    },
    {
      field: 'frequency',
      headerName: t('common.frequency'),
      flex: 0.8,
      minWidth: 100,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params: number): string =>
        typeof params === 'number' ? `${params}` : (params ?? ''),
    },
    {
      field: 'maxEstimatedCompetitions',
      headerName: t('general.expected-competitions'),
      flex: 1,
      minWidth: 190,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params: number): string => (typeof params === 'number' ? `${params}` : '0'),
    },
    {
      field: 'totalCompetitionsInScope',
      headerName: t('general.received-competitions'),
      flex: 1,
      minWidth: 190,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params: number): string => (typeof params === 'number' ? `${params}` : '0'),
    },
    {
      field: 'ts',
      headerName: t('general.last-data-received'),
      flex: 1.2,
      minWidth: 210,
      valueFormatter: (params: string): string => {
        if (!params) return '-';
        return new Date(params).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
  ];
};
