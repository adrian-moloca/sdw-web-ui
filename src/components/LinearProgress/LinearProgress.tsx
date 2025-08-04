import {
  Box,
  LinearProgressProps,
  Typography,
  LinearProgress as MaterialLinearProgress,
} from '@mui/material';

type Props = LinearProgressProps & { value: number; width?: number };

export const LinearProgress = (props: Props) => {
  const { color: linearProgressColor, value, width } = props;
  let color: 'error' | 'warning' | 'success';

  if (value < 30) {
    color = 'error';
  } else if (value < 50) {
    color = 'warning';
  } else {
    color = 'success';
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <MaterialLinearProgress
          variant="determinate"
          {...props}
          color={linearProgressColor ?? color}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography component="span" variant="body2">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};
