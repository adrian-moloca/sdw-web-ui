import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import { useQuery } from '@tanstack/react-query';
import { VariationSetup } from 'pages/reports-manager/components';
import { t } from 'i18next';

export const MetadataPage = () => {
  const manager = useSelector((x: RootState) => x.manager);
  const apiService = useApiService();

  const [currentEvent, setCurrentEvent] = useState(
    manager.currentEdition
      ? {
          id: manager.currentEdition.id,
          code: manager.currentEdition.code,
          title: manager.currentEdition.name,
        }
      : undefined
  );
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [currentVariation, setCurrentVariation] = useState<any>(null);

  const url = `${appConfig.reportManagerEndPoint}/setup/editions`;
  const { data, isLoading } = useQuery({
    queryKey: ['setup_editions'],
    queryFn: () => apiService.fetch(url),
  });

  const urlCategory = `${appConfig.reportManagerEndPoint}/editions/${currentEvent?.id}/categories`;
  const { data: categories, isLoading: isLoadingCategory } = useQuery({
    queryKey: [`${currentEvent?.id}_categories`],
    queryFn: () => apiService.fetch(urlCategory),
    enabled: Boolean(currentEvent?.id),
  });

  const urlVariation = `${appConfig.reportManagerEndPoint}/categories/${currentCategory?.id}/variations`;
  const { data: variations, isLoading: isLoadingVariations } = useQuery({
    queryKey: [`${currentCategory?.id}_variations`],
    queryFn: () => apiService.fetch(urlVariation),
    enabled: Boolean(currentEvent?.id),
  });

  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setCurrentEvent(newValue);
    setCurrentCategory(null);
    setCurrentVariation(null);
  };

  const handleChangeCategory = (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setCurrentCategory(newValue);
    setCurrentVariation(null);
  };

  const handleChangeVariation = (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setCurrentVariation(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12} container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }}>
          <Autocomplete
            value={currentEvent}
            onChange={handleChange}
            onInputChange={(event, value) => event && handleChange(event, value)}
            fullWidth
            loading={isLoading}
            options={data ?? []}
            autoHighlight
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => `${option.code} - ${option.title}`}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                label={t('messages.select-an-edition')}
                sx={{ fontSize: '1.2rem' }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
          <Autocomplete
            value={currentCategory}
            onChange={handleChangeCategory}
            onInputChange={(event, value) => event && handleChangeCategory(event, value)}
            fullWidth
            disabled={!currentEvent?.id}
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
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
          <Autocomplete
            value={currentVariation}
            onChange={handleChangeVariation}
            onInputChange={(event, value) => event && handleChangeVariation(event, value)}
            fullWidth
            disabled={!currentCategory?.id}
            loading={isLoadingVariations}
            options={variations ?? []}
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
      </Grid>
      {currentVariation && <VariationSetup id={currentVariation?.id} />}
    </Grid>
  );
};
