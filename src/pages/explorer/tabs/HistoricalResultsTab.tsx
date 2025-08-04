import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FullscreenTwoTone from '@mui/icons-material/FullscreenTwoTone';
import FullscreenExitTwoTone from '@mui/icons-material/FullscreenExitTwoTone';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import { t } from 'i18next';
import type { IPanelTabProps } from 'types/views';
import { useStoreCache } from 'hooks';
import { EntityType, Entry, MasterData } from 'models';
import { HistoricalResultsCard, HistoricalResultsGrid } from 'pages/explorer/components';

export const HistoricalResultsTab = (props: IPanelTabProps) => {
  const [categories, setCategories] = useState<Array<Entry>>([]);
  const [alignment, setAlignment] = useState<string | null>('compact');

  const { handleMetadata, dataInfo } = useStoreCache();

  useEffect(() => {
    handleMetadata(EntityType.Result);
    handleMetadata(EntityType.Participant);
    handleMetadata(EntityType.Competition);
  }, []);

  const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Stack direction="row" spacing={1}>
          <Box sx={{ flexGrow: 1 }} />
          <ToggleButtonGroup
            size="small"
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="view compact"
          >
            <ToggleButton value="full" aria-label="full">
              <FullscreenTwoTone />
            </ToggleButton>
            <ToggleButton value="compact" aria-label="compact">
              <FullscreenExitTwoTone />
            </ToggleButton>
          </ToggleButtonGroup>
          <Autocomplete
            id="filter_by_category"
            multiple
            size="small"
            sx={{ minWidth: 300 }}
            getOptionLabel={(option) => get(option, 'value') ?? ''}
            getOptionKey={(option) => get(option, 'key') ?? ''}
            options={uniqBy(dataInfo[MasterData.CompetitionCategory], 'key')}
            value={categories}
            onChange={(_event: any, newValue: any) => setCategories(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={t('general.filter-by-category')} />
            )}
          />
        </Stack>
      </Grid>
      {alignment === 'full' ? (
        <HistoricalResultsCard {...props} categories={categories} />
      ) : (
        <HistoricalResultsGrid {...props} categories={categories} />
      )}
    </Grid>
  );
};
