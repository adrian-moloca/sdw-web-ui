import { useQuery } from '@tanstack/react-query';
import { Autocomplete, TextField } from '@mui/material';
import { t } from 'i18next';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import type { Props } from '../types';

export const ToolbarEventTypeFilter = (props: Props) => {
  const apiService = useApiService();
  const url = `${appConfig.reportEndPoint}/qualifiers/eventTypes`;

  const { data, error, isLoading } = useQuery({
    queryKey: ['qualifiers_eventTypes'],
    queryFn: () => apiService.fetch(url),
  });

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.stopPropagation();
    props.onChange(newValue);
  };

  const controlData = isLoading || error ? { data: [] } : { data };
  const validKeyField = 'code';
  const validTextField = 'title';

  return (
    <Autocomplete
      value={props.value}
      onChange={handleChange}
      loading={isLoading}
      size="small"
      sx={{ width: 200 }}
      multiple
      disableCloseOnSelect
      limitTags={0}
      options={controlData.data}
      isOptionEqualToValue={(option, value) => option[validKeyField] === value[validKeyField]}
      getOptionLabel={(option) => option[validTextField] ?? ''}
      getOptionKey={(option) => option[validKeyField] ?? ''}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          placeholder={`${t('general.events')} filter`}
        />
      )}
    />
  );
};
