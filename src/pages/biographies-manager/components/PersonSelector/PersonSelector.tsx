import { Autocomplete, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { EntityType, EnumType, useEnums } from 'models';
import { t } from 'i18next';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isDevelopment, Logger } from '_helpers';
import { useModelConfig } from 'hooks';

type Props = {
  type: EntityType;
  data: any;
};

export const PersonSelector = (props: Props) => {
  const { getConfig } = useModelConfig();
  const { getEnumValueOf } = useEnums();
  const config = getConfig(props.type);
  const [value, setValue] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const apiService = useApiService();
  const url = `${appConfig.biographiesManagerEndPoint}/shared/persons`;
  const queryClient = useQueryClient();
  const urlMutation = `${appConfig.biographiesManagerEndPoint}${config.apiNode}/${props.data.id}/members`;

  const mutation = useMutation({
    mutationFn: async (updateData: any) => apiService.put(urlMutation, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${props.data.id}_view`] });
    },
    onError: (error: any) => {
      return error;
    },
  });

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync([value.id]);
    } catch {
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (inputValue.length >= 3) {
        // trigger search only when input length is greater than or equal to 3
        setLoading(true);
        try {
          const data = await apiService.fetch(`${url}?search=${inputValue}`);
          setOptions(data ?? []);
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
    <Grid container size={12} spacing={1}>
      <Grid size={6}>
        <Autocomplete
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.displayName)}
          filterOptions={(x) => x}
          options={options}
          autoComplete
          fullWidth
          includeInputInList
          filterSelectedOptions
          value={value}
          size="small"
          noOptionsText="No persons"
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
              label={t('messages.search-for-persons')}
              fullWidth
              helperText={t('messages.hint-type-at-least-3-characters-to-search')}
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
          renderOption={(props: React.HTMLAttributes<HTMLLIElement> & { key: any }, option) => {
            const { key, ...optionProps } = props;
            const type = getEnumValueOf(option.personType, EnumType.PersonType);
            const status = getEnumValueOf(option.status, EnumType.BioStatus);
            const Icon = type!.icon!;
            return (
              <li key={key} {...optionProps}>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid sx={{ display: 'flex', width: 44 }}>
                    <Icon sx={{ color: 'text.secondary' }} />
                  </Grid>
                  <Grid sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                      {option.displayName}
                    </Box>
                    <Typography variant="body2" sx={{ color: status?.color ?? 'text.secondary' }}>
                      {status?.text}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
      </Grid>
      <Grid size={6}>
        <Button
          variant="outlined"
          color="secondary"
          disabled={!value}
          startIcon={<AddOutlinedIcon />}
          onClick={handleSubmit}
        >
          {t('actions.addMember')}
        </Button>
      </Grid>
    </Grid>
  );
};
