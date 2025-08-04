import { Stack, TableCell, Typography, useTheme } from '@mui/material';
import ManOutlined from '@mui/icons-material/ManOutlined';
import WomanOutlined from '@mui/icons-material/WomanOutlined';
import WcOutlined from '@mui/icons-material/WcOutlined';

type Props = {
  data: any;
};

export const GenderCell = (props: Props) => {
  const theme = useTheme();
  const Icon =
    props.data.gender == 'M' ? ManOutlined : props.data.gender == 'W' ? WomanOutlined : WcOutlined;
  const label =
    props.data.gender == 'M'
      ? 'Men'
      : props.data.gender == 'W'
        ? 'Women'
        : props.data.gender == 'X'
          ? 'Mixed'
          : 'Open';

  return (
    <TableCell>
      <Stack direction="row">
        <Icon fontSize="small" sx={{ color: theme.palette.secondary.dark }} />
        <Typography variant="body2">{label}</Typography>
      </Stack>
    </TableCell>
  );
};
