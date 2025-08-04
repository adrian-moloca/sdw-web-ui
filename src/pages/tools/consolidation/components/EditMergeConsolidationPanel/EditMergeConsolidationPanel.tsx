import { Autocomplete, TextField, Button, Box } from '@mui/material';
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';
import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';
import useApiService from 'hooks/useApiService';
import { EntityType } from 'models';
import { GenericLoadingPanel } from 'components';
import appConfig from 'config/app.config';
import { useModelConfig } from 'hooks';
import { BaseEditMergeConsolidationPanel } from './utils';
import type { Props } from './types';

export const EditMergeConsolidationPanel = (props: Props) => {
  const [id, setId] = useState<any>(null);

  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.MergeRequest);
  const apiService = useApiService();

  const { data, isLoading } = useQuery({
    queryKey: [`${props.config.entityName}_merge${props.id}`],
    queryFn: () =>
      apiService.getById(props.config, props.id ?? '', `${appConfig.apiEndPoint}${config.apiNode}`),
    refetchOnMount: true,
    refetchInterval: 60 * 1000,
  });

  const getCollection = () => {
    if (isLoading) return [];

    const combinedArray =
      data?.records?.map((item: any) => ({
        id: item.id,
        source: item.sourceid,
      })) ?? [];

    return combinedArray;
  };

  const sourceIds = getCollection();

  if (isLoading) return <GenericLoadingPanel loading={isLoading} />;

  if (props.fieldSetup)
    return (
      <Grid container spacing={2}>
        <Grid size={12} sx={{ display: 'flex' }}>
          <Autocomplete
            size="small"
            fullWidth
            loading={isLoading}
            options={sourceIds}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option: any) => `${option.source} (${option.id})`}
            value={id}
            onChange={(_event: any, newValue: any) => setId(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('message.select-id-source-to-edit')}
                label={'Source ID'}
              />
            )}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            startIcon={<DoDisturbOutlinedIcon />}
            variant="outlined"
            disableElevation
            onClick={() => props.onCallback()}
            sx={{ marginLeft: 1 }}
          >
            {t('actions.buttonCancel')}
          </Button>
        </Grid>
        {id?.id && (
          <Grid size={12}>
            <BaseEditMergeConsolidationPanel {...props} id={id.id ?? ''} />
          </Grid>
        )}
      </Grid>
    );

  return null;
};
