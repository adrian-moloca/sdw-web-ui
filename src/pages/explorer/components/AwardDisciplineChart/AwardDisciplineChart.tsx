import { BarChart, barLabelClasses } from '@mui/x-charts-pro';
import { Autocomplete, Box, TextField } from '@mui/material';
import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useState } from 'react';
import uniq from 'lodash/uniq';
import { MainCard } from 'components/cards/MainCard';
import { medalColors } from 'models';

type Props = {
  data: any;
};

export const AwardDisciplineChart = ({ data }: Props) => {
  if (data.length === 0) return null;

  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>(null);
  const filteredData = selectedOrganisation
    ? data.data.filter(
        (x: any) =>
          x.participants.filter((e: any) => e.organisation.name === selectedOrganisation).length > 0
      )
    : data.data;

  const groupedData = groupBy(filteredData, 'discipline.title');
  const aggregatedData = orderBy(
    Object.keys(groupedData).map((key) => ({
      discipline: key,
      gold: groupedData[key].filter((x: any) =>
        ['AWSB$ME_GOLD', 'AWSB$GOLD'].includes(x.award.subClass)
      ).length,
      silver: groupedData[key].filter((x: any) =>
        ['AWSB$ME_SILVER', 'AWSB$SILVER'].includes(x.award.subClass)
      ).length,
      bronze: groupedData[key].filter((x: any) =>
        ['AWSB$ME_BRONZE', 'AWSB$BRONZE'].includes(x.award.subClass)
      ).length,
    })),
    ['gold', 'silver', 'bronze'],
    ['desc', 'desc', 'desc']
  );

  const flattenedData = data.data
    .flatMap((item: any) =>
      item.participants.map((participant: any) => ({
        organisation: participant.organisation.name,
      }))
    )
    .slice(0, 80);

  const height = Object.keys(groupedData).length * 30 + 100;
  const organisations = orderBy(
    uniq(flattenedData.map((item: any) => item.organisation)),
    [(c: string) => c],
    ['asc']
  );

  return (
    <MainCard>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: 4, paddingRight: 2, mt: 1 }}
      >
        <Autocomplete
          options={organisations}
          size="small"
          renderInput={(params) => <TextField {...params} label={t('general.organisation')} />}
          value={selectedOrganisation}
          sx={{ width: 300 }}
          onChange={(_event: any, newValue: any) => {
            setSelectedOrganisation(newValue);
          }}
        />
      </Box>
      <PerfectScrollbar
        style={{
          height: '100%',
          maxHeight: 600,
          overflowX: 'hidden',
        }}
      >
        <BarChart
          dataset={aggregatedData}
          borderRadius={5}
          xAxis={[{ scaleType: 'linear', label: t('general.discipline'), position: 'none' }]}
          yAxis={[
            {
              scaleType: 'band',
              dataKey: 'discipline',
              tickLabelStyle: { fontSize: '0.875rem', wordWrap: 'break-word' },
              width: 280,
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
