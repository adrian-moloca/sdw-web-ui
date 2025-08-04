// material-ui
import { Card, CardContent } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import config from 'baseConfig';
import Grid from '@mui/material/Grid';
// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

export const JustChart = () => (
  <Card>
    <CardContent>
      <Grid container spacing={config.gridSpacing}>
        <Grid size={12}>
          <Skeleton variant="rectangular" height={20} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rectangular" height={530} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
