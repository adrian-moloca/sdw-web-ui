// material-ui
import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import config from 'baseConfig';

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

export const ViewSkeleton = () => (
  <Card>
    <CardContent>
      <Grid container spacing={config.gridSpacing}>
        <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 5, lg: 3 }}>
          <Grid size={12}>
            <Skeleton variant="rectangular" height={300} width={'100%'} />
          </Grid>
          <Grid size={12}>
            <Skeleton variant="rectangular" height={100} width={'100%'} />
          </Grid>
        </Grid>
        <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 7, lg: 9 }}>
          <Skeleton variant="rectangular" height={410} width={'100%'} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
