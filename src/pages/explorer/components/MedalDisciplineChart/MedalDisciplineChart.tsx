import { BarChart, barLabelClasses } from '@mui/x-charts-pro';
import { t } from 'i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { medalColors } from 'models';

type Props = {
  data: any;
  height: number;
};

export const MedalDisciplineChart = ({ height, data }: Props) => {
  return (
    <PerfectScrollbar
      style={{
        height: '100%',
        maxHeight: 560,
        overflowX: 'hidden',
      }}
    >
      <BarChart
        dataset={data}
        borderRadius={5}
        xAxis={[{ scaleType: 'linear', label: t('general.discipline'), position: 'none' }]}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'discipline',
            tickLabelStyle: { fontSize: '0.875rem' },
            width: 160,
          },
        ]}
        series={[
          {
            dataKey: 'gold',
            label: t('general.golden'),
            color: medalColors.golden,
            stack: 'medal',
          },
          {
            dataKey: 'silver',
            label: t('general.silver'),
            color: medalColors.silver,
            stack: 'medal',
          },
          {
            dataKey: 'bronze',
            label: t('general.bronze'),
            color: medalColors.bronze,
            stack: 'medal',
          },
        ]}
        margin={{ top: 20 }}
        layout="horizontal"
        height={height < 200 ? 200 : height}
        barLabel="value"
        hideLegend={true}
        slotProps={{
          barLabel: { fontFamily: 'Olympic Sans', fontSize: 8 },
        }}
        sx={{
          [`& .${barLabelClasses.root}`]: {
            fontFamily: 'Olympic Sans',
            fontSize: 12,
          },
        }}
      />
    </PerfectScrollbar>
  );
};
