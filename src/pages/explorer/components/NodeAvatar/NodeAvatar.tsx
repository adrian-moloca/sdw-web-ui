import { blue, cyan, lime, pink, purple } from '@mui/material/colors';
import { Avatar } from '@mui/material';
import { EntityType } from 'models';

type Props = {
  data: any;
  type:
    | EntityType.Event
    | EntityType.Stage
    | EntityType.Phase
    | EntityType.Unit
    | EntityType.SubUnit;
  size?: 'small' | 'medium';
};

export const NodeAvatar = ({ data, type }: Props) => {
  const entityStyles = {
    [EntityType.Event]: { bgcolor: lime[600], prefix: 'E' },
    [EntityType.Stage]: { bgcolor: blue[600], prefix: 'S' },
    [EntityType.Phase]: { bgcolor: pink[600], prefix: 'P' },
    [EntityType.Unit]: { bgcolor: cyan[700], prefix: 'U' },
    [EntityType.SubUnit]: { bgcolor: purple[700], prefix: 'S' },
  };

  const entity = entityStyles[type];
  if (!entity) return null;

  return (
    <Avatar
      variant="rounded"
      sx={{ height: '28px', width: '32px', bgcolor: entity.bgcolor, fontSize: '14px' }}
    >
      {`${entity.prefix}${data.order ?? 'X'}`}
    </Avatar>
  );
};
