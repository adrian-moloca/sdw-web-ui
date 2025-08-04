import type { TableProps } from './types';
import { TableCell, TableRow, Typography } from '@mui/material';
import { DefaultBodyCells } from '../DefaultBodyCells';
import { MedalCell } from '../MedalCell';
import { ScheduledCell } from '../ScheduledCell';
import { MessageCell } from '../MessageCell';
import { RulesBadgeViewer } from '../RulesViewer/RulesBadge';

export const StructureSubUnitRow = (props: TableProps) => {
  return (
    <TableRow>
      <TableCell />
      <DefaultBodyCells {...props} />
      <TableCell>
        <Typography variant="body2">{props.data.type}</Typography>
      </TableCell>
      <MedalCell {...props} />
      <ScheduledCell {...props} />
      <MessageCell {...props} />
      <RulesBadgeViewer {...props} type="subunit" />
    </TableRow>
  );
};
