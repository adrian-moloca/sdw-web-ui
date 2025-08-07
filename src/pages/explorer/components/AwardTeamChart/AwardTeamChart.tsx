import { useState } from 'react';
import { BarChart, barLabelClasses } from '@mui/x-charts-pro';
import { t } from 'i18next';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Autocomplete, Box, TextField } from '@mui/material';
import uniq from 'lodash/uniq';
import { MainCard } from 'components/cards/MainCard';
import { medalColors } from 'models';

type Props = {
  data: any;
};

export const AwardTeamChart = ({ data }: Props) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);

  const flattenedData = data.data
    .map((item: any) => {
      let individualParticipants = item.participants.filter(
        (participant: any) => participant.participantType === 'TEAM'
      );

      if (selectedOrganisation) {
        individualParticipants = item.participants.filter(
          (participant: any) =>
            participant.organisation.name === selectedOrganisation &&
            participant.participantType === 'TEAM'
        );
      }

      if (individualParticipants.length === 0) return null; // Exclude events with no team participants

      if (selectedDiscipline) {
        if (item.discipline.title !== selectedDiscipline) return null;
      }

      return individualParticipants.map((participant: any) => ({
        event: item.event.title,
        discipline: item.discipline.title,
        participantId: participant.individualId,
        participantName: `${participant.participationName} (${participant.organisation?.country.replace('CNTR$', '')})`,
        organisation: participant.organisation.name,
        medal: item.award.subClass,
      }));
    })
    .filter(Boolean) // Remove null values
    .flat();

  const groupedData = groupBy(flattenedData, 'participantName');
  const aggregatedData = orderBy(
    Object.keys(groupedData).map((key) => ({
      participantName: key,
      gold: groupedData[key].filter((x: any) => ['AWSB$ME_GOLD', 'AWSB$GOLD'].includes(x.medal))
        .length,
      silver: groupedData[key].filter((x: any) =>
        ['AWSB$ME_SILVER', 'AWSB$SILVER'].includes(x.medal)
      ).length,
      bronze: groupedData[key].filter((x: any) =>
        ['AWSB$ME_BRONZE', 'AWSB$BRONZE'].includes(x.medal)
      ).length,
    })),
    ['gold', 'silver', 'bronze'],
    ['desc', 'desc', 'desc']
  ).slice(0, 100);

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

  const height = aggregatedData.length * 30 + 100;

  if (data.data.length === 0) return null;

  return (
    <MainCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mt: 1 }}>
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
          sx={{ width: 300 }}
          onChange={(_event: any, newValue: any) => {
            setSelectedOrganisation(newValue);
          }}
        />
      </Box>
      <PerfectScrollbar
        style={{
          height: '100%',
          maxHeight: 800,
          overflowX: 'hidden',
        }}
      >
        <BarChart
          dataset={aggregatedData}
          borderRadius={5}
          xAxis={[{ scaleType: 'linear', label: t('general.competition'), position: 'none' }]}
          yAxis={[
            {
              scaleType: 'band',
              dataKey: 'participantName',
              tickLabelStyle: {
                fontSize: '0.875rem',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              },
              width: 320,
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
          slotProps={{
            barLabel: { fontFamily: 'Olympic Sans', fontSize: 8 },
          }}
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
