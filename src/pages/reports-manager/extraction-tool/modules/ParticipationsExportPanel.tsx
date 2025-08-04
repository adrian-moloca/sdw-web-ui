import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import {
  codecFilterState,
  DataGridPanel,
  defaultFilter,
  FilterPanel,
  FilterState,
  FilterType,
  MainCard,
} from 'components';
import { EditionFlagEnum, EntityType } from 'models';
import { useModelConfig } from 'hooks';
import { buildExtractorColumns } from '../components/columns';
import useApiService from 'hooks/useApiService';
import appConfig from 'config/app.config';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useLocalStorageState } from '@toolpad/core';

export const ParticipationsExportPanel = () => {
  const { getConfig, getDataSource } = useModelConfig();
  const [value, setValue] = useLocalStorageState('extractor-op-filter', defaultFilter, {
    codec: codecFilterState,
  });
  const config = getConfig(EntityType.ExtractorParticipant);
  const apiService = useApiService();

  const [downloading, setDownloading] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>(value ?? defaultFilter);
  const handleDownload = async () => {
    setDownloading(true);
    const fileName = `Olympic_Games_Participations_${dayjs().format('YYYYMMDD')}.xlsx`;
    await apiService.downloadExtractor(
      `${appConfig.extractorEndPoint}/extractor/download`,
      filters,
      fileName
    );
    setDownloading(false);
  };
  const applyFilters = (filters: FilterState) => {
    setFilters(filters);
    setValue(filters);
  };
  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <FilterPanel
        type={FilterType.Participation}
        filters={filters}
        onFilterChange={applyFilters}
        defaultOpen={true}
        onClean={() => applyFilters(defaultFilter)}
        downloading={downloading}
        onDownload={handleDownload}
      />
      <Grid size={{ xs: 12, md: 12 }}>
        <MainCard
          content={false}
          title={t('general.data-preview')}
          expandable={true}
          divider={false}
          sx={{ px: 2, py: 1 }}
        >
          <Box sx={{ height: 800 }}>
            <DataGridPanel
              config={config}
              flags={EditionFlagEnum.CanView}
              tags={{
                ...filters,
              }}
              columns={buildExtractorColumns()}
              showHeader={false}
              toolbarType="none"
              dataSource={getDataSource(config.type)}
            />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
};
