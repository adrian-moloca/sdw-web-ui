import { useNavigate } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import useAppRoutes from 'hooks/useAppRoutes';
import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BorderedTable, EnumTemplate, StyledTableCell, TableCellProgress } from 'components';
import { t } from 'i18next';
import { EntityType, EnumType } from 'models';
import dayjs from 'dayjs';

type Props = {
  data: any;
};

export const ReportDeliveriesTable = (props: Props) => {
  const navigate = useNavigate();
  const { getDetailRoute } = useAppRoutes();
  const deliverables = orderBy(props.data?.deliverables, 'ts', 'desc');

  return (
    <TableContainer component={Box}>
      <BorderedTable stickyHeader size="small" sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: 10 }} />
            <StyledTableCell>{t('general.deliveryPlan')}</StyledTableCell>
            <StyledTableCell>{t('common.type')}</StyledTableCell>
            <StyledTableCell>{t('common.scheduleDate')}</StyledTableCell>
            <StyledTableCell sx={{ width: 200 }}>{'common.readiness'}</StyledTableCell>
            <StyledTableCell>{t('common.days')}</StyledTableCell>
            <StyledTableCell>{t('common.w-days')}</StyledTableCell>
            <StyledTableCell>{t('common.deliveryDate')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deliverables.map((x: any, index: number) => (
            <TableRow
              key={x.id}
              onDoubleClick={() =>
                navigate(getDetailRoute(EntityType.DeliveryPlan, x.deliveryPlan.id))
              }
              sx={{ cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>
                <EnumTemplate
                  type={EnumType.DeliveryType}
                  value={x.deliveryPlan.type}
                  withText={true}
                />
              </TableCell>
              <TableCell>
                <EnumTemplate
                  type={EnumType.DeliveryStatus}
                  value={x.deliveryPlan.status}
                  withText={true}
                />
              </TableCell>
              <TableCell>{dayjs(x.deliveryPlan.scheduleDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell>{<TableCellProgress value={x.deliveryPlan.rate} />}</TableCell>
              <TableCell>{x.deliveryPlan.daysRemaining}</TableCell>
              <TableCell>{x.deliveryPlan.workingDaysRemaining}</TableCell>
              <TableCell>
                {x.deliveryPlan.deliveryDate
                  ? dayjs(x.deliveryPlan.deliveryDate).format('DD/MM/YYYY HH:mm')
                  : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </BorderedTable>
    </TableContainer>
  );
};
