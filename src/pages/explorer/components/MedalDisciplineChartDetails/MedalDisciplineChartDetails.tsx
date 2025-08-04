import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import orderBy from 'lodash/orderBy';
import { useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { Entry, IConfigProps } from 'models';
import { filterMedals, getCategories, getCompetitions } from 'pages/explorer/utils/medals';
import { MedalDisciplineChart } from '../MedalDisciplineChart';

type Props = {
  config: IConfigProps;
  data: any;
};

export const MedalDisciplineChartDetails = ({ data }: Props) => {
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Entry | null>(null);

  const filteredData = filterMedals(data.data, null, selectedCategory, selectedCompetition);
  const groupedData = groupBy(filteredData, 'discipline.title');
  const aggregatedData = orderBy(
    Object.keys(groupedData).map((key) => ({
      discipline: key,
      gold: sumBy(groupedData[key], 'golden'),
      silver: sumBy(groupedData[key], 'silver'),
      bronze: sumBy(groupedData[key], 'bronze'),
    })),
    ['gold', 'silver', 'bronze'],
    ['desc', 'desc', 'desc']
  );

  const height = Object.keys(groupedData).length * 30 + 100;
  const categories = getCategories(data.data);
  const competitions = getCompetitions(data.data);

  if (competitions.length === 1) {
    return <MedalDisciplineChart data={aggregatedData} height={height} />;
  }

  if (data.data.length === 0) return null;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 1 }}>
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
        <Autocomplete
          options={competitions}
          size="small"
          renderInput={(params) => <TextField {...params} label={t('general.competition')} />}
          value={selectedCompetition}
          sx={{ width: 400, ml: 1 }}
          onChange={(_event: any, newValue: string | null) => {
            setSelectedCompetition(newValue);
          }}
        />
      </Box>
      <MedalDisciplineChart data={aggregatedData} height={height} />
    </>
  );
};
