import { Grid } from '@mui/material';
import { DisplayTable } from 'components';
import chunk from 'lodash/chunk';
import get from 'lodash/get';

export const OdfSchemaStats = (param: { data: any; discipline: string }) => {
  const extendedInfo = get(param.data, 'extendedInfo');
  const stats = get(extendedInfo, 'statistics');
  if (!stats || stats.length == 0) return null;
  return DisplayTable(stats);
};
export const OdfSchemaExtendedResults = (param: { data: any; discipline: string }) => {
  if (!param.data || param.data.length == 0) return null;
  return param.data.map((row: any) => (
    <Grid container spacing={2} key={row.schema ?? JSON.stringify(row).slice(0, 50)}>
      <OdfSchemaTable data={row} />
    </Grid>
  ));
};

export const OdfSchemaTable = (param: { data: any }) => {
  if (!param.data) return null;
  return chunk(
    Object.keys(param.data).filter((x: string) => x !== 'schema'),
    6
  ).map((chunkFields: string[]) => {
    const tableData: Record<string, number> = {};
    chunkFields.forEach((field: string) => {
      tableData[field] = param.data[field];
    });

    const key = chunkFields.join('-');

    return <Grid key={key}>{DisplayTable(tableData)}</Grid>;
  });
};
