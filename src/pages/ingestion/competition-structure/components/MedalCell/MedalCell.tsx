import { TableCell, useTheme } from '@mui/material';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';

type Props = {
  data: any;
};

export const MedalCell = (props: Props) => {
  const theme = useTheme();
  const hasMedal = props.data.medalFlag !== '0';

  return (
    <TableCell>
      <EmojiEventsOutlined
        fontSize="small"
        sx={{ color: hasMedal ? theme.palette.primary.main : theme.palette.divider }}
      />
    </TableCell>
  );
};
