import { TableBody } from '@mui/material';
import type { TableProps } from './types';
import { BorderedTable } from 'components';
import { ScheduleHeaderCell } from '../ScheduleHeaderCell';
import { StructureUnitRow } from './StructureUnitRow';

export const UnitTable = (props: TableProps) => {
  return (
    <BorderedTable stickyHeader size="small">
      <ScheduleHeaderCell />
      <TableBody>
        {props.data.map((x: any) => (
          <StructureUnitRow {...props} key={x.code} data={x} />
        ))}
      </TableBody>
    </BorderedTable>
  );
};
