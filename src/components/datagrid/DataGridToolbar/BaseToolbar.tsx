import {
  GridToolbarProps,
  ToolbarPropsOverrides,
  Toolbar,
  FilterPanelTrigger,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
} from '@mui/x-data-grid-pro';
import {
  Badge,
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FilterListOffOutlined from '@mui/icons-material/FilterListOffOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useRef } from 'react';
import { t } from 'i18next';
import { EditionFlagEnum } from 'models';
import { DataGridToolbar } from 'components/datagrid';
import {
  StyledQuickFilter,
  StyledTextField,
  StyledToolbarButton,
  StyledToolbarButtonBase,
} from 'components/tables';

type Props = GridToolbarProps & ToolbarPropsOverrides;

export const BaseToolbar = ({
  flags,
  toolbar,
  onClickCreate,
  onFilterClean,
  showCreateButton = true,
}: Props) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const settingsMenuTriggerRef = useRef<HTMLButtonElement>(null);

  const canCreate = (flags & EditionFlagEnum.CanCreate) === EditionFlagEnum.CanCreate;

  if (matchDownSM)
    return (
      <Toolbar>
        {showCreateButton && canCreate && (
          <Tooltip title={t('actions.buttonNew')}>
            <StyledToolbarButtonBase
              aria-label={t('actions.buttonNew')}
              color="default"
              onClick={onClickCreate}
            >
              <AddOutlined fontSize="small" />
            </StyledToolbarButtonBase>
          </Tooltip>
        )}
        <Tooltip title={t('common.settings')}>
          <StyledToolbarButtonBase
            ref={settingsMenuTriggerRef}
            id="settings-menu-trigger"
            aria-controls={settingsMenuOpen ? 'settings-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={settingsMenuOpen}
            onClick={() => setSettingsMenuOpen(true)}
          >
            <MenuOutlined fontSize="small" sx={{ ml: 'auto' }} />
          </StyledToolbarButtonBase>
        </Tooltip>
        <Menu
          id="settings-menu"
          anchorEl={settingsMenuTriggerRef.current}
          open={settingsMenuOpen}
          onClose={() => setSettingsMenuOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            list: {
              'aria-labelledby': 'settings-menu-trigger',
            },
          }}
        >
          {toolbar
            ?.filter((e: any) => e.visible)
            .map((tool: any, index: number) => (
              <MenuItem
                key={`${tool.type}-${tool.label ?? tool.tooltip ?? ''}${index}`}
                sx={{ width: 240, mr: theme.spacing(2) }}
              >
                <DataGridToolbar
                  {...tool}
                  action={() => {
                    tool?.action();
                  }}
                  onChange={(dataItem: any) => {
                    tool?.onChange(dataItem);
                  }}
                />
              </MenuItem>
            ))}
          <MenuItem onClick={onFilterClean}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListOffOutlined sx={{ fontSize: '26px' }} />}
              aria-label="Button to clear filter"
            >
              {t('actions.buttonClearFilters')}
            </Button>
          </MenuItem>
        </Menu>
        <StyledQuickFilter>
          <QuickFilterTrigger
            render={(triggerProps, state) => (
              <Tooltip title="Search" enterDelay={0}>
                <StyledToolbarButton
                  {...triggerProps}
                  ownerState={{ expanded: state.expanded }}
                  color="default"
                  aria-disabled={state.expanded}
                >
                  <SearchIcon fontSize="small" />
                </StyledToolbarButton>
              </Tooltip>
            )}
          />
          <QuickFilterControl
            render={({ ref, ...controlProps }, state) => (
              <StyledTextField
                {...controlProps}
                ownerState={{ expanded: state.expanded }}
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
                    ...controlProps.slotProps?.input,
                  },
                  ...controlProps.slotProps,
                }}
              />
            )}
          />
        </StyledQuickFilter>
      </Toolbar>
    );

  return (
    <Toolbar>
      {showCreateButton && canCreate && (
        <Tooltip title={t('actions.buttonNew')}>
          <StyledToolbarButtonBase
            aria-label={t('actions.buttonNew')}
            color="default"
            onClick={onClickCreate}
          >
            <AddOutlined fontSize="small" />
          </StyledToolbarButtonBase>
        </Tooltip>
      )}
      <Tooltip title={t('general.filters')}>
        <FilterPanelTrigger
          render={(props, state) => (
            <StyledToolbarButtonBase {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </StyledToolbarButtonBase>
          )}
        />
      </Tooltip>
      <Tooltip title={t('actions.buttonClearFilters')}>
        <StyledToolbarButtonBase
          aria-label={t('actions.buttonClearFilters')}
          color="default"
          onClick={onFilterClean}
        >
          <FilterListOffOutlined fontSize="small" />
        </StyledToolbarButtonBase>
      </Tooltip>
      <Box sx={{ flexGrow: 1 }} />
      {toolbar
        ?.filter((e: any) => e.visible)
        .map((tool: any, index: number) => (
          <DataGridToolbar
            key={`${tool.type}-${tool.label ?? tool.tooltip ?? ''}${index}`}
            {...tool}
          />
        ))}
      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
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
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
};
