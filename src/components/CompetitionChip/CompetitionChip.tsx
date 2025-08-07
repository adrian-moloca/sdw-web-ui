import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { formatCountry, formatMasterCode, geCountryRegionDisplay } from '_helpers';
import { CountryChip, DisciplineAvatar, TypographyLink } from 'components';
interface Props {
  data: any;
  extended: boolean;
}
export const CompetitionChip = ({ data, extended }: Props) => {
  const country = formatCountry(data.competition.country);
  let redirectUrl = `/explorer/competitions/${data.competition.id}`;
  const disciplineId = data.discipline?.id;
  const eventId = data.roundsResult?.id ?? data.event?.id;
  if (disciplineId) redirectUrl += `#disciplineId="${disciplineId}"`;
  if (eventId) redirectUrl += `&eventId="${eventId}"`;

  let competitionTitle = data.competition.title;

  const year = data.competition.startDate ? dayjs(data.competition.startDate).format('YYYY') : '';
  const date = data.competition.startDate
    ? dayjs(data.competition.startDate).format('MMM YYYY')
    : '';
  const yearNumber = parseInt(year, 10);

  if (!competitionTitle) {
    competitionTitle = data.competition.region;
  } else {
    competitionTitle = competitionTitle.replace(country, '');

    if (
      competitionTitle.replace(data.competition.region, '').trim() !== year &&
      competitionTitle.replace(data.competition.region, '').trim() !== String(yearNumber + 1) &&
      competitionTitle.replace(data.competition.region, '').trim() !== String(yearNumber - 1)
    ) {
      competitionTitle = competitionTitle.replace(data.competition.region, '');
    }
    competitionTitle = competitionTitle.replaceAll('-', '');
    competitionTitle = competitionTitle.replaceAll(',', '');
    competitionTitle = competitionTitle.replaceAll('()', '');
    competitionTitle = competitionTitle.replace('Women', '').trim();
  }

  return (
    <Stack>
      <Stack direction="row" spacing={1} alignItems="start" justifyItems="center" component="span">
        <CountryChip code={data.competition.country} hideTitle={true} size={'small'} />
        {data.discipline && (
          <DisciplineAvatar
            code={data.discipline?.code}
            title={formatMasterCode(data.discipline?.code)}
            size={20}
          />
        )}
        <TypographyLink value={competitionTitle} route={redirectUrl} typoSize="body1" />
      </Stack>
      {extended && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          justifyItems="center"
          component="span"
        >
          <Typography variant="body2" color="textSecondary">
            {geCountryRegionDisplay(data.competition)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {date}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
interface LProps {
  data: any;
}
export const CompetitionLocationChip = ({ data }: LProps) => {
  return <Typography>{geCountryRegionDisplay(data.competition)}</Typography>;
};
