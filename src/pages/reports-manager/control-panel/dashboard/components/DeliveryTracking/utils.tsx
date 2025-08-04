import { useNavigate } from 'react-router-dom';
import { EntityType, EnumType, useEnums } from 'models';
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { lightenHexColor } from '_helpers';
import dayjs from 'dayjs';
import { LinearProgress } from 'components';
import useAppRoutes from 'hooks/useAppRoutes';
import baseConfig from 'baseConfig';

type Props = {
  data: any;
  dataInfo: any;
};

export const BuildDeliveryCard = (props: Props) => {
  const navigate = useNavigate();
  const { getDetailRoute } = useAppRoutes();
  const { getEnumValueOf } = useEnums();
  const status = getEnumValueOf(props.data.status, EnumType.DeliveryStatus);
  const type = getEnumValueOf(props.data.type, EnumType.DeliveryType);
  const scheduleDate = dayjs(props.data.scheduleDate)
    .format(baseConfig.dayDateFormat)
    .toUpperCase();
  const color = props.data.rate < 30 ? 'error' : props.data.rate < 50 ? 'warning' : 'success';
  const Icon = type?.icon;

  return (
    <ListItemButton
      divider
      onClick={() => navigate(getDetailRoute(EntityType.DeliveryPlan, props.data.id))}
    >
      <ListItemAvatar>
        <Avatar sx={{ color: type!.color, bgcolor: lightenHexColor(type!.color, 0.7) }}>
          {Icon && <Icon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2">
            <span style={{ fontWeight: 'bold' }}>{type?.text}</span>
            {` | ${scheduleDate} | `}
            <span style={{ fontWeight: 'bold', color: status!.color }}>{status?.text}</span>
            {` | `}
            <span
              style={{ fontStyle: 'italic' }}
            >{`${props.data.daysRemaining} days remaining`}</span>
          </Typography>
        }
        secondary={
          <Stack>
            <LinearProgress value={props.data.rate} color={color} />
            <>
              {props.data.scope?.map((x: string, index: number) => {
                const value = props.dataInfo.find((y: any) => y.id == x || y.code == x);
                return (
                  <Typography variant="body2" key={x}>
                    <b>{value?.code}</b>&nbsp;
                    <span key={index}>{value?.title}</span>
                  </Typography>
                );
              })}
            </>
          </Stack>
        }
      />
    </ListItemButton>
  );
};
