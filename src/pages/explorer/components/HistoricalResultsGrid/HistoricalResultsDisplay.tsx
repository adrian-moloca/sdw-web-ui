import { useState } from 'react';
import { Alert, Box, Collapse, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import EditTwoTone from '@mui/icons-material/EditTwoTone';
import get from 'lodash/get';
import { t } from 'i18next';
import {
  CompetitionChip,
  CompetitionLocationChip,
  ErrorPanel,
  EventChip,
  GenericLoadingPanel,
  IrmResultChip,
  OrganisationChip,
  ResultStatusChip,
  SingleMedalChip,
  StartDateChip,
  StripedDataGrid,
  TeamChip,
} from 'components';
import { isNullOrEmpty } from '_helpers';
import { ColumnData, EntityType, MenuFlagEnum } from 'models';
import { EditResultForm } from 'pages/explorer/components';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useSecurityProfile, useStoreCache } from 'hooks';
import baseConfig from 'baseConfig';
import { calculatedHeight, getHistoricalResultsColumnData } from './utils';
import { numericPrefixSortComparator } from '../CompetitorTable/utils';

interface Props {
  data: any[];
  isLoading: boolean;
  error?: any;
  hideCompetition?: boolean;
}
export const HistoricalResultsDisplay: React.FC<Props> = ({
  data,
  isLoading,
  error,
  hideCompetition,
}) => {
  const { hasPermission } = useSecurityProfile();
  const { getMetadata } = useStoreCache();
  const columns: ColumnData[] = getHistoricalResultsColumnData(
    data,
    hasPermission(MenuFlagEnum.Consolidation),
    hideCompetition
  );
  const gridColumns: GridColDef[] = [];
  columns.forEach((column: ColumnData) => {
    gridColumns.push({
      field: column.dataKey,
      headerName: column.label,
      width: column.width,
      align: column.align,
      headerAlign: column.align,
      sortable: true,
      headerClassName: 'sdw-theme-header',
      sortComparator: column.dataKey == 'rank' ? numericPrefixSortComparator : undefined,
      valueGetter: (_value, row) => {
        switch (column.dataKey) {
          case 'competition':
            return get(row, 'competition.title');
          case 'location':
            return get(row, 'competition.region') ?? get(row, 'competition.country');
          case 'organisation':
            return get(row, 'organisation.country');
          case 'event':
            return get(row, 'roundsResult.title');
          case 'result':
            return get(row, 'roundsResult.result.value');
          case 'rank':
            return get(row, 'roundsResult.result.rank');
          case 'medal':
            return get(row, 'roundsResult.medal');
          default:
            return get(row, column.dataKey) ?? get(row, column.dataKey);
        }
      },
      renderCell: (params: GridRenderCellParams) => {
        const roundsResult = get(params.row, 'roundsResult');
        const result = get(roundsResult, 'result');
        const id = get(params.row, 'roundsResult.result.id');
        const isEditing = editResult && id == get(editResult, 'roundsResult.result.id');
        switch (column.dataKey) {
          case 'competition':
            return <CompetitionChip data={params.row} extended={false} />;
          case 'location':
            return <CompetitionLocationChip data={params.row} />;
          case 'organisation':
            return (
              <OrganisationChip
                data={get(params.row, 'organisation')}
                extended={false}
                variant="body1"
              />
            );
          case 'event':
            return <EventChip data={roundsResult} withRoute={true} />;
          case 'result':
            return (
              <IrmResultChip
                irm={get(result, 'irm')}
                value={get(result, 'value')}
                valueType={get(result, 'valueType')}
                lastRound={get(result, 'lastRound')}
                inline={false}
              />
            );
          case 'rank':
            return (
              <Stack direction={'row'} spacing={1} justifyContent={'center'}>
                <Typography textAlign={'left'}>{get(result, column.dataKey) ?? '-'}</Typography>
                <SingleMedalChip element={roundsResult} includeSpacing={true} />
              </Stack>
            );
          case 'medal':
            return <SingleMedalChip element={roundsResult} />;
          case 'date':
            return <StartDateChip data={params.row} />;
          case 'status':
            return <ResultStatusChip data={result} />;
          case 'team':
            return <TeamChip data={roundsResult} />;
          case 'edit':
            return (
              <IconButton
                disabled={isNullOrEmpty(id)}
                aria-label="edit row"
                sx={{ p: 0.2 }}
                color={isEditing ? 'error' : 'primary'}
                onClick={() => {
                  if (isEditing) {
                    setEditResult(undefined);
                  } else {
                    setEditResult(params.row);
                  }
                }}
              >
                {isEditing ? <CancelOutlined fontSize="small" /> : <EditTwoTone fontSize="small" />}
              </IconButton>
            );
          default:
            return (
              <Typography>
                {get(roundsResult, column.dataKey) ?? get(params.row, column.dataKey)}
              </Typography>
            );
        }
      },
    });
  });

  const [editResult, setEditResult] = useState<any>(undefined);
  const metadataResult = getMetadata(EntityType.Result);
  if (isLoading) {
    return <GenericLoadingPanel loading={true} />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  if (data.length === 0) {
    return (
      <Grid size={12}>
        <Alert severity="info">
          {t('message.notDataAvailable').replace('{0}', t('general.competitions'))}
        </Alert>
      </Grid>
    );
  }

  return (
    <>
      <Grid size={12}>
        <Box height={calculatedHeight(data.length)}>
          <StripedDataGrid
            rows={data}
            columns={gridColumns}
            getRowId={(row) => get(row, 'roundsResult.result.id') ?? get(row, 'roundsResult.id')}
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooter
            rowHeight={baseConfig.defaultRowHeight ?? 36}
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
          />
        </Box>
      </Grid>
      <Grid size={12}>
        {editResult && (
          <Collapse in={editResult} timeout={0} unmountOnExit>
            <EditResultForm
              dataItem={editResult}
              metadata={metadataResult}
              onClickClose={() => setEditResult(undefined)}
            />
          </Collapse>
        )}
      </Grid>
    </>
  );
};
