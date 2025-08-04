import { TableBody } from '@mui/material';
import type { TableProps } from './types';
import { BorderedTable } from 'components';
import { ScheduleHeaderCell } from '../ScheduleHeaderCell';
import { StructurePhaseRow } from './StructurePhaseRow';

export const PhaseTable = (props: TableProps) => {
  return (
    <BorderedTable stickyHeader size="small">
      <ScheduleHeaderCell />
      <TableBody>
        {props.data.map((x: any) => (
          <StructurePhaseRow {...props} key={x.code} data={x} />
        ))}
      </TableBody>
    </BorderedTable>
  );
};
