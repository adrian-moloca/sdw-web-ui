import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import config from '../../../baseConfig';
import Skeleton from '@mui/material/Skeleton';

export const TableSkeleton = () => (
  <Card elevation={0}>
    <CardContent>
      <Grid container spacing={config.gridSpacing}>
        <Grid size={12}>
          <Skeleton variant="rectangular" height={250} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
