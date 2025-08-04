import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ElementType, ReactElement } from 'react';

type Props = {
  element: ReactElement;
  value?: string;
  icon?: ElementType;
};

export const ProfileItemElement = (props: Props) => {
  if (!props.element) return null;

  const Icon = props.icon;

  return (
    <ListItem sx={{ py: 0 }}>
      {Icon && (
        <ListItemIcon>
          <Icon style={{ fontSize: '1rem' }} />
        </ListItemIcon>
      )}
      {props.value && (
        <ListItemText
          primary={props.value}
          sx={{ textAlign: 'left', margin: 0, fontSize: '0.8rem' }}
        />
      )}
      <ListItemText sx={{ textAlign: 'right', margin: 0 }}>{props.element}</ListItemText>
    </ListItem>
  );
};
