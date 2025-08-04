import { TableCell, TableRow } from '@mui/material';
import { humanize } from '_helpers';
import type { RuleProps } from 'types/ingestion';

export const MovePhasesRow = (props: RuleProps) => {
  return (
    <TableRow>
      <TableCell>{props.data.code}</TableCell>
      <TableCell>{props.data.extendedInfo?.name}</TableCell>
      <TableCell>{props.data.extendedInfo?.type}</TableCell>
      <TableCell>{humanize(props.data.level)}</TableCell>
    </TableRow>
  );
};
