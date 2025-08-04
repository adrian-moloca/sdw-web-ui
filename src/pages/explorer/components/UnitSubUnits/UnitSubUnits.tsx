import Grid from '@mui/material/Grid';
import { SubunitDisplay } from '../SubunitDisplay';

type Props = {
  data: any;
  discipline: string;
};

export const UnitSubUnits = ({ data, discipline }: Props) => {
  return (
    <Grid container spacing={2}>
      {data?.map((e: any) => (
        <Grid size={12} key={e.id}>
          <SubunitDisplay data={e} discipline={discipline} />
        </Grid>
      ))}
    </Grid>
  );
};
