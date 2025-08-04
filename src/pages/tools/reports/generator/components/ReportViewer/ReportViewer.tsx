import {
  Autocomplete,
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppRoutes from 'hooks/useAppRoutes';
import orderBy from 'lodash/orderBy';
import {
  BorderedTable,
  FieldTemplate,
  GenericLoadingPanel,
  MainCard,
  SearchControl,
  StyledTableCell,
} from 'components';
import appConfig from 'config/app.config';
import useApiService from 'hooks/useApiService';
import { RootState } from 'store';
import { decodeReport, getViewerKey } from '../../utils';
import { TemplateType } from 'models';
import type { Definition } from 'types/tools';
import { bytesToKilobytes } from '_helpers';
import baseConfig from 'baseConfig';

type Props = {
  id: any;
};

export const ReportViewer = (props: Props) => {
  const apiService = useApiService();
  const navigate = useNavigate();

  const [version, setVersion] = useState<Definition | null>(null);
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState('output');

  const { baseRoutes } = useAppRoutes();
  const reportInfo = useSelector((x: RootState) => x.data.reports);
  const key = getViewerKey(props.id, reportInfo);

  const url = version
    ? `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}/info?options=${key}|V:${version.key}&target=${target}`
    : `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}/info?options=${key}&target=${target}`;
  const { data, isLoading } = useQuery({
    queryKey: [`report_info_${props.id}_${target}_${version?.key}`],
    queryFn: () => apiService.fetch(url),
    refetchOnMount: true,
    refetchInterval: 9000,
  });

  const iCReport = props.id.startsWith('C');

  const urlVersion = `${appConfig.gdsReportEndpoint}/config?key=${decodeReport(props.id)}`;
  const { data: dataVersion, isLoading: isLoadingVersion } = useQuery({
    queryKey: [`report_version_${props.id}`, props.id],
    queryFn: () => apiService.fetch(urlVersion),
  });

  const onClickView = async (id: string, name: string, reportKey: string) => {
    if (iCReport) {
      const fileName = reportKey?.split('/').pop();
      const url = `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}/retrieve?key=${encodeURIComponent(reportKey)}`;
      await apiService.downloadReportXML(url, fileName ?? 'report.xml');
    } else {
      const encodedParam = encodeURIComponent(id);
      navigate(
        baseRoutes.ReportViewer.replace(':name', name)
          .replace(':id', encodedParam)
          .replace(':report', decodeReport(props.id))
          .replace(':key', decodeReport(reportKey))
      );
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'output') {
      setVersion(null);
    } else {
      setVersion(dataVersion?.versions[0]);
    }

    setTarget(event.target.value);
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
      title={`Generated Reports (${data?.length ?? 0})`}
      headerSX={{ paddingBottom: '0!important' }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Select
              id="report target"
              value={target}
              label="Target"
              size="small"
              onChange={handleChange}
            >
              <MenuItem value="output">Output</MenuItem>
              <MenuItem value="delivery">Delivery</MenuItem>
            </Select>
            <Autocomplete
              id="combo-box-versions"
              size="small"
              disabled={target === 'output'}
              loading={isLoadingVersion}
              options={
                isLoadingVersion
                  ? []
                  : dataVersion?.versions.filter((x: any) => x.title.startsWith('V'))
              }
              getOptionLabel={(option: any) => option.title}
              getOptionKey={(option: any) => option.key}
              sx={{ width: 140 }}
              value={version}
              onChange={(_event: any, newValue: Definition | null) => setVersion(newValue)}
              renderInput={(params) => <TextField {...params} label="Version" />}
            />
            <Typography>{`${data?.length ?? 0} reports / ${data?.filter((x: any) => x.withError)?.length ?? 0} errors`}</Typography>
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
                  <StyledTableCell sx={{ py: 1 }}>file Name</StyledTableCell>
                  <StyledTableCell sx={{ py: 1, width: '5%' }}>Version</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>Valid</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>Date</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>Size</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBy(filterData, (x) => x.name)?.map((e: any) => (
                  <TableRow
                    key={e.name}
                    onDoubleClick={async () => await onClickView(e.path, e.name, e.key)}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ p: 0 }}
                        color="primary"
                        onClick={async () => await onClickView(e.path, e.name, e.key)}
                      >
                        {iCReport ? <FileDownloadOutlinedIcon /> : <VisibilityOutlinedIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell scope="row">{e.name}</TableCell>
                    <TableCell>{`v${e.version}`}</TableCell>
                    <TableCell>
                      <FieldTemplate
                        value={!e.withError}
                        type={TemplateType.Boolean}
                        withText={true}
                      />
                    </TableCell>
                    <TableCell>
                      {dayjs(e.date).format(baseConfig.dateTimeDateFormat).toUpperCase()}
                    </TableCell>
                    <TableCell>{bytesToKilobytes(e.size)}</TableCell>
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
