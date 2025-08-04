import { TableBody, TableHead, TableRow } from '@mui/material';
import { BorderedTable, HeaderTableCell } from 'components';
import { t } from 'i18next';
import type { RuleProps } from 'types/ingestion';
import { MovePhasesRow } from '../MovePhasesRow';

export const MovePhasesTable = (props: RuleProps) => {
  return (
    <BorderedTable stickyHeader size="small">
      <TableHead>
        <TableRow>
          <HeaderTableCell sx={{ width: 300 }}>{t('common.code')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 300 }}>{t('common.name')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 120 }}>{t('common.type')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 120 }}>{t('common.level')}</HeaderTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data.map((x: any) => (
          <MovePhasesRow {...props} key={x.code} data={x} />
        ))}
      </TableBody>
    </BorderedTable>
  );
};
