import { useState } from 'react';
import { DisplayEntry } from 'models';
import type { StructureView } from 'types/ingestion';
import useApiService from 'hooks/useApiService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import appConfig from 'config/app.config';
import Grid from '@mui/material/Grid';
import { ButtonTabPrimary, GenericLoadingPanel } from 'components';
import { StructureToolbar } from '../StructureToolbar';
import { RulesViewer } from '../RulesViewer';
import { HeadersViewer } from '../HeadersViewer';
import { StructureViewer } from '../StructureViewer';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { t } from 'i18next';

type Props = {
  editions: string[];
};

type DetailsProps = {
  viewMode: StructureView;
  discipline: DisplayEntry | null;
  dataRules: any;
  dataHeaders: any;
  dataRaw: any;
  data: any;
  edition: string;
};

export const CompetitionStructureContent = (props: Props) => {
  const [discipline, setDiscipline] = useState<DisplayEntry | null>(null);
  const [edition, setEdition] = useState<string>(props.editions?.[0] ?? 'OWG2026');
  const [value, setValue] = useState('output');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const apiService = useApiService();
  const queryClient = useQueryClient();

  const urlStructure = `${appConfig.toolsEndPoint}/odf/structure?competitionCode=${edition}`;
  const urlStructureRaw = `${appConfig.toolsEndPoint}/odf/structure/raw?competitionCode=${edition}`;
  const urlStructureRules = `${appConfig.toolsEndPoint}/odf/structure/rules?competitionCode=${edition}`;
  const urlStructureHeaders = `${appConfig.toolsEndPoint}/odf/structure/headers?competitionCode=${edition}`;

  const { data: dataRaw, isLoading: isLoadingRaw } = useQuery({
    queryKey: [appConfig.toolsEndPoint, edition, 'raw'],
    queryFn: () => apiService.fetch(urlStructureRaw),
  });

  const { data, isLoading } = useQuery({
    queryKey: [appConfig.toolsEndPoint, edition, 'structure'],
    queryFn: () => apiService.fetch(urlStructure),
  });

  const { data: dataRules, isLoading: isLoadingRules } = useQuery({
    queryKey: [appConfig.toolsEndPoint, edition, 'rules'],
    queryFn: () => apiService.fetch(urlStructureRules),
  });

  const { data: dataHeaders, isLoading: isLoadingHeader } = useQuery({
    queryKey: [appConfig.toolsEndPoint, edition, 'headers'],
    queryFn: () => apiService.fetch(urlStructureHeaders),
  });
  return (
    <Grid container spacing={2} size={12}>
      <Grid size={12}>
        <StructureToolbar
          edition={edition}
          editions={props.editions}
          onChangeEdition={(e: string) => {
            setEdition(e);
            setDiscipline(null);
            setValue('output');
            queryClient.invalidateQueries({ queryKey: [appConfig.toolsEndPoint] });
          }}
          isLoading={isLoading || isLoadingRaw || isLoadingRules || isLoadingHeader}
          data={dataRaw}
          discipline={discipline}
          onChangeDiscipline={setDiscipline}
        />
      </Grid>
      <Grid size={12}>
        <GenericLoadingPanel
          loading={isLoading || isLoadingRaw || isLoadingRules || isLoadingHeader}
        />
        <TabContext value={value}>
          <TabList
            variant="fullWidth"
            onChange={handleChange}
            aria-label={t('messages.competition-structure-tabs')}
            sx={{ '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
          >
            {['output', 'rules', 'headers', 'raw'].map((view) => (
              <ButtonTabPrimary key={view} value={view} label={view.toUpperCase()} />
            ))}
          </TabList>
          {['output', 'rules', 'headers', 'raw'].map((view) => (
            <TabPanel key={view} value={view} sx={{ px: 0, py: 1 }}>
              {discipline && (
                <BuildDetails
                  viewMode={view as StructureView}
                  discipline={discipline}
                  dataRules={dataRules}
                  dataHeaders={dataHeaders}
                  dataRaw={dataRaw}
                  data={data}
                  edition={edition}
                />
              )}
            </TabPanel>
          ))}
        </TabContext>
      </Grid>
    </Grid>
  );
};

const BuildDetails = ({
  viewMode,
  discipline,
  dataRules,
  dataHeaders,
  dataRaw,
  data,
  edition,
}: DetailsProps) => {
  if (viewMode === 'rules')
    return <RulesViewer rules={dataRules} data={data} value={discipline} edition={edition} />;

  if (viewMode === 'headers')
    return <HeadersViewer headers={dataHeaders} data={dataRaw} value={discipline} />;

  return (
    <StructureViewer
      data={viewMode === 'output' ? data : dataRaw}
      rules={dataRules}
      value={discipline}
    />
  );
};
