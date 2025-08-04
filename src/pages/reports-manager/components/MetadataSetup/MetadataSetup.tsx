import Grid from '@mui/material/Grid';
import useApiService from 'hooks/useApiService';
import { useQuery } from '@tanstack/react-query';
import { EntityType } from 'models';
import { GenericLoadingPanel } from 'components';
import { Autocomplete, TextField } from '@mui/material';
import { VariationSetup } from '../VariationSetup';
import { useModelConfig, useStoreCache } from 'hooks';
import appConfig from 'config/app.config';
import { t } from 'i18next';
import { useState } from 'react';

export const MetadataSetup = () => {
  const { getDataSourceUrl } = useModelConfig();
  const { managerSetup } = useStoreCache();

  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [currentVariation, setCurrentVariation] = useState<any>(null);
  const apiService = useApiService();

  const urlCategory = `${appConfig.reportManagerEndPoint}/editions/${managerSetup.currentEdition?.id}/categories`;
  const { data: categories, isLoading: isLoadingCategory } = useQuery({
    queryKey: [`${managerSetup.currentEdition?.id}_variations`],
    queryFn: () => apiService.fetch(urlCategory),
  });

  const urlVariation = `${getDataSourceUrl(EntityType.ReportCategory)}/${currentCategory?.id}/variations`;
  const { data: variations, isLoading: isLoadingVariation } = useQuery({
    queryKey: [`${currentCategory?.id}_variations`],
    queryFn: () => apiService.fetch(urlVariation),
    enabled: Boolean(currentCategory?.id),
  });

  const handleChangeCategory = (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setCurrentCategory(newValue);
    setCurrentVariation(null);
  };

  const handleChangeVariation = (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setCurrentVariation(newValue);
  };

  if (isLoadingCategory || isLoadingVariation) {
    return <GenericLoadingPanel loading={true} />;
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <Autocomplete
          value={currentCategory}
          onChange={handleChangeCategory}
          onInputChange={(event, value) => event && handleChangeCategory(event, value)}
          fullWidth
          disableClearable={true}
          loading={isLoadingCategory}
          options={categories ?? []}
          autoHighlight
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => `${option.code} - ${option.title}`}
          renderInput={(inputParams) => (
            <TextField
              {...inputParams}
              label={t('message.select-report-category')}
              sx={{ fontSize: '1.2rem' }}
            />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <Autocomplete
          value={currentVariation}
          onChange={handleChangeVariation}
          onInputChange={(event, value) => event && handleChangeVariation(event, value)}
          fullWidth
          loading={isLoadingVariation}
          options={variations ?? []}
          disabled={!currentCategory}
          autoHighlight
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => `${option.code} - ${option.title}`}
          renderInput={(inputParams) => (
            <TextField
              {...inputParams}
              label={t('message.select-report-variation')}
              sx={{ fontSize: '1.2rem' }}
            />
          )}
        />
      </Grid>
      {currentVariation && <VariationSetup id={currentVariation?.id} />}
    </Grid>
  );
};
