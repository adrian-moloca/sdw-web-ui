import { JSX } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import { Stack, Box, Typography } from '@mui/material';
import { StatusCell } from './StatusCell';
import { getScopeTypeConfig, isValidStatus } from './utilities';
import { CountryChip, TableCellProgress } from 'components';
import { olympicsDesignColors } from 'themes/colors';

export const columnsCompetitions: GridColDef[] = [
  {
    field: 'status',
    headerName: t('general.overall-status'),
    flex: 1,
    minWidth: 220,
    renderCell: (params: GridRenderCellParams<any, string | undefined>): JSX.Element | string => {
      const status = params.value;
      if (!status || !isValidStatus(status)) return '';
      return <StatusCell status={status} />;
    },
  },
  {
    field: 'competitionName',
    headerName: t('general.competition-name'),
    flex: 1.5,
    minWidth: 220,
  },
  {
    field: 'disciplineName',
    headerName: t('general.discipline'),
    flex: 1,
    minWidth: 180,
  },
  {
    field: 'competitionCategories',
    headerName: t('general.category'),
    flex: 1.5,
    minWidth: 220,
    valueFormatter: (params: string[]): string => {
      if (!Array.isArray(params)) return params ?? '';
      return params.map((cat) => cat.replace('CCAT$', '').replace(/_/g, ' ')).join(', ');
    },
  },
  {
    field: 'season',
    headerName: t('general.season'),
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: 'country',
    headerName: t('general.country'),
    flex: 1.2,
    minWidth: 160,
    sortable: true,
    filterable: true,
    renderCell: (params: GridRenderCellParams<any, string>): JSX.Element | null => {
      const countryCodeRaw = params.value ?? '';
      if (!countryCodeRaw) return null;

      return <CountryChip code={`${countryCodeRaw}`} size="small" hideTitle={false} />;
    },
  },
  {
    field: 'region',
    headerName: t('general.region'),
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'scopeTypes',
    headerName: t('general.scope-type'),
    flex: 2.5,
    minWidth: 160,
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
    field: 'readiness',
    headerName: t('general.readiness'),
    flex: 0.8,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<any, number>): JSX.Element => {
      return <TableCellProgress value={params.value || 0} />;
    },
  },
  {
    field: 'lastDataReceivedOn',
    headerName: t('general.last-data-received'),
    flex: 1,
    minWidth: 220,
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
  {
    field: 'comments',
    headerName: t('extendedInfo.comments'),
    flex: 1.5,
    minWidth: 200,
  },
];
