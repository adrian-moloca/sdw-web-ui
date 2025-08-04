// material-ui
import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import config from 'baseConfig';

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

export const ViewSkeleton = () => (
  <Grid container spacing={config.gridSpacing}>
    <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 5, lg: 3 }}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={400} width={'100%'} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 7, lg: 9 }}>
      <Grid size={12}>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={500} width={'100%'} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Grid>
);
