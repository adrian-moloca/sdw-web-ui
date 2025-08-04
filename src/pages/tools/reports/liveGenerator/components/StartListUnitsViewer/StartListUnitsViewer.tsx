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
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useQuery } from '@tanstack/react-query';
import orderBy from 'lodash/orderBy';
import dayjs from 'dayjs';
import type { Definition } from 'types/tools';
import { useMemo, useState } from 'react';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import {
  BorderedTable,
  FieldTemplate,
  GenericLoadingPanel,
  MainCard,
  SearchControl,
  StyledTableCell,
} from 'components';
import { bytesToKilobytes } from '_helpers';
import { TemplateType } from 'models';
import baseConfig from 'baseConfig';

type Props = {
  discipline: any;
  allUnits: Array<any>;
  unit?: any;
};

export const StartListUnitsViewer = (props: Props) => {
  const apiService = useApiService();
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState('output');
  const [version, setVersion] = useState<Definition | null>(null);

  const url = `${appConfig.gdsReportEndpoint}/ESL/info?options=${props.discipline.next.key.replace('|S', '')}&target=${target}`;
  const { data, isLoading } = useQuery({
    queryKey: [`report_info_${props.discipline.next.key}_${target}`],
    queryFn: () => apiService.fetch(url),
  });

  const filterData = useMemo(() => {
    return search.length > 0
      ? data?.filter(
          (x: any) =>
            x.name?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            x.path?.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      : data;
  }, [data, search, isLoading]);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'output') {
      setVersion(null);
    }
    //else setVersion(dataVersion?.versions[0]);
    setTarget(event.target.value);
  };

  // eslint-disable-next-line
  const onClickView = async (id: string, name: string, _reportKey: string) => {
    const url = `${appConfig.gdsReportEndpoint}/ESL/retrieve?key=${encodeURIComponent(id)}`;
    await apiService.downloadReportExcel(url, name);
  };

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return (
    <MainCard
      size="small"
      divider={false}
      border={false}
      title={`Available Reports (${data?.length ?? 0})`}
      // headerSX={{ padding: '0!important' }}
      content={false}
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
              loading={isLoading}
              options={isLoading ? [] : data?.versions?.filter((x: any) => x.title.startsWith('V'))}
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
                  <StyledTableCell sx={{ py: 1 }}>Unit</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>File Name</StyledTableCell>
                  <StyledTableCell sx={{ py: 1, width: '5%' }}>Version</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>Valid</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>Date</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>Size</StyledTableCell>
                  <StyledTableCell sx={{ py: 1 }}>RSC Code</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBy(filterData, (x) => x.name)?.map((e: any) => {
                  const currentUnit = props.allUnits.find((u: any) => e.name.startsWith(u.code));
                  return currentUnit ? (
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
                          <FileDownloadOutlinedIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>{`${currentUnit.title} (${currentUnit.code.slice(-5).replace('--', '')})`}</TableCell>
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
                      <TableCell>{currentUnit.code}</TableCell>
                    </TableRow>
                  ) : null;
                })}
              </TableBody>
            </BorderedTable>
          </TableContainer>
        </Grid>
      </Grid>
    </MainCard>
  );
};
