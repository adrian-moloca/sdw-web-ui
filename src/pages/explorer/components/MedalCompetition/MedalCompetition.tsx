import { ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import dayjs from 'dayjs';
import get from 'lodash/get';
import type { MedalType } from 'types/explorer';
import { MedalStack } from '../MedalStack';
import { DisciplineAvatar } from '../DisciplineAvatar';
import baseConfig from 'baseConfig';

type Props = {
  data: any;
  field: MedalType;
};

export const MedalCompetition = ({ data, field }: Props) => {
  return (
    <ListItem
      key={data.event?.id}
      sx={{ py: 0 }}
      title={data.competition.title}
      secondaryAction={<MedalStack field={field} value={get(data, field)} />}
    >
      <ListItemAvatar>
        <DisciplineAvatar code={data.discipline.code} title={data.discipline.title} size={20} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography sx={{ lineHeight: 1.1 }}>{data.competition.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.1 }}>
              {`${dayjs(data.competition.startDate).format(baseConfig.generalDateFormat)}-${dayjs(data.competition.finishDate).format(baseConfig.generalDateFormat)}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.1 }}>
              {data.event.title}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
};
