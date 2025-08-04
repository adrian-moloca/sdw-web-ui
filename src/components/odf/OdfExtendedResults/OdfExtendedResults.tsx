import { Box, Grid, Typography } from '@mui/material';
import { getOdfDefinition, transformOdfExtensions } from '_helpers';
import { OdfTable } from 'components';

export const OdfExtendedResults = (param: { data: any; discipline: string }) => {
  if (!param.data || param.data.length == 0) return null;
  const hasExt = param.data?.filter((x: any) => x.ext !== undefined).length > 0;
  const hasNoExt = param.data?.filter((x: any) => x.ext === undefined).length > 0;
  if (hasExt)
    return (
      <Grid size={12} container spacing={1}>
        {param.data
          .filter((x: any) => x.ext)
          .map((row: any) => (
            <Grid key={`${row.code}-${row?.pos}-${row.value}`} size={12}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="body2" fontWeight={'bold'}>
                  {`${getOdfDefinition(row.code, param.discipline)?.text ?? row.code} ${row.pos ?? ''}`.trim()}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="body2" fontWeight={'bold'}>
                  {row.value}
                </Typography>
              </Box>
              <OdfTable data={transformOdfExtensions(row, 'ext')} discipline={param.discipline} />
            </Grid>
          ))}
        {hasNoExt && param.discipline.endsWith('EQU') && (
          <Grid size={12}>
            <OdfTable data={param.data.filter((x: any) => !x.ext)} discipline={param.discipline} />
          </Grid>
        )}
      </Grid>
    );
  return (
    <Grid size={12}>
      <OdfTable data={param.data} discipline={param.discipline} />
    </Grid>
  );
};
