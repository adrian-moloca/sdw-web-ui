import { Grid, Typography, useTheme } from '@mui/material';
import { LineChartPro, lineElementClasses, markElementClasses } from '@mui/x-charts-pro';
import { formatSecondsToTime, humanize } from '_helpers';
import { useFrames } from 'hooks';
import uniq from 'lodash/uniq';

type Props = {
  frameTable: any;
  filterType?: string;
  discipline: string;
};

export const FrameResultsCharts = ({ frameTable, filterType = 'ALL' }: Props) => {
  const theme = useTheme();
  const { createFrameSeries } = useFrames();
  const uniqueTypes: string[] = uniq(
    frameTable.pivotTable.headers.map((header: any) => String(header.type))
  );
  const filteredTypes =
    filterType === 'ALL' ? uniqueTypes : uniqueTypes.filter((type) => type === filterType);

  const showTitle = filteredTypes.length > 1;
  if (!frameTable.pivotTable) return null;
  return (
    <>
      {filteredTypes.map((type) => {
        const chartData = createFrameSeries(frameTable, type);
        if (chartData.length < 2) return null;
        const xLabels = chartData.map((item: { header: any }) => item.header);
        const yValues = chartData.map((item: { value: any }) => item.value);
        const isTimeForThisChart = chartData.some((item: { isTime: any }) => item.isTime);
        return (
          <Grid size={12} key={type}>
            {showTitle && <Typography> {humanize(type)} </Typography>}
            <LineChartPro
              skipAnimation
              colors={[theme.palette.primary.main, theme.palette.warning.main]}
              sx={{
                backgroundColor: theme.palette.background.default,
                [`& .${lineElementClasses.root}`]: {
                  strokeWidth: 1,
                },
                [`& .${markElementClasses.root}`]: {
                  r: 3,
                  strokeWidth: 1,
                },
              }}
              xAxis={[
                {
                  scaleType: 'point',
                  data: xLabels,
                  tickLabelInterval: () => false,
                  position: 'none',
                },
              ]}
              yAxis={[{ position: 'none' }]}
              series={[
                {
                  data: yValues,
                  valueFormatter: (value: any) => {
                    if (isTimeForThisChart) {
                      return formatSecondsToTime(value);
                    }
                    return value.toString();
                  },
                },
              ]}
              grid={{ vertical: false, horizontal: false }}
              height={120}
            />
          </Grid>
        );
      })}
    </>
  );
};
