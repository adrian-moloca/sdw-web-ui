import { TableBody } from '@mui/material';
import type { TableProps } from './types';
import { BorderedTable } from 'components';
import { ScheduleHeaderCell } from '../ScheduleHeaderCell';
import { StructureSubUnitRow } from './StructureSubUnitRow';

export const SubUnitTable = (props: TableProps) => {
  return (
    <BorderedTable stickyHeader size="small">
      <ScheduleHeaderCell />
      <TableBody>
        {props.data.map((x: any) => (
          <StructureSubUnitRow {...props} key={x.code} data={x} />
        ))}
      </TableBody>
    </BorderedTable>
  );
};
