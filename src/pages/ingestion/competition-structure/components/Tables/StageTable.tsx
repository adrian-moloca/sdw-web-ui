import { TableBody } from '@mui/material';
import { BorderedTable } from 'components';
import { DefaultHeaderCell } from '../DefaultHeaderCell';
import { StructureStageRow } from './StructureStageRow';
import type { TableProps } from './types';

export const StageTable = (props: TableProps) => {
  return (
    <BorderedTable stickyHeader size="small">
      <DefaultHeaderCell />
      <TableBody>
        {props.data.map((x: any) => (
          <StructureStageRow {...props} key={x.code} data={x} />
        ))}
      </TableBody>
    </BorderedTable>
  );
};
