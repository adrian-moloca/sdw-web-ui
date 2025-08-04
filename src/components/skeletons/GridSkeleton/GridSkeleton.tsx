import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import config from 'baseConfig';

export const GridSkeleton = () => (
  <Card>
    <CardContent>
      <Grid container spacing={config.gridSpacing}>
        <Grid size={12}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={config.gridSpacing}
          >
            <Grid>
              <Skeleton variant="rectangular" height={50} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rectangular" height={530} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
