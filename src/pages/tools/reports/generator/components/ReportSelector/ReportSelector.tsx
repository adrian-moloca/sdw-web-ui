import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
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
import { skipReportCodes, decodeReport, getSelectorKey } from '../../utils';
import { Logger, isDevelopment } from '_helpers';
import type { Definition } from 'types/tools';

type Props = {
  id: any;
};

export const ReportSelector = (props: Props) => {
  const apiService = useApiService();

  const [version, setVersion] = useState<Definition | null>(null);
  const [search, setSearch] = useState('');

  const reportInfo = useSelector((x: RootState) => x.data.reports);
  const queryClient = useQueryClient();
  const key = getSelectorKey(props.id, reportInfo);
  const url = `${appConfig.gdsReportEndpoint}/config?key=${key}`;

  const { data, isLoading } = useQuery({
    queryKey: [`report_config_${props.id}`, props.id],
    queryFn: () => apiService.fetch(url),
    refetchOnMount: true,
  });

  const urlVersion = `${appConfig.gdsReportEndpoint}/config?key=${decodeReport(props.id)}`;
  const { data: dataVersion, isLoading: isLoadingVersion } = useQuery({
    queryKey: [`report_version_${props.id}`, props.id],
    queryFn: () => apiService.fetch(urlVersion),
  });

  const urlGenerate = `${appConfig.gdsReportEndpoint}/${decodeReport(props.id)}`;
  const mutationGenerate = useMutation({
    mutationFn: (id: string) =>
      apiService.post(
        urlGenerate,
        version ? { options: [id], version: version.key } : { options: [id] }
      ),
    onSuccess: () => {
      setVersion(null);
      queryClient.invalidateQueries({
        queryKey: [`report_config_${props.id}`],
      });
      queryClient.invalidateQueries({ queryKey: [`report_version_${props.id}`] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          typeof query.queryKey[0] === 'string' &&
          query.queryKey[0].startsWith(`report_info_${props.id}`),
      });
    },
    onError: (error: any) => {
      if (isDevelopment) Logger.error(error);
      return error;
    },
  });

  const onClickRun = (key: string) => {
    mutationGenerate.mutate(key);
  };

  const filterData = useMemo(() => {
    return search.length > 0
      ? data?.options?.filter(
          (x: any) =>
            x.title?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            x.key?.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
      : data?.options;
  }, [data, search, isLoading]);

  if (isLoading) {
    return <GenericLoadingPanel loading={isLoading} />;
  }

  return (
    <MainCard
      size="small"
      divider={false}
      border={false}
      title={
        skipReportCodes(props.id) ? undefined : `Available Reports (${data?.options?.length ?? 0})`
      }
      headerSX={{ paddingBottom: '0!important' }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              id="combo-box-versions"
              size="small"
              loading={isLoadingVersion}
              options={isLoadingVersion ? [] : dataVersion?.versions}
              getOptionLabel={(option: any) => option.title}
              getOptionKey={(option: any) => option.key}
              sx={{ width: 180 }}
              value={version}
              onChange={(_event: any, newValue: Definition | null) => setVersion(newValue)}
              renderInput={(params) => <TextField {...params} label="Version" />}
            />
            <Button
              variant="outlined"
              aria-label="download row"
              startIcon={<DirectionsRunOutlinedIcon />}
              disabled={mutationGenerate.isPending}
              loading={mutationGenerate.isPending}
              loadingPosition="start"
              onClick={() => mutationGenerate.mutate(props.id)}
            >
              {t('actions.buttonGenerate')}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <SearchControl onChange={(e: any) => setSearch(e.target.value)} />
          </Stack>
          <GenericLoadingPanel loading={mutationGenerate.isPending} />
        </Grid>
        {!skipReportCodes(props.id) && (
          <Grid size={12}>
            <TableContainer component={Box}>
              <BorderedTable stickyHeader size="small" sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: '2%' }} />
                    <StyledTableCell sx={{ py: 1 }}>Report Code</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterData?.map((e: any) => (
                    <TableRow key={e.key ?? e.name}>
                      <TableCell>
                        <IconButton
                          size="small"
                          disabled={mutationGenerate.isPending}
                          sx={{ p: 0, color: 'text.primary' }}
                          onClick={() => onClickRun(e.key)}
                        >
                          <DirectionsRunOutlinedIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell scope="row">{e.title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </BorderedTable>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
};
