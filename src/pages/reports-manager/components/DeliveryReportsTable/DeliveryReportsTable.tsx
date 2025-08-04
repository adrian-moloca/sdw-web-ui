import { useNavigate } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { t } from 'i18next';
import dayjs from 'dayjs';
import useAppRoutes from 'hooks/useAppRoutes';
import { BorderedTable, StyledTableCell } from 'components';
import { EntityType } from 'models';
import { ReportStatusControl } from '../ReportStatusControl';
import baseConfig from 'baseConfig';

type Props = { data: any };

export const DeliveryReportsTable = (props: Props) => {
  const navigate = useNavigate();
  const { getDetailRoute } = useAppRoutes();
  const deliverables = orderBy(props.data?.deliverables, 'id', 'desc');
  const invalidateQueries = [`${props.data.id}_view`];

  return (
    <TableContainer component={Box}>
      <BorderedTable size="small" stickyHeader>
        <caption>
          {t(
            'messages.less-than-u-greater-than-note-less-than-u-greater-than-the-status-columns-are-editable-in-this-table-so-the-manager-can-track-the-report-status-one-by-one'
          )}
        </caption>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: 5 }} />
            <StyledTableCell sx={{ width: 15 }}>{t('common.code')}</StyledTableCell>
            <StyledTableCell sx={{ width: 360 }}>{t('general.report')}</StyledTableCell>
            <StyledTableCell sx={{ width: 100 }}>{t('common.deliveryStatus')}</StyledTableCell>
            <StyledTableCell sx={{ width: 100 }}>{t('common.status')}</StyledTableCell>
            <StyledTableCell sx={{ width: 100 }}>{t('common.dataStatus')}</StyledTableCell>
            <StyledTableCell sx={{ width: 10 }}>{t('common.version')}</StyledTableCell>
            <StyledTableCell sx={{ width: 10 }}>{t('common.size')}</StyledTableCell>
            <StyledTableCell sx={{ width: 120 }}>{t('common.lastGeneration')}</StyledTableCell>
            <StyledTableCell sx={{ width: 160 }}>{t('common.generatedBy')}</StyledTableCell>
            <StyledTableCell sx={{ width: 160 }}>{t('common.managedBy')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliverables.map((x: any, i: number) => (
            <TableRow
              key={x.id}
              onDoubleClick={() => navigate(getDetailRoute(EntityType.Report, x.report.id))}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell> {i + 1} </TableCell>
              <TableCell component="th" scope="row">
                {x.report.variation.code}
              </TableCell>
              <TableCell>{x.report.displayName}</TableCell>
              <TableCell>
                <ReportStatusControl
                  type={EntityType.ReportDelivery}
                  dataItem={x}
                  displayMode="table"
                  mode="report"
                  invalidateQueries={invalidateQueries}
                />
              </TableCell>
              <TableCell>
                <ReportStatusControl
                  key={2}
                  type={EntityType.Report}
                  dataItem={x.report}
                  displayMode="table"
                  mode="report"
                  invalidateQueries={invalidateQueries}
                />
              </TableCell>
              <TableCell>
                <ReportStatusControl
                  key={2}
                  type={EntityType.Report}
                  dataItem={x.report}
                  displayMode="table"
                  mode="data"
                  invalidateQueries={invalidateQueries}
                />
              </TableCell>
              <TableCell>{`v${x.version}`}</TableCell>
              <TableCell>{x.size ?? '2KB'}</TableCell>
              <TableCell>
                {x.report.generatedOn
                  ? dayjs(x.report.generatedOn).format(baseConfig.dateTimeDateFormat).toUpperCase()
                  : ''}
              </TableCell>
              <TableCell>{x.report.generatedBy}</TableCell>
              <TableCell>{x.updatedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </BorderedTable>
    </TableContainer>
  );
};
