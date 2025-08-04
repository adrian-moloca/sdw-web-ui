import { Autocomplete, TextField, useTheme } from '@mui/material';
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
import { getDisciplineCode, getDisciplineTitle } from '_helpers';
import { MainCard } from 'components';
import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import flatMap from 'lodash/flatMap';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import { medalColors } from 'models';
import { useState } from 'react';

type Props = {
  data: any;
  topN: number;
};

export const TopMedalistsPerDisciplineChart = ({ data, topN }: Props) => {
  const theme = useTheme();
  const [selectedContinent, setSelectedContinent] = useState<any>(null);
  const allContinents = flatMap(data, 'nocs').map((x: any) => ({
    code: x.continentCode,
    label: x.continent,
  }));
  const continents = orderBy(uniqBy(allContinents, 'code'), 'code');
  const filteredData = selectedContinent
    ? orderBy(
        data.filter((x: any) =>
          x.nocs.find((y: any) => y.continentCode === selectedContinent.code)
        ),
        'order'
      )
    : orderBy(data, 'order');
  const medalCountsPerDiscipline = Object.entries(
    groupBy(
      flatMap(filteredData, (athlete) =>
        (athlete.disciplineCodes ?? []).map((code: string) => ({
          code,
          label: getDisciplineTitle(getDisciplineCode(code)),
          athleteId: athlete.id,
          gold: athlete.golden ?? 0,
          silver: athlete.silver ?? 0,
          bronze: athlete.bronze ?? 0,
        }))
      ),
      'code'
    )
  )
    .map(([code, entries]) => ({
      code,
      label: entries[0].label,
      gold: sumBy(entries, 'gold'),
      silver: sumBy(entries, 'silver'),
      bronze: sumBy(entries, 'bronze'),
      athletes: uniqBy(entries, 'athleteId').length,
    }))
    .splice(0, topN);
  const labels = medalCountsPerDiscipline.map((d) => d.label);

  const goldSeries = medalCountsPerDiscipline.map((d) => d.gold);
  const silverSeries = medalCountsPerDiscipline.map((d) => d.silver);
  const bronzeSeries = medalCountsPerDiscipline.map((d) => d.bronze);
  const athletesSeries = medalCountsPerDiscipline.map((d) => d.athletes);
  return (
    <MainCard
      content={false}
      title={t('charts.top-disciplines-by-medals').replace('{0}', topN.toString())}
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
            data: labels,
          },
        ]}
        yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId', position: 'right' }]}
        series={[
          {
            type: 'bar',
            data: goldSeries,
            label: t('general.golden'),
            color: medalColors.golden,
            yAxisId: 'leftAxisId',
          },
          {
            type: 'bar',
            data: silverSeries,
            label: t('general.silver'),
            color: medalColors.silver,
            yAxisId: 'leftAxisId',
          },
          {
            type: 'bar',
            data: bronzeSeries,
            label: t('general.bronze'),
            color: medalColors.bronze,
            yAxisId: 'leftAxisId',
          },
          {
            type: 'line',
            data: athletesSeries,
            label: t('general.athletes'),
            color: theme.palette.primary.main,
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
