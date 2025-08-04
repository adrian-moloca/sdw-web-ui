import { TableBody, TableHead, TableRow } from '@mui/material';
import { BorderedTable, HeaderTableCell } from 'components';
import { t } from 'i18next';
import { humanize } from '_helpers';
import type { RuleProps } from 'types/ingestion';
import { MessageRedirectRow } from '../MessageRedirectRow';

export const MessageRedirectTable = (props: RuleProps) => {
  return (
    <BorderedTable stickyHeader size="small">
      <TableHead>
        <TableRow>
          <HeaderTableCell sx={{ width: 300 }}>{t('common.code')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 300 }}>{'To Code'}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 120 }}>{t('common.type')}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 300 }}>{humanize(props.data.level)}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 120 }}>{'To Level'}</HeaderTableCell>
          <HeaderTableCell sx={{ width: 80 }}>{t('common.kind')}</HeaderTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data.map((x: any) => (
          <MessageRedirectRow {...props} key={x.code} data={x} />
        ))}
      </TableBody>
    </BorderedTable>
  );
};
