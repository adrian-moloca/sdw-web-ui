import {
  CompetitionChip,
  ErrorPanel,
  GenericLoadingPanel,
  OrganisationChip,
  SectionCard,
  StripedDataGrid,
  TeamMembersChip,
} from 'components';
import type { IPanelTabProps } from 'types/views';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { Alert, Badge, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import WorkspacesTwoToneIcon from '@mui/icons-material/WorkspacesTwoTone';
import get from 'lodash/get';
import baseConfig from 'baseConfig';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

export const TeamMembersTab = (props: IPanelTabProps) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(props.parameter.type);
  const url = `${config.apiNode}/${props.parameter.id}/members`;
  const { data, error, isLoading } = useQuery({
    queryKey: [`${props.parameter.id}_members`],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));

  const columns: GridColDef[] = [
    {
      field: 'order',
      headerName: '#',
      width: 50,
      sortable: true,
      type: 'number',
      renderCell: (params: GridRenderCellParams) => (
        <Typography>{get(params.row, 'order')}</Typography>
      ),
    },
    {
      field: 'competition',
      headerName: t('general.team'),
      width: 320,
      sortable: true,
      valueGetter: (params: GridRenderCellParams) => get(params.row, 'competition.title'),
      renderCell: (params: GridRenderCellParams) => (
        <CompetitionChip data={params.row} extended={false} />
      ),
    },
    {
      field: 'organisation',
      headerName: t('general.organisation'),
      width: 120,
      sortable: true,
      valueGetter: (_value, row) => row.organisation.country,
      renderCell: (params: GridRenderCellParams) => (
        <OrganisationChip data={params.row.organisation} extended={false} variant="body1" />
      ),
    },
    {
      field: 'members',
      headerName: t('general.members'),
      minWidth: 200,
      flex: 1,
      sortable: true,
      valueGetter: (_value, row) => row.organisation.country,
      renderCell: (params: GridRenderCellParams) => <TeamMembersChip data={params.row.members} />,
    },
  ];

  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (dataContent.length === 0) {
    if (props.includeHeader) return <></>;

    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.members').toLowerCase())}
      </Alert>
    );
  }
  const calculatedHeight =
    dataContent.length * (baseConfig.defaultRowHeight ?? 36) +
    (baseConfig.defaultColumnHeaderHeight ?? 40);
  const height = calculatedHeight < 600 ? undefined : 600;
  const TeamMembers = (
    <Box height={height}>
      <StripedDataGrid
        rows={rowsWithOrder}
        columns={columns}
        getRowId={(row) => row.order}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter
        getRowHeight={() => 'auto'}
        columnHeaderHeight={baseConfig.defaultColumnHeaderHeight ?? 60}
        density="compact"
        sx={{ zIndex: 19 }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      />
    </Box>
  );

  if (props.includeHeader) {
    return (
      <Grid size={12}>
        <SectionCard
          title={t('general.members')}
          avatar={
            <Badge color="primary" badgeContent={dataContent?.length} showZero>
              <WorkspacesTwoToneIcon />
            </Badge>
          }
        >
          {TeamMembers}
        </SectionCard>
      </Grid>
    );
  }

  return <Grid size={12}>{TeamMembers}</Grid>;
};
