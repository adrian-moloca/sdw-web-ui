import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import Grid from '@mui/material/Grid';
import { OlympicColors } from 'themes/colors';
import { CircularImageCard, MainCard } from 'components';
import { lightenHexColor } from '_helpers';
import SDW_Jump from 'assets/images/SDW_Team.avif';
import SDW_Medals from 'assets/images/SDW_Medals.avif';
import { layout } from 'themes/layout';

type Props = {
  links: any[];
  title: string;
};

export const Tools = (props: Props) => {
  const theme = useTheme();
  const isGeneral = props.title === t('main.links.tools');
  const color = isGeneral ? theme.palette.success.main : theme.palette.warning.main;

  return (
    <>
      <Grid size={12}>
        <Divider sx={{ my: 2 }}>
          <Typography variant="h4" component="span">
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
            background: isGeneral
              ? `radial-gradient(ellipse at top left, ${OlympicColors.RED} 20%, transparent  10%)`
              : `radial-gradient(ellipse at bottom left, ${OlympicColors.BLUE} 20%, transparent  10%)`,
          }}
          elevation={0}
        >
          <CardContent sx={{ zIndex: 1, px: 2, py: 4 }}>
            <Grid container spacing={2}>
              {props.links.map((data, i) => {
                return (
                  <Grid key={i} size={{ xs: 12, md: 4, lg: 3 }}>
                    <MainCard
                      boxShadow={false}
                      fullHeight
                      sx={{ bgcolor: color }}
                      content={false}
                      border={false}
                    >
                      <CardActionArea
                        onClick={() => data.onClick()}
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          alignContent: 'center',
                          height: 70,
                        }}
                        aria-label={data.title}
                      >
                        <Typography
                          variant="h5"
                          sx={{ lineHeight: 1.2, color: theme.palette.common.white, zIndex: 1 }}
                          textAlign="center"
                          component="span"
                        >
                          {data.title}
                        </Typography>
                        <Box
                          sx={{
                            fontSize: 36,
                            position: 'absolute',
                            left: '-22px',
                            bottom: '-26px',
                            transform: 'rotate(25deg)',
                            color: lightenHexColor(color, 0.5),
                            zIndex: 0,
                          }}
                        >
                          <data.icon sx={{ fontSize: 110 }} />
                        </Box>
                      </CardActionArea>
                      <CircularImageCard
                        imageUrl={isGeneral ? SDW_Jump : SDW_Medals}
                        borderRadius={isGeneral ? undefined : '0'}
                      />
                    </MainCard>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};
