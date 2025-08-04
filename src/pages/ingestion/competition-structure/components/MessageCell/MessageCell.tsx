import { TableCell, Tooltip } from '@mui/material';
import UpcomingOutlined from '@mui/icons-material/UpcomingOutlined';
import { TableStyledBadge } from '../TableStyledBadge';

type Props = {
  data: any;
};

export function MessageCell(props: Readonly<Props>) {
  const hasMessages = props.data.messages && props.data.messages.length > 0;
  const noMessages = hasMessages ? props.data?.messages.length : 0;
  const color = noMessages == 0 ? 'error' : noMessages > 1 ? 'warning' : 'primary';
  return (
    <TableCell>
      <Tooltip title={hasMessages ? props.data?.messages.join(' | ') : 'No messages'}>
        <TableStyledBadge color={color} badgeContent={noMessages} showZero>
          <UpcomingOutlined fontSize="small" />
        </TableStyledBadge>
      </Tooltip>
    </TableCell>
  );
}
