import { Typography } from '@mui/material';
import baseConfig from 'baseConfig';
import dayjs from 'dayjs';

export const DateSection = (title: string, date: string | undefined) =>
  date && (
    <Typography variant="body2">
      <span>{`${title}:  `}</span>
      <span style={{ fontStyle: 'italic' }}>
        {dayjs(date).format(baseConfig.dateTimeDateFormat)}
      </span>
    </Typography>
  );
