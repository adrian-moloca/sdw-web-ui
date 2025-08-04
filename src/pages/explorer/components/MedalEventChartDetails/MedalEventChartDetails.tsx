import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import orderBy from 'lodash/orderBy';
import { useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { Entry, IConfigProps } from 'models';
import { filterMedals, getCategories, getDisciplines } from 'pages/explorer/utils/medals';
import { MedalEventChart } from '../MedalEventChart';

type Props = {
  config: IConfigProps;
  data: any;
};

export const MedalEventChartDetails = ({ data }: Props) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Entry | null>(null);

  const filteredData = filterMedals(data.data, selectedDiscipline, selectedCategory, null);
  const groupedData = groupBy(
    filteredData,
    (item) => `${item.discipline.title}-${item.event.title}`
  );
  const aggregatedData = orderBy(
    Object.keys(groupedData).map((key) => ({
      key,
      discipline: groupedData[key][0].discipline.title,
      event: groupedData[key][0].event.title,
      gold: sumBy(groupedData[key], 'golden'),
      silver: sumBy(groupedData[key], 'silver'),
      bronze: sumBy(groupedData[key], 'bronze'),
    })),
    ['gold', 'silver', 'bronze'],
    ['desc', 'desc', 'desc']
  );

  const categories = getCategories(data.data);
  const disciplines = getDisciplines(data.data);

  if (disciplines.length === 1 && categories.length === 1) {
    return <MedalEventChart data={aggregatedData} discipline={selectedDiscipline} />;
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
            sx={{ width: 300, ml: 1 }}
            onChange={(_event: any, newValue: string | null) => {
              setSelectedDiscipline(newValue);
            }}
          />
        )}
      </Box>
      <MedalEventChart data={aggregatedData} discipline={selectedDiscipline} />
    </>
  );
};
