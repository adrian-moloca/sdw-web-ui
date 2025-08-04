import '@xyflow/react/dist/style.css';
import { Grid, useTheme } from '@mui/material';
import { t } from 'i18next';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { chunkWithMinSize } from '_helpers';
import { ExtendedCard, StripedDataGridBase } from 'components';
import baseConfig from 'baseConfig';
import { CompetitorStatsCharts } from './CompetitorStatsCharts';
import { unifyStats } from './utils';

type Props = {
  data: Array<any>;
};

export const CompetitorStats = ({ data }: Props) => {
  if (!data) return null;

  const stats = unifyStats(data);
  if (!stats || stats.length == 0) return null;

  const theme = useTheme();
  const getMaxTextWidth = (
    field: string,
    header: string,
    charWidth = 10,
    minWidth = 140
  ): number => {
    const maxLength = Math.max(
      ...data.map((row) => row[field]?.toString().length ?? 0),
      header.length
    );
    return Math.max(minWidth, maxLength * charWidth) + 10;
  };
  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: t('general.statistics'),
      minWidth: getMaxTextWidth('description', t('general.statistics')) + 10,
      sortable: true,
      flex: 1,
    },
  ];

  for (const e of data) {
    columns.push({
      field: e.id,
      headerName: e.name,
      minWidth: getMaxTextWidth(e.id, e.name),
      maxWidth: 340,
      headerAlign: 'right',
      align: 'right',
    });
  }
  const rows: GridRowsProp = stats.map((stat) => {
    const row: any = {
      id: stat.code,
      description: stat.competitors[0].label,
    };

    for (const c of stat.competitors) {
      row[c.id] = c.displayValue;
    }

    return row;
  });
  const statChunks = chunkWithMinSize(rows as any[], 8);
  return (
    <ExtendedCard titleText={t('general.statistics')} icon={QueryStatsOutlinedIcon}>
      <Grid container spacing={2}>
        {statChunks.map((chunk, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <StripedDataGridBase
              rows={chunk}
              columns={columns}
              fontSize={theme.typography.body2.fontSize}
              disableRowSelectionOnClick
              disableColumnMenu
              hideFooter
              rowHeight={baseConfig.defaultRowHeight ?? 36}
              density="compact"
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
            />
          </Grid>
        ))}
        <CompetitorStatsCharts data={data} />
      </Grid>
    </ExtendedCard>
  );
};
