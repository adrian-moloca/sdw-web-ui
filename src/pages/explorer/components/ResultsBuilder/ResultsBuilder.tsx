import {
  CumulativeDisplay,
  PhaseDisplay,
  PhaseUnitsDisplay,
  PoolsDisplay,
  RankingDisplay,
  UnitDisplay,
} from 'pages/explorer/components';
import type { Link } from 'types/explorer';
import { ROUNDS } from 'constants/explorer';
import { Grid } from '@mui/material';

type Props = {
  data: any;
  discipline: string;
  rounds: Array<any>;
};

export const ResultsBuilder = ({ data, discipline, rounds }: Props) => {
  if (data?.type == ROUNDS.POOL_TYPE) {
    return <PoolsDisplay data={data} discipline={discipline} />;
  }

  if (data?.type == ROUNDS.CUMULATIVE_TYPE) {
    return <CumulativeDisplay data={data} rounds={rounds} discipline={discipline} />;
  }

  if (data?.stageType == ROUNDS.POOL_TYPE)
    return <PoolsDisplay data={data} discipline={discipline} />;

  if (data?.stageType == ROUNDS.CUMULATIVE_TYPE)
    return <CumulativeDisplay data={data} rounds={rounds} discipline={discipline} />;

  if (data?.usdmType === ROUNDS.PHASE_TYPE && data?.phaseType == ROUNDS.RANKING)
    return <RankingDisplay data={data} discipline={discipline} />;

  if (data?.usdmType === ROUNDS.PHASE_TYPE)
    return <PhaseDisplay data={data} discipline={discipline} />;

  if (data?.usdmType === ROUNDS.UNIT_TYPE)
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <UnitDisplay data={data} discipline={discipline} showTitle={true} />
        </Grid>
      </Grid>
    );

  return (
    <Grid container spacing={2}>
      {data?.links?.map((link: Link) => (
        <Grid size={12} key={link.href}>
          <PhaseUnitsDisplay
            discipline={discipline}
            data={data}
            link={link.href}
            showTitle={true}
          />
        </Grid>
      ))}
    </Grid>
  );
};
