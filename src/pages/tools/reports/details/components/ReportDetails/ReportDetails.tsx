import { Box, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Grid from '@mui/material/Grid';
import { BorderedTable } from 'components';
import { getReportFormat } from '../../utils/getters';
import { humanizeAttribute } from '../../utils/humanize-attribute';

type Props = {
  visible: boolean;
  data: any;
};

export const ReportDetails = (props: Props) => {
  const odfBodyAttributes = Object.entries(props.data.OdfBody._attributes)
    .filter(([key]) => !key.startsWith('xmlns'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const format = getReportFormat(props.data);

  if (!props.visible) return null;

  return (
    <>
      <Grid size={{ md: format === 'competition' ? 6 : 12, xs: 12 }}>
        <TableContainer component={Box}>
          <BorderedTable stickyHeader size="small">
            <TableBody>
              {Object.entries(odfBodyAttributes).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell scope="row" sx={{ width: '30%' }}>
                    {humanizeAttribute(key)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{value?.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </BorderedTable>
        </TableContainer>
      </Grid>
      {format === 'competition' && (
        <Grid size={{ md: 6, xs: 12 }}>
          <TableContainer component={Box}>
            <BorderedTable stickyHeader size="small">
              <TableBody>
                {Object.entries(props.data.OdfBody.Competition.Categories.Category._attributes).map(
                  ([key, value]) => (
                    <TableRow key={key}>
                      <TableCell scope="row" sx={{ width: '30%' }}>
                        {humanizeAttribute(key)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{value?.toString()}</TableCell>
                    </TableRow>
                  )
                )}
                {Object.entries(props.data.OdfBody.Competition.Document._attributes).map(
                  ([key, value]) => (
                    <TableRow key={key}>
                      <TableCell scope="row" sx={{ width: '30%' }}>
                        {humanizeAttribute(key)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{value?.toString()}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </BorderedTable>
          </TableContainer>
        </Grid>
      )}
    </>
  );
};
