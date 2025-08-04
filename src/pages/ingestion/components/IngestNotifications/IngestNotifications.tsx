import { Alert, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { t } from 'i18next';
import { BorderedTable, MainCard, StyledTableCell } from 'components';
import { NotificationRow } from '../NotificationRow';

type Props = {
  data?: Array<any>;
};

export const IngestNotifications = (props: Props) => {
  if (!props.data || props.data.length === 0)
    return (
      <MainCard>
        <Alert severity="warning">{t('message.no-notifications-available')}</Alert>
      </MainCard>
    );
  return (
    <MainCard>
      <TableContainer>
        <BorderedTable stickyHeader sx={{ minWidth: 300 }} size={'small'}>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 10 }} />
              <StyledTableCell>{t('common.type')}</StyledTableCell>
              <StyledTableCell>{t('common.createdOn')}</StyledTableCell>
              <StyledTableCell>{t('common.module')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data?.map((e: any) => (
              <NotificationRow key={e.id} row={e} />
            ))}
          </TableBody>
        </BorderedTable>
      </TableContainer>
    </MainCard>
  );
};
