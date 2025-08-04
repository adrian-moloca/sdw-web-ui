import { Autocomplete, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useModelConfig } from 'hooks';
import { EntityType, MasterDataCategory } from 'models';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import type { FilterProps } from '../types';
import { colors } from 'themes/colors';
import { layout } from 'themes/layout';
import { useTranslation } from 'react-i18next';

export const ToolbarMasterFilter = (props: FilterProps) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const { i18n } = useTranslation();
  const { getConfig, masterDataDisplay } = useModelConfig();
  const config = getConfig(EntityType.Entry);
  const apiService = useApiService();

  const category = props.category as MasterDataCategory;
  const url = `${appConfig.masterDataEndPoint}${config.apiNode}/${category}`;
  const variables: any = {
    enablePagination: true,
    languageCode: i18n.language.toUpperCase(),
    rows: 300,
    start: 0,
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [`${category}_combo`],
    queryFn: () => apiService.getMasterData(url, variables),
  });

  const validKeyField = 'key';
  const validTextField = 'value';

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    event.stopPropagation();
    props.onChange(newValue);
  };

  const mapDataContent = (content: any[], mappingFunction: (item: any) => any): any[] => {
    return content?.map(mappingFunction) ?? [];
  };

  const getDataArray = (data: any): any[] => {
    const filteredData = props.filters
      ? data?.content?.filter((x: any) => props.filters?.includes(x.key))
      : data?.content;

    if (props.added) {
      filteredData.push(props.added);
    }

    return mapDataContent(filteredData, (item: any) => {
      const firstLetter = item.value[0].toUpperCase();
      return {
        firstLetter: /\d/.test(firstLetter) ? '0-9' : firstLetter,
        ...item,
      };
    });
  };

  const controlData = isLoading || error ? { data: [] } : { data: getDataArray(data) };

  return (
    <Autocomplete
      value={props.value ?? null}
      onChange={handleChange}
      loading={isLoading || !data?.content || props.isLoading}
      size="small"
      fullWidth={matchDownMD}
      sx={{
        width: 200,
        mr: theme.spacing(1),
        borderRadius: layout.radius.md,
        backgroundColor: theme.palette.background.paper,
        ...theme.applyStyles('dark', {
          backgroundColor: colors.neutral[600],
        }),
      }}
      multiple
      disableCloseOnSelect
      limitTags={matchDownMD ? 0 : (props.limitTags ?? 0)}
      options={controlData.data}
      isOptionEqualToValue={(option, value) => option[validKeyField] === value[validKeyField]}
      getOptionLabel={(option) => option[validTextField] ?? ''}
      getOptionKey={(option) => option[validKeyField] ?? ''}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          placeholder={masterDataDisplay[category]}
        />
      )}
    />
  );
};
