import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { OlympicColors } from 'themes/colors';
import { lightenHexColor } from '_helpers';
import { CircularImageCard } from 'components';
import backgroundImage from 'assets/images/running.jpeg';
import { layout } from 'themes/layout';

type Props = {
  links: any[];
  title: string;
};

export const renderShortcuts = (props: Props) => {
  const theme = useTheme();

  return (
    <>
      <Grid size={12}>
        <Divider sx={{ mt: 2 }}>
          <Typography variant="h5" component="span">
            {props.title}
          </Typography>
        </Divider>
      </Grid>
      <Grid size={12}>
        <Card
          sx={{
            position: 'relative',
            padding: '10px',
            borderRadius: layout.radius.sm,
            background: `radial-gradient(circle at top left, ${OlympicColors.YELLOW} 15%, transparent  10%)`,
          }}
          elevation={0}
        >
          <CardContent sx={{ zIndex: 1, px: 2, py: 4 }}>
            <Grid container spacing={2}>
              {props.links.map((data, i) => {
                return (
                  <Grid key={i} size={{ xs: 12, md: 4, lg: 3 }}>
                    <Card sx={{ bgcolor: theme.palette.primary.main, zIndex: 1, px: 0 }}>
                      <CardActionArea
                        onClick={() => data.onClick()}
                        aria-label={data.title}
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          alignContent: 'center',
                          height: 90,
                        }}
                      >
                        <Stack>
                          <Typography
                            variant="h5"
                            sx={{ lineHeight: 1.2, color: theme.palette.common.white, zIndex: 1 }}
                            textAlign="center"
                            component="span"
                          >
                            {data.title}
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            fontSize: 36,
                            position: 'absolute',
                            left: '-22px',
                            bottom: '-26px',
                            transform: 'rotate(25deg)',
                            color: lightenHexColor(theme.palette.primary.main, 0.5),
                            zIndex: 0,
                          }}
                        >
                          <data.icon sx={{ fontSize: 110 }} />
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
          <CircularImageCard imageUrl={backgroundImage} />
        </Card>
      </Grid>
    </>
  );
};
