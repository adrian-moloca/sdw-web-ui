import {
  Box,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useMemo, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  BorderedTable,
  GenericLoadingPanel,
  MainCard,
  SearchControl,
  StyledTableCell,
} from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { RootState } from 'store';
import { decodeReport, getSelectorKey } from '../../utils';
import { bytesToKilobytes } from '_helpers';

type Props = {
  id: any;
};

export const ReportMetadataViewer = (props: Props) => {
  const apiService = useApiService();
  const [search, setSearch] = useState('');

  const reportInfo = useSelector((x: RootState) => x.data.reports);
  const key = getSelectorKey(props.id, reportInfo);
  const url = `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}/info?options=${key}&target=input`;

  const { data, isLoading } = useQuery({
    queryKey: [`report_info_${props.id}_input`],
    queryFn: () => apiService.fetch(url),
    refetchOnMount: true,
    refetchInterval: 60 * 1000,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClickView = async (id: string, name: string, _key: string) => {
    const url = `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}/retrieve?key=${encodeURIComponent(id ?? '')}`;
    await apiService.downloadReportJson(url, name ?? 'report.json', true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClickDownload = async (id: string, name: string, _key: string) => {
    const url = `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}/retrieve?key=${encodeURIComponent(id ?? '')}`;
    await apiService.downloadReportJson(url, name ?? 'report.json', false);
  };

  const filterData = useMemo(() => {
    return search.length > 0
      ? data?.filter(
          (x: any) =>
            x.name?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            x.path?.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      : data;
  }, [data, search, isLoading]);

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return (
    <MainCard
      size="small"
      divider={false}
      border={false}
      title={`Reports Metadata (${data?.length ?? 0})`}
      headerSX={{ paddingBottom: '0!important' }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography>{`${data?.length ?? 0} files`}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <SearchControl onChange={(e: any) => setSearch(e.target.value)} />
          </Stack>
        </Grid>
        <Grid size={12}>
          <TableContainer component={Box}>
            <BorderedTable stickyHeader size="small" sx={{ minWidth: 300 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: '2%' }} />
                  <StyledTableCell sx={{ py: 1 }}>File Name</StyledTableCell>
                  <StyledTableCell sx={{ width: '20%', py: 1 }}>Size</StyledTableCell>
                  <StyledTableCell sx={{ width: '2%' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBy(filterData, (x) => x.name)?.map((e: any) => (
                  <TableRow key={e.name} onDoubleClick={() => onClickView(e.path, e.name, e.key)}>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ p: 0 }}
                        color="primary"
                        onClick={() => onClickView(e.path, e.name, e.key)}
                      >
                        <SearchOutlinedIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell scope="row">{e.name}</TableCell>
                    <TableCell>{bytesToKilobytes(e.size)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ p: 0 }}
                        onClick={() => onClickDownload(e.path, e.name, e.key)}
                      >
                        <FileDownloadOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </BorderedTable>
          </TableContainer>
        </Grid>
      </Grid>
    </MainCard>
  );
};
