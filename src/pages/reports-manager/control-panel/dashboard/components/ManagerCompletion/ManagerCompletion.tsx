import get from 'lodash/get';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Gauge } from '@mui/x-charts-pro';
import { t } from 'i18next';
import dayjs from 'dayjs';
import baseConfig from 'baseConfig';

type Props = {
  data: any;
  field: string;
  title: string;
  mode: 'execution' | 'delivery' | 'data';
};

export const ManagerCompletion = (props: Props) => {
  const theme = useTheme();
  const backgroundRate = `url("data:image/svg+xml,%3Csvg width='1440' height='320' viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23cce7ff' fill-opacity='1' d='M0,96L30,112C60,128,120,160,180,170.7C240,181,300,171,360,176C420,181,480,203,540,202.7C600,203,660,181,720,176C780,171,840,181,900,170.7C960,160,1020,128,1080,128C1140,128,1200,160,1260,181.3C1320,203,1380,213,1410,218.7L1440,224L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") no-repeat center center`;
  const backgroundDelivery = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1440' height='320' viewBox='0 0 1440 320'%3E%3Crect width='100%25' height='100%25' fill='%23ffe5b3'/%3E%3Cpath fill='%23fcc96c' d='M0,96L30,112C60,128,120,160,180,170.7C240,181,300,171,360,176C420,181,480,203,540,202.7C600,203,660,181,720,176C780,171,840,181,900,170.7C960,160,1020,128,1080,128C1140,128,1200,160,1260,181.3C1320,203,1380,213,1410,218.7L1440,224L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z'/%3E%3C/svg%3E") no-repeat center center;`;

  return (
    <Box
      sx={{
        position: 'relative',
        background:
          props.mode === 'execution' ? '#f0f9ff' : props.mode === 'data' ? '#d8d8d8' : '#fef7ea',
        borderRadius: '12px',
        padding: 0,
        overflow: 'hidden',
        height: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          background: props.mode == 'execution' ? backgroundRate : backgroundDelivery,
          backgroundSize: 'cover',
          opacity: 0.3,
        }}
      />
      <Card
        sx={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <CardContent sx={{ paddingTop: 0, paddingBottom: '0!important' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ lg: 2, md: 3, sm: 4, xs: 4 }}>
              <Gauge
                width={120}
                height={120}
                value={get(props.data, props.field) ?? 0}
                text={({ value }) => `${value}%`}
              />
            </Grid>
            <Grid size={{ lg: 10, md: 8, sm: 8, xs: 8 }}>
              <Typography variant="h6" color={theme.palette.common.black}>
                {props.title}
              </Typography>
              <Typography variant="body2" color={theme.palette.common.black}>
                {t('message.latest-modification-at')}
                <Typography component="span" variant="body2" style={{ color: '#1976d2' }}>
                  {dayjs(get(props.data, 'ts')).format(baseConfig.dateTimeDateFormat).toUpperCase()}
                </Typography>
                {` by `}
                <Typography component="span" variant="body2" style={{ color: '#1976d2' }}>
                  {get(props.data, 'updatedBy')}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
