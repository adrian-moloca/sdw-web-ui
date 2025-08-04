import { TableCell, Typography } from '@mui/material';
import { FlaggedCodeCell } from '../FlaggedCodeCell';

type Props = {
  data: any;
};

export const DefaultBodyCells = (props: Props) => {
  return (
    <>
      <TableCell component="th" scope="row">
        <Typography variant="body2">{props.data.order}</Typography>
      </TableCell>
      <FlaggedCodeCell data={props.data} />
      <TableCell>
        <Typography variant="body2">{props.data.title}</Typography>
      </TableCell>
    </>
  );
};
