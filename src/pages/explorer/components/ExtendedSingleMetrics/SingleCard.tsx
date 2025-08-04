import { Card, CardContent, Grid, Typography } from '@mui/material';
import { olympicsDesignColors } from 'themes/colors';

type Props = {
  data: any;
};
export const SingleCard = ({ data }: Props) => {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} spacing={2}>
      <Card
        sx={[
          (theme) => ({
            width: '100%',
            height: 60,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: `1px solid ${olympicsDesignColors.light.general.divider}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none',
          }),
          (theme) =>
            theme.applyStyles('dark', {
              textAlign: 'left',
              width: '100%',
              height: 60,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: `1px solid ${olympicsDesignColors.dark.general.divider}`,
              backgroundColor: olympicsDesignColors.dark.general.background,
              boxShadow: 'none',
            }),
        ]}
      >
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, textAlign: 'center' }}>
          <Typography
            variant="caption"
            component="div"
            color={'text.secondary'}
            noWrap
            sx={{ mb: 0 }}
          >
            {data?.label}
          </Typography>
          <Typography variant="body1" fontWeight={500} color={'text.primary'} noWrap>
            {data?.formattedValue}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
