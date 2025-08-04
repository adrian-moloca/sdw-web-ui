import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import config from 'baseConfig';

export const MapSkeleton = () => (
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
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Skeleton variant="text" />
                </Grid>
                <Grid size={12}>
                  <Skeleton variant="rectangular" height={20} />
                </Grid>
              </Grid>
            </Grid>
            <Grid>
              <Skeleton variant="rectangular" height={50} width={80} />
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
