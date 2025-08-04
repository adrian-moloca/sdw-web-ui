import { Grid } from '@mui/material';
import { transformOdfExtensions } from '_helpers';
import { OdfTableEmptyPosition } from 'components';
import groupBy from 'lodash/groupBy';

export const OdfTable = (param: { data: any; discipline: string }) => {
  const positionRows = param.data ? param.data?.filter((x: any) => x.pos) : [];
  if (!positionRows || positionRows.length == 0)
    return (
      <OdfTableEmptyPosition
        data={param.data?.filter((x: any) => !x.pos)}
        discipline={param.discipline}
      />
    );
  const groupedByPosition = groupBy(positionRows, 'pos');
  const uniquePositions = Object.keys(groupedByPosition);
  if (uniquePositions.length > 1)
    return (
      <Grid size={12}>
        <Grid container spacing={2}>
          <OdfTableEmptyPosition
            data={param.data?.filter((x: any) => !x.pos)}
            discipline={param.discipline}
          />
          <OdfTableEmptyPosition data={positionRows} discipline={param.discipline} />
        </Grid>
      </Grid>
    );
  return (
    <OdfTableEmptyPosition
      data={param.data.filter((x: any) => !x.pos)}
      discipline={param.discipline}
    />
  );
};

export const OdfMiscellaneous = (param: { data: any; discipline: string; name?: string }) => {
  const data =
    transformOdfExtensions(param.data, 'odfExtensions', 'miscellaneous') ??
    transformOdfExtensions(param.data, 'odfEventEntry', 'miscellaneous');
  if (!data || data.length == 0) return null;
  return <OdfTable data={data} discipline={param.discipline} />;
};
