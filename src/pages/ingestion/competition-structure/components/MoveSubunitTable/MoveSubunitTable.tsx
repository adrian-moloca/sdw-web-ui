import { TableBody, TableHead, TableRow } from '@mui/material';
import { BorderedTable, HeaderTableCell } from 'components';
import { t } from 'i18next';
import type { RuleProps } from 'types/ingestion';
import { MoveSubunitRow } from '../MoveSubunitRow';

export const MoveSubunitTable = (props: RuleProps) => {
  return (
    <BorderedTable stickyHeader size="small">
      <TableHead>
        <TableRow>
          <HeaderTableCell sx={{ width: 40 }}>{t('general.order')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 300 }}>{t('common.code')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 300 }}>{t('common.name')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 300 }}>{'Schedule from'}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 300 }}>{'Propagate To'}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 120 }}>{t('common.type')}</HeaderTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data.map((x: any) => (
          <MoveSubunitRow {...props} key={x.code} data={x} />
        ))}
      </TableBody>
    </BorderedTable>
  );
};
