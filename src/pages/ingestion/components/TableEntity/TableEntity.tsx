import { TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { t } from 'i18next';
import appConfig from 'config/app.config';
import { useQuery } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import { BorderedTable, StyledTableCell } from 'components';
import { TableEntityRow } from '../TableEntityRow';
import { humanize } from '_helpers';

type Props = { data: Array<any>; layer: string; id: string };

export const TableEntity = (props: Props) => {
  const url = `${appConfig.apiEndPoint}${appConfig.TRACKING_SYSTEM_ENTITY}/${props.id}/${props.layer}`;
  const apiService = useApiService();

  const { data, isLoading } = useQuery({
    queryKey: [`${props.id}_entities`],
    queryFn: () => apiService.fetch(url),
  });

  return (
    <TableContainer sx={{ mt: 1 }}>
      <BorderedTable stickyHeader size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: 10 }} />
            <StyledTableCell>{humanize(props.layer)}</StyledTableCell>
            <StyledTableCell>{t('common.total')}</StyledTableCell>
            <StyledTableCell>{t('common.actions')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((e: any, i: number) => (
            <TableEntityRow key={i} row={e} id={props.id} isLoading={isLoading} data={data ?? []} />
          ))}
        </TableBody>
      </BorderedTable>
    </TableContainer>
  );
};
