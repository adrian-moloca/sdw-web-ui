import { TableCell, TableRow } from '@mui/material';
import type { RuleProps } from 'types/ingestion';

export const MoveSubunitRow = (props: RuleProps) => {
  return (
    <TableRow>
      <TableCell>{props.data.extendedInfo?.order}</TableCell>
      <TableCell>{props.data.code}</TableCell>
      <TableCell>{props.data.extendedInfo?.name}</TableCell>
      <TableCell>{props.data.scheduleFromCode}</TableCell>
      <TableCell>{props.data.propagateToCodes?.join(', ')}</TableCell>
      <TableCell>{props.data.extendedInfo?.type}</TableCell>
    </TableRow>
  );
};
