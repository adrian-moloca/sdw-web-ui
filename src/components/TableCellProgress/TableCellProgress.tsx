import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material';

type Props = LinearProgressProps & { value: number };

export const TableCellProgress = ({ color: progressColor, value }: Props) => {
  const formatValue = value ?? 0;

  function getStatusColor(value: number): 'error' | 'warning' | 'success' {
    if (value < 30) {
      return 'error';
    }
    if (value < 50) {
      return 'warning';
    }
    return 'success';
  }
  const color = getStatusColor(formatValue);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="determinate" value={formatValue} color={progressColor ?? color} />
      </Box>
      <Box sx={{ marginLeft: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${Math.round(formatValue)}%`}</Typography>
      </Box>
    </Box>
  );
};
