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
import { t } from 'i18next';
import flatMap from 'lodash/flatMap';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import { useState } from 'react';

type Props = {
  data: any;
  topN: number;
};

export const TopAthletesPerParticipationChart = ({ data, topN }: Props) => {
  const theme = useTheme();
  const [selectedContinent, setSelectedContinent] = useState<any>(null);
  const allContinents = flatMap(data, 'organisationCodes').map((x: any) => ({
    code: x.code,
    label: x.title,
  }));
  const continents = orderBy(uniqBy(allContinents, 'code'), 'code');
  const top10 = selectedContinent
    ? orderBy(
        data.filter((x: any) =>
          x.organisationCodes.find((y: any) => y.code === selectedContinent.code)
        ),
        'order'
      ).slice(0, topN)
    : orderBy(data, 'order').slice(0, topN);
  return (
    <MainCard
      content={false}
      title={t('charts.top-athletes-by-participation').replace('{0}', topN.toString())}
      divider={false}
      size="small"
      headerSX={{ paddingBottom: 0, paddingTop: 2 }}
      secondary={
        <Autocomplete
          options={continents}
          size="small"
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderInput={(params) => <TextField {...params} label={t('general.nocs')} />}
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
            data: top10.map((c) => c.familyName),
          },
        ]}
        yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId', position: 'right' }]}
        series={[
          {
            type: 'bar',
            data: top10.map((c) => c.totalOlympicEvents),
            label: t('general.events'),
            color: lighten(theme.palette.primary.light, 0.6),
            yAxisId: 'leftAxisId',
          },
          {
            type: 'bar',
            data: top10.map((c) => c.totalOlympicCompetitions),
            label: t('general.competitions'),
            color: theme.palette.primary.main,
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
