import { Autocomplete, TextField } from '@mui/material';
import {
  BarPlot,
  ChartContainerPro,
  ChartsAxisHighlight,
  ChartsGrid,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
} from '@mui/x-charts-pro';

import { MainCard } from 'components';
import { t } from 'i18next';
import flatMap from 'lodash/flatMap';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import { medalColors } from 'models';
import { useState } from 'react';

type Props = {
  data: any;
  topN: number;
};

export const TopMedalistsChart = ({ data, topN }: Props) => {
  const [selectedContinent, setSelectedContinent] = useState<any>(null);
  const allContinents = flatMap(data, 'nocs').map((x: any) => ({
    code: x.continentCode,
    label: x.continent,
  }));
  const continents = orderBy(uniqBy(allContinents, 'code'), 'code');
  const chartData = orderBy(
    data.map((x: any) => ({
      ...x,
      name: x.preferredFamilyName,
    })),
    'order'
  );
  const top10 = selectedContinent
    ? orderBy(
        chartData.filter((x: any) =>
          x.nocs.find((y: any) => y.continentCode === selectedContinent.code)
        ),
        'order'
      ).slice(0, topN)
    : orderBy(chartData, 'order').slice(0, topN);
  return (
    <MainCard
      content={false}
      title={t('charts.top-athletes-by-medals').replace('{0}', topN.toString())}
      divider={false}
      size="small"
      headerSX={{ paddingBottom: 0, paddingTop: 2 }}
      secondary={
        <Autocomplete
          options={continents}
          size="small"
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderInput={(params) => <TextField {...params} label={t('general.noc-continents')} />}
          value={selectedContinent}
          sx={{ width: 300 }}
          onChange={(_event: any, newValue: string | null) => {
            setSelectedContinent(newValue);
          }}
        />
      }
    >
      <ChartContainerPro
        height={300}
        xAxis={[
          {
            scaleType: 'band',
            id: 'x-axis-id',
            data: top10.map((c) => c.name),
          },
        ]}
        yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId', position: 'right' }]}
        series={[
          {
            type: 'bar',
            data: top10.map((c) => c.golden),
            label: t('general.golden'),
            color: medalColors.golden,
            yAxisId: 'leftAxisId',
          },
          {
            type: 'bar',
            data: top10.map((c) => c.silver),
            label: t('general.silver'),
            color: medalColors.silver,
            yAxisId: 'leftAxisId',
          },
          {
            type: 'bar',
            data: top10.map((c) => c.bronze),
            label: t('general.bronze'),
            color: medalColors.bronze,
            yAxisId: 'leftAxisId',
          },
          {
            type: 'line',
            data: top10.map((c) => c.total),
            label: t('general.total'),
            color: medalColors.total,
            yAxisId: 'rightAxisId',
            showMark: false,
          },
        ]}
      >
        <ChartsGrid horizontal />
        <BarPlot />
        <LinePlot />
        <MarkPlot />
        <ChartsTooltip />
        <ChartsAxisHighlight />
        <ChartsXAxis axisId="x-axis-id" />
        <ChartsYAxis axisId="leftAxisId" />
      </ChartContainerPro>
    </MainCard>
  );
};
