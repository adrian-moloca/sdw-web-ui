import { Autocomplete, TextField } from '@mui/material';
import { BarChartPro } from '@mui/x-charts-pro';
import { formatMasterCode, getDisciplineCode, getDisciplineTitle } from '_helpers';
import { MainCard } from 'components';
import { t } from 'i18next';
import flatMap from 'lodash/flatMap';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import uniq from 'lodash/uniq';
import { medalColors } from 'models';
import { useState } from 'react';

type Props = {
  data: any;
};

export const ContinentMedalChart = ({ data }: Props) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<any>(null);
  const disciplines = sortBy(uniq(flatMap(data, 'disciplineCodes'))).map((x: string) => ({
    code: x,
    label: getDisciplineTitle(getDisciplineCode(x)) ?? formatMasterCode(x),
  }));
  const filteredData = selectedDiscipline
    ? data.filter((x: any) => x.disciplineCodes.includes(selectedDiscipline.code))
    : data;

  const grouped = groupBy(filteredData, 'organisation.continent');
  const sortedData = Object.entries(grouped)
    .map(([rawContinent, countries]) => {
      const continent = formatMasterCode(rawContinent); // your formatter
      return {
        continent,
        gold: sumBy(countries, 'golden'),
        silver: sumBy(countries, 'silver'),
        bronze: sumBy(countries, 'bronze'),
      };
    })
    .sort((a, b) => b.gold - a.gold); // Sort by gold descending
  const continents = sortedData.map((c) => c.continent);
  const goldData = sortedData.map((c) => c.gold);
  const silverData = sortedData.map((c) => c.silver);
  const bronzeData = sortedData.map((c) => c.bronze);
  return (
    <MainCard
      content={false}
      title={t('charts.continents-by-medals')}
      divider={false}
      size="small"
      headerSX={{ paddingBottom: 0, paddingTop: 2 }}
      secondary={
        <Autocomplete
          options={disciplines}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          size="small"
          renderInput={(params) => <TextField {...params} label={t('general.discipline')} />}
          value={selectedDiscipline}
          sx={{ width: 300 }}
          onChange={(_event: any, newValue: string | null) => {
            setSelectedDiscipline(newValue);
          }}
        />
      }
    >
      <BarChartPro
        height={300}
        hideLegend={true}
        xAxis={[{ scaleType: 'band', data: continents }]}
        series={[
          { data: goldData, label: t('general.golden'), color: medalColors.golden },
          { data: silverData, label: t('general.silver'), color: medalColors.silver },
          { data: bronzeData, label: t('general.bronze'), color: medalColors.bronze },
        ]}
      />
    </MainCard>
  );
};
