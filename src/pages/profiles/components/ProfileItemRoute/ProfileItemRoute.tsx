import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import get from 'lodash/get';
import { ElementType } from 'react';
import { FieldTemplate } from 'components';
import { EntityType, TemplateType } from 'models';
import useAppRoutes from 'hooks/useAppRoutes';

type Props = { data?: any; type: EntityType; icon?: ElementType };

export const ProfileItemRoute = (props: Props) => {
  const { getDetailRoute } = useAppRoutes();
  const Icon = props.icon;

  if (!props.data) return null;

  return (
    <ListItem sx={{ py: 0 }}>
      {Icon && (
        <ListItemIcon>
          <Icon style={{ fontSize: '1rem' }} />
        </ListItemIcon>
      )}
      <ListItemText sx={{ textAlign: 'right', margin: 0 }}>
        <FieldTemplate
          type={TemplateType.RouteDirect}
          value={get(props.data, 'title')}
          route={getDetailRoute(props.type, get(props.data, 'id'))}
        />
      </ListItemText>
    </ListItem>
  );
};
