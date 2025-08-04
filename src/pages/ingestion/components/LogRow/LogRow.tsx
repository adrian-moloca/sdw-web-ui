import { TableCell, TableRow } from '@mui/material';
import { FieldTemplate } from 'components';
import { TemplateType } from 'models';
import { formatElapsedTime } from '_helpers';

type Props = {
  row: any;
};

export const LogRow = (props: Props) => {
  const { row } = props;

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {row.module}
      </TableCell>
      <TableCell>
        <FieldTemplate value={row.status} type={TemplateType.Status} />
      </TableCell>
      <TableCell align="right">{formatElapsedTime(row.elapsed)}</TableCell>
    </TableRow>
  );
};
