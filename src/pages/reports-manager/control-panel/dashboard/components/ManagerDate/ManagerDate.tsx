import { Box, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { MainCard } from 'components/cards/MainCard';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';
import CallReceivedOutlinedIcon from '@mui/icons-material/CallReceivedOutlined';
import { calculateDaysFromToday } from 'pages/reports-manager/utils/date';
import baseConfig from 'baseConfig';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

type Props = {
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  title: string;
  date: Date;
  percentage?: string;
  isLoss?: boolean;
  extra?: string;
};

export const ManagerDate = (props: Props) => {
  return (
    <MainCard contentSX={{ p: 2 }} border={true} boxShadow={false}>
      <Stack spacing={1}>
        <Typography variant="body2">{props.title}</Typography>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Typography variant="body1" color="inherit" sx={{ fontWeight: 600 }}>
            {dayjs(props.date).format(baseConfig.dateTimeDateFormat).toUpperCase()}
          </Typography>
          {props.percentage && (
            <Chip
              variant="outlined"
              color={props.color}
              icon={
                props.isLoss ? (
                  <CallReceivedOutlinedIcon style={iconSX} />
                ) : (
                  <ArrowOutwardOutlinedIcon style={iconSX} />
                )
              }
              label={`${props.percentage}%`}
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          )}
        </Stack>
      </Stack>
      <Box>
        <Typography variant="caption">
          There are{'  '}
          <Typography
            component="span"
            variant="caption"
            sx={{ color: `${props.color || 'primary'}.main`, fontWeight: 600 }}
          >
            {calculateDaysFromToday(props.date)}
          </Typography>{' '}
          remaining days until this delivery
        </Typography>
      </Box>
    </MainCard>
  );
};
