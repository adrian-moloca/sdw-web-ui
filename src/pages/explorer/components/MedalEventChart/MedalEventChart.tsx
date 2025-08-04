import { BarChart, barLabelClasses } from '@mui/x-charts-pro';
import { t } from 'i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { medalColors } from 'models';

type Data = {
  bronze: number;
  discipline: string;
  event: string;
  gold: number;
  key: string;
  silver: number;
};

type Props = {
  discipline: string | null;
  data: Data[];
};

export const MedalEventChart = ({ discipline, data }: Props) => {
  const filteredData = discipline
    ? data.filter((item: any) => item.discipline === discipline)
    : data.slice(0, 100);
  const height = Object.keys(filteredData).length * 30 + 100;

  const groupDataByEvent = () => {
    const result: Record<string, Data> = {};
    filteredData.forEach((item: Data) => {
      const event = item.event;
      if (!result[event]) {
        result[event] = { event, discipline: '', bronze: 0, gold: 0, silver: 0, key: '' };
      }

      result[event].gold += item.gold;
      result[event].silver += item.silver;
      result[event].bronze += item.bronze;
      result[event].discipline += `,${item.discipline}`;
      result[event].key += `,${item.key}`;
    });

    return Object.values(result);
  };

  const dataset = groupDataByEvent();

  return (
    <PerfectScrollbar
      style={{
        height: '100%',
        maxHeight: 560,
        overflowX: 'hidden',
      }}
    >
      <BarChart
        dataset={dataset}
        borderRadius={5}
        xAxis={[{ scaleType: 'linear', label: t('general.event'), position: 'none' }]}
        yAxis={[
          {
            width: 220,
            scaleType: 'band',
            dataKey: 'event',
            tickLabelStyle: { fontSize: '0.875rem', wordWrap: 'break-word' },
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
