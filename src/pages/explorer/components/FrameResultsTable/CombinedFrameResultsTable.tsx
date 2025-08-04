import Grid from '@mui/material/Grid';
import get from 'lodash/get';
import { FrameResultsTable } from './FrameResultsTable';

type Props = {
  data: Array<any>;
  discipline: string;
};
export const CombinedFrameResultsTable = ({ data, discipline }: Props) => {
  if (!data) return null;
  if (data.length == 0) return null;
  const frameValueCount = Math.max(
    get(data[0], 'frameBracket.brackets')?.length ?? 0,
    get(data[1], 'frameBracket.brackets')?.length ?? 0
  );
  if (frameValueCount < 7) return null;
  const formatData0 = get(data[0], 'frameTable');
  const formatData1 = get(data[1], 'frameTable');

  if (!formatData0 || !formatData1) return null;
  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <FrameResultsTable
          discipline={discipline}
          frameTable={formatData0}
          title={get(data[0], 'name')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FrameResultsTable
          discipline={discipline}
          frameTable={formatData1}
          title={get(data[1], 'name')}
        />
      </Grid>
    </>
  );
};
