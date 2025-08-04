import { Autocomplete, Box, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { MainCard } from 'components/cards/MainCard';
import type { Definition } from 'types/tools';
import { useState } from 'react';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { useQuery } from '@tanstack/react-query';
import { H2HUnitsSelector } from '../H2HUnitsSelector';

type Props = {
  data: any;
};

export const H2HGenerator = (props: Readonly<Props>) => {
  const [discipline, setDiscipline] = useState<Definition | null>(null);

  const apiService = useApiService();

  const url = `${appConfig.gdsReportEndpoint}/config?key=${props.data.next.key}`;
  const { data, isLoading } = useQuery({
    queryKey: [`report_config_${props.data.next.key}`],
    queryFn: () => apiService.fetch(url),
  });

  return (
    <MainCard
      boxShadow={true}
      border={true}
      size="small"
      title="Live Head-To-Head"
      subtitle="Live Report"
      divider={true}
      content={true}
    >
      <Grid container spacing={1}>
        <Grid size={12}>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              id="h2h-box-disciplines"
              size="small"
              fullWidth
              loading={isLoading}
              options={isLoading ? [] : data?.options}
              getOptionLabel={(option: any) => option.title}
              getOptionKey={(option: any) => option.key}
              value={discipline}
              onChange={(_event: any, newValue: Definition | null) => setDiscipline(newValue)}
              renderInput={(params) => <TextField {...params} label="Discipline" />}
            />
            <Box sx={{ flexGrow: 1 }} />
          </Stack>
        </Grid>
        <Grid size={12}>{discipline && <H2HUnitsSelector discipline={discipline} />}</Grid>
      </Grid>
    </MainCard>
  );
};
