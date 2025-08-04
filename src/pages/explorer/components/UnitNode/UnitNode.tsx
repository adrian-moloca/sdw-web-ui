import { Typography } from '@mui/material';
import { MainCard } from 'components';
import { normalizeTitle } from '../../utils/event-rounds';

type Props = {
  data: any;
};

export const UnitNode = ({ data }: Props) => {
  return (
    <MainCard
      content={false}
      headerSX={{ p: 0, height: 30 }}
      border={false}
      divider={false}
      title={
        <Typography textAlign="left" lineHeight={1.1} fontWeight="500">
          {normalizeTitle(data.title)}
        </Typography>
      }
    />
  );
};
