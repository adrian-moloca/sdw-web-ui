import { TableHead, TableRow } from '@mui/material';
import { HeaderTableCell } from 'components';
import { t } from 'i18next';

export const ScheduleHeaderCell = () => {
  return (
    <TableHead>
      <TableRow>
        <HeaderTableCell sx={{ width: 20 }} />
        <HeaderTableCell sx={{ width: 40 }}>{t('general.order')}</HeaderTableCell>
        <HeaderTableCell sx={{ width: 360 }}>{t('common.code')}</HeaderTableCell>
        <HeaderTableCell sx={{ width: 300 }}>{t('common.name')}</HeaderTableCell>
        <HeaderTableCell sx={{ width: 120 }}>{t('common.type')}</HeaderTableCell>
        <HeaderTableCell sx={{ width: 80 }}>{t('general.medal')}</HeaderTableCell>
        <HeaderTableCell sx={{ width: 80 }}>{t('general.schedule')}</HeaderTableCell>
        <HeaderTableCell sx={{ width: 80 }}>{t('common.messages')}</HeaderTableCell>
        <HeaderTableCell sx={{ width: 20 }} />
      </TableRow>
    </TableHead>
  );
};
