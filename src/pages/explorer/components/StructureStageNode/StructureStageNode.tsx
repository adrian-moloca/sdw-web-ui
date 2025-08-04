import { Typography } from '@mui/material';
import { MainCard } from 'components';
import { normalizeTitle } from '../../utils/event-rounds';
import baseConfig from 'baseConfig';
import dayjs from 'dayjs';

type Props = {
  data: any;
};

export const StructureStageNode = ({ data }: Props) => {
  return (
    <MainCard
      content={false}
      size="small"
      border={false}
      divider={false}
      title={normalizeTitle(data.title)}
      subHeader={
        <Typography variant="body2" color="text.secondary" lineHeight={1.1}>
          {dayjs(data.start.date).format(baseConfig.dayDateFormat).toUpperCase()}
          {' - '}
          {dayjs(data.end.date).format(baseConfig.dayDateFormat).toUpperCase()}
        </Typography>
      }
    />
  );
};
