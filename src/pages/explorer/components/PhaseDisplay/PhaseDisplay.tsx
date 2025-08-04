import Grid from '@mui/material/Grid';
import { apiConfig } from 'config/app.config';
import { RoundCard } from 'components';
import {
  CompetitorTable,
  PhaseHeader,
  PhaseUnitsDisplay,
  ScheduleStatusChip,
} from 'pages/explorer/components';
import { isNullOrEmpty } from '_helpers';
import { useTranslation } from 'react-i18next';

type Props = {
  data: any;
  discipline: string;
};

export const PhaseDisplay = ({ data, discipline }: Props) => {
  const url = `${apiConfig.apiUsdmEndPoint}/phases/${data.id}`;
  const { i18n } = useTranslation();
  return (
    <Grid container spacing={2}>
      {!isNullOrEmpty(data.competitors) && data.competitors.length > 0 && (
        <Grid size={12}>
          <RoundCard
            title={<PhaseHeader data={data} />}
            secondary={<ScheduleStatusChip data={data} />}
          >
            <CompetitorTable data={data.competitors} discipline={discipline} />
          </RoundCard>
        </Grid>
      )}
      <Grid size={12}>
        <PhaseUnitsDisplay
          data={data}
          discipline={discipline}
          link={`${url}/units?languageCode=${i18n.language}`}
          showTitle={false}
        />
      </Grid>
    </Grid>
  );
};
