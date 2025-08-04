import { GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import { JSX } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { StatusCell } from './StatusCell';
import { getScopeTypeConfig, isValidStatus } from './utilities';
import { TableCellProgress } from 'components';
import { olympicsDesignColors } from 'themes/colors';

export const columnsIngestionPackages: GridColDef[] = [
  {
    field: 'status',
    headerName: t('general.overall-status'),
    flex: 1,
    minWidth: 240,
    renderCell: (params: GridRenderCellParams<any, string>): string | JSX.Element => {
      return isValidStatus(params.value) ? <StatusCell status={params.value} /> : '';
    },
  },
  { field: 'disciplineName', headerName: t('general.discipline'), flex: 1, minWidth: 180 },
  {
    field: 'competitionCategories',
    headerName: t('general.category'),
    flex: 2,
    minWidth: 220,
    valueFormatter: (params: string[]): string =>
      Array.isArray(params) ? params.join(', ') : (params ?? ''),
  },
  { field: 'fromYear', headerName: t('common.fromYear'), flex: 0.8, minWidth: 120 },
  { field: 'toYear', headerName: t('common.toYear'), flex: 0.8, minWidth: 120 },
  {
    field: 'scopeTypes',
    headerName: t('general.scope-type'),
    flex: 2,
    minWidth: 200,
    renderCell: (params: GridRenderCellParams<any, string[]>): JSX.Element => {
      const scopeTypes: string[] = params.value ?? [];

      return (
        <Stack spacing={0.5}>
          {scopeTypes.map((type) => {
            const config = getScopeTypeConfig(type);
            if (!config) return null;

            return (
              <Box key={type} display="flex" alignItems="center" gap={0.5}>
                {config.icon}
                <Typography
                  variant="body2"
                  sx={[
                    () => ({ color: olympicsDesignColors.base.neutral.black }),
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
    flex: 1,
    minWidth: 140,
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
    flex: 0.5,
    minWidth: 100,
    align: 'right',
    valueFormatter: (params: number): string =>
      typeof params === 'number' ? `${params}` : (params ?? ''),
  },
];
