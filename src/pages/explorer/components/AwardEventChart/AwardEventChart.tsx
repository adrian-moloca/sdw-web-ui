import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';
import { useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { MainCard } from 'components/cards/MainCard';
import { AwardMedalEventChart } from '../AwardMedalEventChart';
import { IConfigProps } from 'models';

type Props = {
  config: IConfigProps;
  data: any;
};

export const AwardEventChart = ({ data }: Props) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);

  const filteredData = selectedOrganisation
    ? data.data?.filter(
        (x: any) =>
          x.participants.filter((e: any) => e.organisation.name === selectedOrganisation).length > 0
      )
    : data.data;

  const groupedData = groupBy(
    filteredData,
    (item) => `${item.discipline.title}|${item.event.title}`
  );
  const aggregatedData = orderBy(
    Object.keys(groupedData).map((key) => ({
      key,
      discipline: groupedData[key][0].discipline.title,
      event: `${groupedData[key][0].event.title} (${groupedData[key][0].discipline.code.replace('SDIS$', '')})`,
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

  const flattenedData = data.data.flatMap((item: any) =>
    item.participants.map((participant: any) => ({
      organisation: participant.organisation.name,
      discipline: item.discipline.title,
    }))
  );

  const organisations = orderBy(
    uniq(flattenedData.map((item: any) => item.organisation)),
    [(c: string) => c],
    ['asc']
  );

  const disciplines = orderBy(
    uniq(flattenedData.map((item: any) => item.discipline)),
    [(c: string) => c],
    ['asc']
  );

  if (data.length === 0) return null;

  if (disciplines.length === 1) {
    return <AwardMedalEventChart data={aggregatedData} discipline={selectedDiscipline} />;
  }

  return (
    <MainCard content={false}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 2, mt: 1 }}>
        <Autocomplete
          options={disciplines}
          size="small"
          renderInput={(params) => <TextField {...params} label={t('general.discipline')} />}
          value={selectedDiscipline}
          sx={{ width: 300, mr: 1 }}
          onChange={(_event: any, newValue: any) => {
            setSelectedDiscipline(newValue);
          }}
        />
        <Autocomplete
          options={organisations}
          size="small"
          renderInput={(params) => <TextField {...params} label={t('general.organisation')} />}
          value={selectedOrganisation}
          sx={{ width: 340 }}
          onChange={(_event: any, newValue: any) => {
            setSelectedOrganisation(newValue);
          }}
        />
      </Box>
      <AwardMedalEventChart data={aggregatedData} discipline={selectedDiscipline} />
    </MainCard>
  );
};
