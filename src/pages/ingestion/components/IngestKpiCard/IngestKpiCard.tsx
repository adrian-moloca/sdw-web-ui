import { Card, CardContent, Typography, CardHeader, Divider } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import { Box } from '@mui/system';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import type { TimeData } from 'types/ingestion';

type Props = {
  title: string;
  data: TimeData;
};

export const IngestKpiCard = (props: Props) => {
  const data = props.data;

  const getColor = (time: string): string => {
    const seconds = parseFloat(
      time
        .split(':')
        .reduce((acc, time) => 60 * acc + +time, 0)
        .toString()
    );

    if (seconds > 30) return red[500];

    if (seconds > 9) return orange[500];

    return green[500];
  };

  const formatTime = (time: string): string => {
    const [hours, minutes, seconds] = time.split(':').map(parseFloat);
    const hoursStr = hours ? `${hours}h ` : '';
    const minutesStr = minutes ? `${minutes}m ` : '';
    const secondsStr = `${seconds.toFixed(2)}s`;

    return hoursStr + minutesStr + secondsStr;
  };

  return (
    <Card
      sx={{
        width: '100%',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        transition: '0.3s',
        '&:hover': {
          boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
        },
        borderRadius: '10px',
        padding: '0px',
      }}
    >
      <CardHeader title={props.title} />
      <Divider />
      <CardContent>
        <Box>
          <Grid container alignItems="center">
            <AccessTimeIcon sx={{ mr: 1, color: getColor(data.avg) }} />
            <Typography variant="body2" color="textSecondary">
              {t('general.average')}:{' '}
              <Typography variant="body1" component="span">
                {formatTime(data.avg)}
              </Typography>
            </Typography>
          </Grid>
        </Box>
        <Box>
          <Grid container alignItems="center">
            <TrendingUpIcon sx={{ mr: 1, color: getColor(data.max) }} />
            <Typography variant="body2" color="textSecondary">
              {t('general.max')}:{' '}
              <Typography variant="body1" component="span">
                {formatTime(data.max)}
              </Typography>
            </Typography>
          </Grid>
        </Box>
        <Box>
          <Grid container alignItems="center">
            <TrendingDownIcon sx={{ mr: 1, color: getColor(data.mix) }} />
            <Typography variant="body2" color="textSecondary">
              {t('general.min')}:{' '}
              <Typography variant="body1" component="span">
                {formatTime(data.mix)}
              </Typography>
            </Typography>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
