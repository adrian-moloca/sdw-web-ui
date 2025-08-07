import { BarChart, barLabelClasses } from '@mui/x-charts-pro';
import { t } from 'i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { MainCard } from 'components/cards/MainCard';
import { medalColors } from 'models';

type Props = {
  data: any;
};

export const AwardNocChart = ({ data }: Props) => {
  const formatData = data.map((x: any) => ({
    organisation: x.organisation.name,
    golden: x.golden,
    silver: x.silver,
    bronze: x.bronze,
  }));

  const height = data.length * 30 + 100;

  if (data.length === 0) return null;

  return (
    <MainCard>
      <PerfectScrollbar
        style={{
          height: '100%',
          maxHeight: 700,
          overflowX: 'hidden',
        }}
      >
        <BarChart
          dataset={formatData}
          borderRadius={5}
          xAxis={[{ scaleType: 'linear', label: t('general.noc'), position: 'none' }]}
          yAxis={[
            {
              width: 280,
              scaleType: 'band',
              dataKey: 'organisation',
              tickLabelStyle: { fontSize: '0.875rem', wordWrap: 'break-word' },
            },
          ]}
          series={[
            {
              dataKey: 'golden',
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
          sx={{
            [`& .${barLabelClasses.root}`]: {
              fontFamily: 'Olympic Sans',
              fontSize: 12,
            },
          }}
        />
      </PerfectScrollbar>
    </MainCard>
  );
};
