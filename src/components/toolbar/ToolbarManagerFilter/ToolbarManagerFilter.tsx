import { Autocomplete, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import get from 'lodash/get';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { EntityType, ManagerDataCategory, ManagerDataDisplay, MasterData } from 'models';
import { apiConfig } from 'config/app.config';
import type { FilterProps } from '../types';
import { ToolbarMasterFilter } from '../ToolbarMasterFilter';
import { layout } from 'themes/layout';
import { colors } from 'themes/colors';

export const ToolbarManagerFilter = (props: FilterProps) => {
  const theme = useTheme();

  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const apiService = useApiService();
  const { getDataSourceSetup } = useModelConfig();

  const category = props.category as ManagerDataCategory;
  if (category === EntityType.Discipline) {
    const { data, error, isLoading } = useQuery({
      queryKey: ['managers_setup'],
      queryFn: () => apiService.fetch(`${apiConfig.reportManagerEndPoint}/setup`),
    });

    const filterData = isLoading || error ? { data: [] } : { data: data.defaultDisciplines };
    return (
      <ToolbarMasterFilter
        {...props}
        filters={filterData.data}
        isLoading={isLoading}
        category={MasterData.Discipline}
        limitTags={1}
      />
    );
  }
  const url = props.dataSource ? props.dataSource.url : getDataSourceSetup(category).url;

  const { data, error, isLoading } = useQuery({
    queryKey: [`setup_${category}`],
    queryFn: () => apiService.fetch(url),
  });

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.stopPropagation();
    props.onChange(newValue);
  };
  const controlData = isLoading || error ? { data: [] } : { data };
  const validKeyField = 'id';
  const validCodeField = 'code';
  const validTextField = 'title';
  const label = ManagerDataDisplay[category];
  return (
    <Autocomplete
      value={props.value ?? null}
      onChange={handleChange}
      loading={isLoading}
      size="small"
      fullWidth={matchDownMD}
      sx={{
        width: 200,
        borderRadius: layout.radius.md,
        backgroundColor: theme.palette.background.paper,
        ...theme.applyStyles('dark', {
          backgroundColor: colors.neutral[600],
        }),
      }}
      disableCloseOnSelect
      multiple
      limitTags={0}
      options={controlData.data}
      isOptionEqualToValue={(option, value) => option[validKeyField] === value[validKeyField]}
      getOptionLabel={(option) =>
        get(option, validCodeField) ? `${option[validCodeField]} - ${option[validTextField]}` : ''
      }
      getOptionKey={(option) => option[validKeyField] ?? ''}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" size="small" placeholder={`${label} filter`} />
      )}
    />
  );
};
