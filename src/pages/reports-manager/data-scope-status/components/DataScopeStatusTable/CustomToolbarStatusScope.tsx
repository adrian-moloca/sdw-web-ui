import {
  Toolbar,
  FilterPanelTrigger,
  QuickFilterClear,
  QuickFilterControl,
  ToolbarButton,
} from '@mui/x-data-grid-pro';
import {
  Box,
  Tooltip,
  Badge,
  InputAdornment,
  Divider,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CancelIcon from '@mui/icons-material/Cancel';
import { ChevronLeft, ChevronRight, FilterListOffOutlined } from '@mui/icons-material';
import { t } from 'i18next';
import { StyledIconButton } from 'components';
import { AppDispatch, drawerActions, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { useModelConfig } from 'hooks';
import { EntityType } from 'models';
import { useState, useRef } from 'react';
import { StyledQuickFilter, StyledTextField, StyledFilterButton } from './utilities/StyledFilters';

interface FilterState {
  status: string[];
  scopeTypes: string[];
  country: string[];
  region: string[];
  season: string[];
  disciplineName: string[];
  competitionCategories: string[];
}

interface CustomToolbarStatusScopeProps {
  clearFilters: () => void;
  onFiltersChange?: (filters: FilterState) => void;
  availableFilters?: {
    statuses?: string[];
    scopeTypes?: string[];
    countries?: string[];
    regions?: string[];
    seasons?: string[];
    disciplines?: string[];
    categories?: string[];
  };
}

export const CustomToolbarStatusScope = ({
  clearFilters,
  onFiltersChange,
  availableFilters = {},
}: CustomToolbarStatusScopeProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.GdsDashboard);
  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[config.type]?.open);
  const dispatch = useDispatch<AppDispatch>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const filterMenuOpen = Boolean(anchorEl);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    status: [],
    scopeTypes: [],
    country: [],
    region: [],
    season: [],
    disciplineName: [],
    competitionCategories: [],
  });

  const handleFilterMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange =
    (filterType: keyof FilterState) => (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;
      const newFilters = {
        ...filters,
        [filterType]: typeof value === 'string' ? value.split(',') : value,
      };
      setFilters(newFilters);
      onFiltersChange?.(newFilters);
    };

  const handleClearAllFilters = () => {
    const clearedFilters: FilterState = {
      status: [],
      scopeTypes: [],
      country: [],
      region: [],
      season: [],
      disciplineName: [],
      competitionCategories: [],
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
    clearFilters();
  };

  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <StyledIconButton
          aria-label={isOpen ? t('actions.collapse') : t('actions.expand')}
          onClick={() => dispatch(drawerActions.toggleProfileOpen({ profileType: config.type }))}
          sx={{ alignItems: 'center' }}
          title={isOpen ? t('actions.collapse') : t('actions.expand')}
          width="28px"
          height="28px"
        >
          {isOpen ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </StyledIconButton>
      </Box>

      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          border: 'none',
          padding: 0,
          minHeight: 'auto',
        }}
      >
        {/* Quick Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, maxWidth: 400 }}>
          <StyledQuickFilter>
            <QuickFilterControl
              render={({ ref, ...controlProps }, state) => (
                <StyledTextField
                  {...controlProps}
                  ownerState={{ expanded: true }}
                  inputRef={ref}
                  aria-label={t('actions.buttonSearch')}
                  placeholder={t('messages.search')}
                  size="small"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: state.value ? (
                        <InputAdornment position="end">
                          <QuickFilterClear
                            edge="end"
                            size="small"
                            aria-label={t('actions.clear-search')}
                          >
                            <CancelIcon fontSize="small" />
                          </QuickFilterClear>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              )}
            />
          </StyledQuickFilter>
        </Box>

        {/* Filter Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Column-specific filters */}
          <Tooltip title={t('general.advancedFilters')}>
            <StyledFilterButton
              ref={filterButtonRef}
              onClick={handleFilterMenuClick}
              aria-label={t('general.advancedFilters')}
            >
              <Badge badgeContent={activeFilterCount} color="primary">
                <FilterListIcon fontSize="small" />
              </Badge>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {t('general.filters')}
              </Typography>
            </StyledFilterButton>
          </Tooltip>

          {/* DataGrid Filter Panel */}
          <Tooltip title={t('general.columnFilters')}>
            <FilterPanelTrigger
              render={(props, state) => (
                <ToolbarButton {...props} color="default" aria-label={t('general.columnFilters')}>
                  <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                    <FilterListIcon fontSize="small" />
                  </Badge>
                </ToolbarButton>
              )}
            />
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Clear All Filters */}
          <Tooltip title={t('actions.buttonClearFilters')}>
            <ToolbarButton
              onClick={handleClearAllFilters}
              aria-label={t('actions.buttonClearFilters')}
            >
              <FilterListOffOutlined fontSize="small" />
            </ToolbarButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Advanced Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={filterMenuOpen}
        onClose={handleFilterMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            p: 2,
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('general.advancedFilters')}
        </Typography>

        {/* Status Filter */}
        {availableFilters.statuses && (
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('general.overall-status')}</InputLabel>
            <Select
              multiple
              value={filters.status}
              onChange={handleFilterChange('status')}
              input={<OutlinedInput label={t('general.overall-status')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableFilters.statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Scope Types Filter */}
        {availableFilters.scopeTypes && (
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('general.scope-type')}</InputLabel>
            <Select
              multiple
              value={filters.scopeTypes}
              onChange={handleFilterChange('scopeTypes')}
              input={<OutlinedInput label={t('general.scope-type')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableFilters.scopeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Discipline Filter */}
        {availableFilters.disciplines && (
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('general.discipline')}</InputLabel>
            <Select
              multiple
              value={filters.disciplineName}
              onChange={handleFilterChange('disciplineName')}
              input={<OutlinedInput label={t('general.discipline')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableFilters.disciplines.map((discipline) => (
                <MenuItem key={discipline} value={discipline}>
                  {discipline}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Categories Filter */}
        {availableFilters.categories && (
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('general.category')}</InputLabel>
            <Select
              multiple
              value={filters.competitionCategories}
              onChange={handleFilterChange('competitionCategories')}
              input={<OutlinedInput label={t('general.category')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableFilters.categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Country Filter */}
        {availableFilters.countries && (
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('general.country')}</InputLabel>
            <Select
              multiple
              value={filters.country}
              onChange={handleFilterChange('country')}
              input={<OutlinedInput label={t('general.country')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableFilters.countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Season Filter */}
        {availableFilters.seasons && (
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel>{t('general.season')}</InputLabel>
            <Select
              multiple
              value={filters.season}
              onChange={handleFilterChange('season')}
              input={<OutlinedInput label={t('general.season')} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableFilters.seasons.map((season) => (
                <MenuItem key={season} value={season}>
                  {season}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <ToolbarButton onClick={handleClearAllFilters}>
            {t('actions.buttonClearFilters')}
          </ToolbarButton>
          <ToolbarButton onClick={handleFilterMenuClose} color="primary">
            {t('actions.apply')}
          </ToolbarButton>
        </Box>
      </Menu>
    </>
  );
};
