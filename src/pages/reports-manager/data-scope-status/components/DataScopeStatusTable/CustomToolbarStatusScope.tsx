import {
  Toolbar,
  FilterPanelTrigger,
  QuickFilterClear,
  QuickFilterControl,
  ToolbarButton,
} from '@mui/x-data-grid-pro';
import { Box, Tooltip, Badge, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CancelIcon from '@mui/icons-material/Cancel';
import { ChevronLeft, ChevronRight, FilterListOffOutlined } from '@mui/icons-material';
import { StyledQuickFilter, StyledTextField } from './utilities/StyledFilters';
import { t } from 'i18next';
import { StyledIconButton } from 'components';
import { AppDispatch, drawerActions, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { useModelConfig } from 'hooks';
import { EntityType } from 'models';

export const CustomToolbarStatusScope = ({ clearFilters }: { clearFilters: () => void }) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.GdsDashboard);
  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[config.type]?.open);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <Box sx={{ display: 'flex' }}>
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
          marginBottom: '12px',
          marginTop: '12px',
          padding: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={t('general.filters')}>
            <FilterPanelTrigger
              render={(props, state) => (
                <ToolbarButton {...props} color="default" aria-label={t('general.filters')}>
                  <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                    <FilterListIcon fontSize="small" />
                  </Badge>
                </ToolbarButton>
              )}
            />
          </Tooltip>

          <Tooltip title={t('actions.buttonClearFilters')}>
            <ToolbarButton onClick={clearFilters} aria-label={t('actions.buttonClearFilters')}>
              <FilterListOffOutlined fontSize="small" />
            </ToolbarButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </>
  );
};
