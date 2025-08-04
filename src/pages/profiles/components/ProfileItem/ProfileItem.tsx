import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ElementType } from 'react';
import { humanize } from '_helpers';

type Props = { title: string; value?: string; icon: ElementType; skip?: boolean };

export const ProfileItem = (props: Props) => {
  if (!props.title && !props.value) return null;

  const Icon = props.icon;

  return (
    <ListItem sx={{ py: 0 }}>
      {props.value && (
        <ListItemText primary={props.value} sx={{ textAlign: 'left', margin: 0, opacity: 0.6 }} />
      )}
      <ListItemIcon>
        <Icon style={{ fontSize: '1rem' }} />
      </ListItemIcon>
      <ListItemText
        primary={props.skip ? props.title : humanize(props.title)}
        secondary={props.value}
        sx={{ textAlign: 'right', margin: 0 }}
      />
    </ListItem>
  );
};
