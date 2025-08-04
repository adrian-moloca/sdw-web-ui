import { Badge, Stack, TableCell, Typography, useTheme } from '@mui/material';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';

type Props = {
  data: any;
};

export const FlaggedCodeCell = (props: Props) => {
  const theme = useTheme();
  const hasWarning = props.data.warning === true;
  const hasError = props.data.error === true;

  return (
    <TableCell>
      <Stack direction="row" spacing={0.3}>
        <Badge color="secondary" badgeContent={0} variant="dot">
          {hasWarning && (
            <WarningAmberOutlined fontSize="small" sx={{ color: theme.palette.warning.main }} />
          )}
          {hasError && (
            <ErrorOutlineOutlined fontSize="small" sx={{ color: theme.palette.error.main }} />
          )}
        </Badge>
        <Typography variant="body2">{props.data.code}</Typography>
      </Stack>
    </TableCell>
  );
};
