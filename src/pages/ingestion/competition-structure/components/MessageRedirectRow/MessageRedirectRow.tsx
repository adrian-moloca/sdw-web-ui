import { TableCell, TableRow } from '@mui/material';
import { EnumTemplate } from 'components';
import { EnumType } from 'models';
import { humanize } from '_helpers';
import type { RuleProps } from 'types/ingestion';

export const MessageRedirectRow = (props: RuleProps) => {
  return (
    <TableRow>
      <TableCell>{props.data.fromCode}</TableCell>
      <TableCell>{props.data.code}</TableCell>
      <TableCell>{humanize(props.data.type)}</TableCell>
      <TableCell>{props.data.level}</TableCell>
      <TableCell>{props.data.toLevel}</TableCell>
      <TableCell>
        <EnumTemplate type={EnumType.RuleMode} value={props.data.kind} withText={true} />
      </TableCell>
    </TableRow>
  );
};
