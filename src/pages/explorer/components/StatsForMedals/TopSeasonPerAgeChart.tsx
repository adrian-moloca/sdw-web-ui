import { Autocomplete, lighten, TextField, useTheme } from '@mui/material';
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
import dayjs from 'dayjs';
import { t } from 'i18next';
import flatMap from 'lodash/flatMap';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import uniqBy from 'lodash/uniqBy';
import { useState } from 'react';

type Props = {
  data: any;
  topN: number;
  direction: 'ASC' | 'DESC';
};

export const TopSeasonPerAgeChart = ({ data, topN, direction }: Props) => {
  const theme = useTheme();
  const [selectedDiscipline, setSelectedDiscipline] = useState<any>(null);
  const allDisciplines = flatMap(data, 'disciplineCodes').map((x: any) => ({
    code: x.code,
    label: x.title,
  }));
  const disciplines = orderBy(uniqBy(allDisciplines, 'code'), 'code');
  const filteredData = selectedDiscipline
    ? orderBy(
        data.filter((x: any) =>
          x.disciplineCodes.find((y: any) => y.code === selectedDiscipline.code)
        ),
        'order'
      )
    : orderBy(data, 'order');
  const medalCountsPerSeason = Object.entries(
    groupBy(
      filteredData
        .map((athlete) => {
          const minStartDate = dayjs(athlete.minStartDate).format('YYYY');
          const maxStartDate = dayjs(athlete.maxStartDate).format('YYYY');
          return {
            code: direction === 'ASC' ? minStartDate : maxStartDate,
            label: direction === 'ASC' ? minStartDate : maxStartDate,
            athleteId: athlete.id,
            age:
              direction === 'ASC'
                ? (athlete.ageAtFirstCompetition ?? 0)
                : (athlete.ageAtLastCompetition ?? 0),
          };
        })
        .filter((entry) => entry.code), // remove undefined codes
      'code'
    )
  )
    .map(([code, entries]) => ({
      code: parseInt(code),
      label: entries[0].label,
      age: sumBy(entries, 'age') / uniqBy(entries, 'athleteId').length,
      athletes: uniqBy(entries, 'athleteId').length,
    }))
    .sort((a, b) => b.code - a.code)
    .splice(0, topN);

  const labels = medalCountsPerSeason.map((d) => d.label);

  const ageSeries = medalCountsPerSeason.map((d) => d.age);
  const athletesSeries = medalCountsPerSeason.map((d) => d.athletes);
  return (
    <MainCard
      content={false}
      title={
        direction === 'ASC'
          ? t('charts.top-season-youngest').replace('{0}', topN.toString())
          : t('charts.top-season-oldest').replace('{0}', topN.toString())
      }
      divider={false}
      size="small"
      headerSX={{ paddingBottom: 0, paddingTop: 2 }}
      secondary={
        <Autocomplete
          options={disciplines}
          size="small"
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderInput={(params) => <TextField {...params} label={t('general.disciplines')} />}
          value={selectedDiscipline}
          sx={{ width: 300 }}
          onChange={(_event: any, newValue: string | null) => {
            setSelectedDiscipline(newValue);
          }}
        />
      }
    >
      <ChartContainerPro
        height={300}
        xAxis={[{ scaleType: 'band', id: 'x-axis-id', data: labels }]}
        yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId', position: 'right' }]}
        series={[
          {
            type: 'bar',
            data: ageSeries,
            label: t('general.average-age'),
            color: lighten(theme.palette.secondary.light, 0.6),
            yAxisId: 'leftAxisId',
          },
          {
            type: 'bar',
            data: athletesSeries,
            label: t('general.number-of-athletes'),
            color: theme.palette.primary.light,
            yAxisId: 'rightAxisId',
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
