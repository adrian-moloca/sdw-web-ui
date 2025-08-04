import PerfectScrollbar from 'react-perfect-scrollbar';
import { BarChart, barLabelClasses } from '@mui/x-charts-pro';
import { t } from 'i18next';
import { medalColors } from 'models';

type Props = {
  discipline: string | null;
  data: any;
};

export const AwardMedalEventChart = ({ discipline, data }: Props) => {
  const filteredData = discipline
    ? data.filter((item: any) => item.discipline === discipline).slice(0, 100)
    : data.slice(0, 100);

  const height = Object.keys(filteredData).length * 30 + 100;

  return (
    <PerfectScrollbar
      style={{
        height: '100%',
        maxHeight: 800,
        overflowX: 'hidden',
      }}
    >
      <BarChart
        dataset={filteredData}
        borderRadius={5}
        xAxis={[{ scaleType: 'linear', label: t('general.event'), position: 'none' }]}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'event',
            tickLabelStyle: { fontSize: '0.875rem', wordWrap: 'break-word' },
            width: 340,
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
        margin={{ top: 10 }}
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
