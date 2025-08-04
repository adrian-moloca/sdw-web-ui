import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { t } from 'i18next';
import orderBy from 'lodash/orderBy';
import { BorderedTable, EnumTemplate, StyledTableCell } from 'components';
import { EnumType } from 'models';
import baseConfig from 'baseConfig';

type Props = { data: any };

export const ReportExecutionTable = (props: Props) => {
  const executions = orderBy(props.data?.executions, 'date', 'desc');

  return (
    <TableContainer component={Box}>
      <BorderedTable size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: 5 }} />
            <StyledTableCell sx={{ width: 120 }}>{t('general.execution-request')}</StyledTableCell>
            <StyledTableCell sx={{ width: 100 }}>{t('common.status')}</StyledTableCell>
            <StyledTableCell sx={{ width: 100 }}>{t('common.mode')}</StyledTableCell>
            <StyledTableCell sx={{ width: 100 }}>{t('general.numRecords')}</StyledTableCell>
            <StyledTableCell sx={{ width: 10 }}>{t('common.size')}</StyledTableCell>
            <StyledTableCell sx={{ width: 100 }}>{t('common.file')}</StyledTableCell>
            <StyledTableCell sx={{ width: 120 }}>{t('common.startDate')}</StyledTableCell>
            <StyledTableCell sx={{ width: 120 }}>{t('common.endDate')}</StyledTableCell>
            <StyledTableCell sx={{ width: 160 }}>{t('common.generatedBy')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {executions.map((x: any, i: number) => (
            <TableRow key={x.id}>
              <TableCell> {i + 1} </TableCell>
              <TableCell>
                {dayjs(x.date).format(baseConfig.dateTimeDateFormat).toUpperCase()}
              </TableCell>
              <TableCell>
                <EnumTemplate
                  type={EnumType.ExecutionStatus}
                  value={x.executionStatus}
                  withText={true}
                />
              </TableCell>
              <TableCell>
                <EnumTemplate type={EnumType.RunMode} value={x.mode} withText={true} />
              </TableCell>
              <TableCell>{x.noRecords.toLocaleString()}</TableCell>
              <TableCell>{x.size ?? '2KB'}</TableCell>
              <TableCell>{x.fileNames.join('; ')}</TableCell>
              <TableCell>
                {dayjs(x.startTime).format(baseConfig.dateTimeDateFormat).toUpperCase()}
              </TableCell>
              <TableCell>
                {dayjs(x.finishDate).format(baseConfig.dateTimeDateFormat).toUpperCase()}
              </TableCell>
              <TableCell>{x.updatedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </BorderedTable>
    </TableContainer>
  );
};
