import { IconButton, TableCell } from '@mui/material';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

type Props = {
  open: boolean;
  setOpen: () => void;
};

export function ExpandCell(props: Props) {
  return (
    <TableCell>
      <IconButton aria-label="expand row" size="small" onClick={() => props.setOpen()}>
        {props.open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
      </IconButton>
    </TableCell>
  );
}
