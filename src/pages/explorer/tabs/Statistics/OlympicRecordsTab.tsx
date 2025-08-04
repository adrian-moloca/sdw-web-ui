import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useQuery } from '@tanstack/react-query';
import { RadioTab } from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { useAtom } from 'jotai';
import { atomWithHash } from 'jotai-location';
import { EntityType } from 'models';
import { OlympicRecordsViewer } from './OlympicRecordsViewer';

const targetAtom = atomWithHash('disciplineCode', 'SDIS$ATH');
export const OlympicRecordsTab: React.FC = () => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Discipline);
  const [value, setValue] = useAtom(targetAtom);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const url = `${config.apiNode}/with-records`;
  const { data, isLoading } = useQuery({
    queryKey: ['with-records', config.apiNode],
    queryFn: () => apiService.fetch(url),
  });

  const dataContent = isLoading ? [] : (data?.filter((x: any) => x.title !== x.code) ?? []);
  return (
    <TabContext value={value}>
      <TabList
        onChange={handleChange}
        sx={{ mt: 1, '.MuiTabs-indicator': { backgroundColor: 'transparent' } }}
        variant="scrollable"
        indicatorColor={'secondary'}
      >
        {dataContent.map((e: any) => (
          <RadioTab key={e.code} value={e.code} label={e.title} disableRipple />
        ))}
      </TabList>
      {dataContent.map((e: any) => (
        <TabPanel key={e.code} value={e.code} sx={{ px: 0 }}>
          <OlympicRecordsViewer discipline={e.code} />
        </TabPanel>
      ))}
    </TabContext>
  );
};
