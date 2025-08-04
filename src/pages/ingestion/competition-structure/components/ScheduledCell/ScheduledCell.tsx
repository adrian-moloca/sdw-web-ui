import { TableCell, useTheme } from '@mui/material';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';

type Props = {
  data: any;
};

export const ScheduledCell = (props: Props) => {
  const theme = useTheme();

  return (
    <TableCell>
      <AccessTimeOutlined
        fontSize="small"
        sx={{ color: props.data.scheduled ? theme.palette.divider : theme.palette.primary.dark }}
      />
    </TableCell>
  );
};
