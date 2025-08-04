import { TableCell } from '@mui/material';
import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';

type Props = {
  value: boolean;
};

export const BooleanCell = (props: Props) => {
  return (
    <TableCell>
      {props.value ? (
        <CheckOutlined fontSize="small" color="primary" />
      ) : (
        <CloseOutlined fontSize="small" color="secondary" />
      )}
    </TableCell>
  );
};
