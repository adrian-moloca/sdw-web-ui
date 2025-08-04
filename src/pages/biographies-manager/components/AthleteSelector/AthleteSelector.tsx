import React, { useEffect, useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useModelConfig, useStoreCache } from 'hooks';
import useApiService from 'hooks/useApiService';
import { EntityType, SearchPayload, TemplateType } from 'models';
import { FieldTemplate } from 'components';

type Props = { type: EntityType; disciplines: any[]; onSelect: (value: any) => void };

export const AthleteSelector = ({ type, disciplines, onSelect }: Readonly<Props>) => {
  const { getConfig } = useModelConfig();
  const { getMetadata } = useStoreCache();

  const metadata = getMetadata(type);
  const config = getConfig(type);

  const [value, setValue] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const apiService = useApiService();

  const handleSubmit = () => {
    onSelect(value);
    setValue([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (inputValue.length >= 3) {
        // trigger search only when input length is greater than or equal to 3
        setLoading(true);

        try {
          const payload: SearchPayload = {
            search: inputValue,
            pagination: {
              total: 0,
              rows: 100,
              start: 0,
            },
            disciplines,
          };

          const data = await apiService.search(`${config.apiNode}/search`, payload);
          setOptions(uniqBy(data?.content ?? [], (x) => x.id));
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    // Debounce the search to avoid too many requests
    const timer = setTimeout(() => {
      fetchData();
    }, 500); // delay API call by 500ms

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Stack direction="row" spacing={1}>
      <Autocomplete
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option[config.displayAccessor]
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        fullWidth
        includeInputInList
        disableCloseOnSelect
        filterSelectedOptions
        multiple
        disabled={!disciplines || disciplines.length === 0}
        value={value}
        noOptionsText={`No ${config.displayPlural.toLowerCase()}`}
        onChange={(_event: any, newValue: any) => {
          setValue(newValue);
          setInputValue('');
        }}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search for ${config.displayPlural.toLowerCase()}`}
            fullWidth
            helperText={t('message.hint-type-at-least-3-characters')}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const gender =
            type == EntityType.Horse
              ? (metadata?.sex.options?.find((x: any) => x.value === option.sex)?.displayName ??
                option.gender)
              : (metadata?.gender.options?.find((x: any) => x.value === option.gender)
                  ?.displayName ?? option.gender);
          return (
            <li key={key} {...optionProps}>
              <Stack component="span">
                <Stack component="span" direction="row" spacing={1}>
                  <FieldTemplate
                    type={TemplateType.Country}
                    value={option.nationality ?? option.countryOfBirth}
                    size="sm"
                    withText={false}
                  />
                  <Typography variant="body1" component="span" sx={{ fontWeight: '500' }}>
                    {option[config.displayAccessor]}
                  </Typography>
                </Stack>
                <Stack component="span" direction="row" spacing={1}>
                  <Typography variant="body1" component="span">
                    {option.dateOfBirth}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {gender}
                  </Typography>
                </Stack>
              </Stack>
            </li>
          );
        }}
      />
      <Box>
        <IconButton color="secondary" disabled={!value} onClick={handleSubmit}>
          <AddOutlinedIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};
