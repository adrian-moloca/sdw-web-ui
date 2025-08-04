import { Grid, useTheme } from '@mui/material';
import { t } from 'i18next';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import get from 'lodash/get';
import { ExtendedCard, StripedDataGridBase } from 'components';
import baseConfig from 'baseConfig';
import { getPointsBreakdownTableData } from './utils';
import { PointsBreakdownChart } from './PointsBreakdownChart';

type Props = {
  data: any;
  title?: string;
};

export const ExtendedPointsBreakdown = ({ data, title }: Props) => {
  const theme = useTheme();
  const pointsBreakdown =
    get(data, 'result.extensions.pointsBreakdown') ?? get(data, 'result.extensions.scoreBreakdown');
  if (!pointsBreakdown) return null;
  const tableData = getPointsBreakdownTableData(pointsBreakdown);
  const contentTitle =
    pointsBreakdown.type == 'ROUTINE'
      ? t('general.routine-points')
      : pointsBreakdown.type == 'SPEED'
        ? t('general.speed-progress')
        : t('general.points-breakdown');
  return (
    <>
      <Grid size={12}>
        <ExtendedCard
          titleText={title ? `${contentTitle}: ${title}` : contentTitle}
          icon={ScoreboardOutlinedIcon}
        >
          <StripedDataGridBase
            rows={tableData.rows}
            fontSize={theme.typography.body2.fontSize}
            getRowId={(row) => row.code}
            columns={tableData.columns}
            disableColumnMenu
            disableRowSelectionOnClick
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            rowHeight={baseConfig.defaultRowHeight ?? 40}
            hideFooter
          />
        </ExtendedCard>
      </Grid>
      <PointsBreakdownChart data={pointsBreakdown} />
    </>
  );
};
