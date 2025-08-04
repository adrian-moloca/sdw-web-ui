import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { StripedDataGridBase } from 'components';
import { useFrames } from 'hooks';

type Props = {
  discipline: string;
  frameTable?: any;
  filterType: string;
};

export const FrameResultsTableDisplay = ({ discipline, frameTable, filterType }: Props) => {
  const theme = useTheme();
  const { getDynamicDataGridData } = useFrames();

  if (!frameTable.pivotTable) return null;
  return Object.keys(frameTable.pivotTable.rows).map((competitor, index: number) => {
    const frames = frameTable.pivotTable.rows[competitor];
    const frameData = getDynamicDataGridData(
      frames,
      frameTable.pivotTable,
      discipline,
      filterType,
      7
    );
    return (
      <Grid container size={12} key={index} spacing={1}>
        {competitor && (
          <Grid size={12}>
            <Typography fontWeight={500}>{competitor}</Typography>
          </Grid>
        )}

        <Grid size={12}>
          <StripedDataGridBase
            rows={frameData.rows}
            fontSize={theme.typography.body2.fontSize}
            columns={frameData.columns}
            getRowId={(row) => row.id}
            disableColumnMenu
            disableRowSelectionOnClick
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            getRowHeight={() => 'auto'}
            hideFooter
          />
        </Grid>
      </Grid>
    );
  });
};
