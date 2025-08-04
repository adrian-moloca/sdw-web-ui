import { medalColors } from 'models';
import { LineChartPro, lineElementClasses, markElementClasses } from '@mui/x-charts-pro';
import { t } from 'i18next';

type Props = {
  data: any;
};

export const MedalEvolutionChart = ({ data }: Props) => {
  return (
    <LineChartPro
      dataset={data}
      xAxis={[{ scaleType: 'band', dataKey: 'year' }]}
      yAxis={[{ scaleType: 'linear', position: 'none' }]}
      series={[
        { dataKey: 'gold', label: t('general.golden'), color: medalColors.golden },
        { dataKey: 'silver', label: t('general.silver'), color: medalColors.silver },
        { dataKey: 'bronze', label: t('general.bronze'), color: medalColors.bronze },
      ]}
      height={500}
      hideLegend={true}
      margin={{ top: 20, left: 20, right: 20 }}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          strokeWidth: 2,
        },
        [`& .${markElementClasses.root}`]: {
          r: 3,
          strokeWidth: 1,
        },
      }}
    />
  );
};
