import React, { useCallback, useRef, useEffect, useState } from 'react';
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
import { debounce } from 'lodash';

interface CustomToolbarStatusScopeProps {
  clearFilters: () => void;
  onSearchChange?: (searchQuery: string) => void;
}

export const CustomToolbarStatusScope: React.FC<CustomToolbarStatusScopeProps> = ({
  clearFilters,
  onSearchChange,
}) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.GdsDashboard);
  const isOpen = useSelector((state: RootState) => state.drawer.profile?.[config.type]?.open);
  const dispatch = useDispatch<AppDispatch>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [shouldMaintainFocus, setShouldMaintainFocus] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setShouldMaintainFocus(true);
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 2500),
    [onSearchChange]
  );

  useEffect(() => {
    if (shouldMaintainFocus && searchInputRef.current) {
      searchInputRef.current.focus();
      setShouldMaintainFocus(false);
    }
  }, [shouldMaintainFocus]);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchInputRef.current
      ) {
        searchInputRef.current.blur();
        setShouldMaintainFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.target === searchInputRef.current) {
      return;
    }
    e.preventDefault();
  };

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
          <Box
            ref={searchContainerRef}
            onClick={handleSearchClick}
            onMouseDown={handleContainerMouseDown}
          >
            <StyledQuickFilter>
              <QuickFilterControl
                render={({ ref, ...controlProps }, state) => (
                  <StyledTextField
                    {...controlProps}
                    ownerState={{ expanded: true }}
                    inputRef={(input) => {
                      searchInputRef.current = input;
                      if (ref) {
                        if (typeof ref === 'function') {
                          ref(input);
                        } else {
                          ref.current = input;
                        }
                      }
                    }}
                    aria-label={t('actions.buttonSearch')}
                    placeholder={t('messages.search')}
                    size="small"
                    onChange={(e) => {
                      if (controlProps.onChange) {
                        controlProps.onChange(e);
                      }
                      debouncedSearch(e.target.value);
                    }}
                    onClick={handleSearchClick}
                    onFocus={(e) => {
                      e.stopPropagation();
                    }}
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
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShouldMaintainFocus(true);
                                if (onSearchChange) {
                                  onSearchChange('');
                                }
                              }}
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
