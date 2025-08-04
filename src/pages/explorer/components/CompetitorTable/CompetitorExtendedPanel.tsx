import { Grid } from '@mui/material';
import {
  ExtendedJudgeScoring,
  ExtendedPointsBreakdown,
  ExtendedSingleMetrics,
  FrameResultsTable,
} from 'pages/explorer/components';
import { ParticipantTable } from './ParticipantTable';

type Props = {
  row: any;
  discipline: string;
};
export const CompetitorExtendedPanel: React.FC<Props> = ({ row, discipline }) => {
  return (
    <Grid container spacing={0}>
      <FrameResultsTable discipline={discipline} frameTable={row.frameTable} />
      <ExtendedPointsBreakdown data={row} />
      <ExtendedJudgeScoring data={row} />
      <ParticipantTable data={row} discipline={discipline} />
      <ExtendedSingleMetrics data={row} />
    </Grid>
  );
};
