import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import orderBy from 'lodash/orderBy';
import { useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { Entry, IConfigProps } from 'models';
import { filterMedals, getCategories, getDisciplines } from 'pages/explorer/utils/medals';
import { MedalEvolutionChart } from '../MedalEvolutionChart';

type Props = {
  config: IConfigProps;
  data: any;
};

export const MedalEvolutionChartDetails = ({ data }: Props) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Entry | null>(null);

  const filteredData = filterMedals(data.data, selectedDiscipline, selectedCategory, null);
  const groupedData = groupBy(filteredData, (item) =>
    new Date(item.competition.startDate).getFullYear()
  );
  const aggregatedData = orderBy(
    Object.keys(groupedData).map((key) => ({
      year: key,
      gold: sumBy(groupedData[key], 'golden'),
      silver: sumBy(groupedData[key], 'silver'),
      bronze: sumBy(groupedData[key], 'bronze'),
    })),
    ['year'],
    ['asc']
  );

  const categories = getCategories(data.data);
  const disciplines = getDisciplines(data.data);

  if (disciplines.length === 1 && categories.length === 1) {
    return <MedalEvolutionChart data={aggregatedData} />;
  }

  if (data.data.length === 0) return null;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 1 }}>
        {categories.length > 0 && (
          <Autocomplete
            options={categories}
            size="small"
            getOptionLabel={(option) => option.value}
            getOptionKey={(option) => option.key}
            renderInput={(params) => (
              <TextField {...params} label={t('general.competitionCategory')} />
            )}
            value={selectedCategory}
            sx={{ width: 300 }}
            onChange={(_event: any, newValue: Entry | null) => {
              setSelectedCategory(newValue);
            }}
          />
        )}
        {disciplines.length > 0 && (
          <Autocomplete
            options={disciplines}
            size="small"
            renderInput={(params) => <TextField {...params} label={t('general.discipline')} />}
            value={selectedDiscipline}
            sx={{ width: 300 }}
            onChange={(_event: any, newValue: string | null) => {
              setSelectedDiscipline(newValue);
            }}
          />
        )}
      </Box>
      <MedalEvolutionChart data={aggregatedData} />
    </>
  );
};
