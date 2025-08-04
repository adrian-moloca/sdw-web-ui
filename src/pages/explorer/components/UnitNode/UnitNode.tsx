import { Avatar, Typography } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { MainCard } from 'components';
import { normalizeTitle } from '../../utils/event-rounds';

type Props = {
  data: any;
  discipline: any;
};

export const UnitNode = ({ data }: Props) => {
  return (
    <MainCard
      content={false}
      headerSX={{ p: 0, height: 30 }}
      border={false}
      divider={false}
      title={
        <Typography textAlign="left" lineHeight={1.1} fontWeight="bold">
          {normalizeTitle(data.title)}
        </Typography>
      }
      avatar={
        <Avatar
          sx={{ height: '26px', width: '26px', bgcolor: cyan[600], fontSize: '14px' }}
        >{`U`}</Avatar>
      }
    />
  );
};
