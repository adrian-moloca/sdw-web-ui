import { Box, ButtonGroup, Stack, Toolbar } from '@mui/material';
import { t } from 'i18next';
import { ToolbarBaseIcon } from 'components/toolbar';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { SearchControl } from '../SearchControl';
import { BasicToolbarProps } from './types';
import { FilterButton } from './FilterButton';
import { ViewModeButton } from './ViewModeButton';
import { ToolbarButton } from './ToolbarButton';

const RenderButtons = ({
  includeText,
  hasFilters,
  viewMode,
  handleExport,
  handleNew,
  handleReload,
  handleCleanFilters,
  handleViewMode,
}: BasicToolbarProps) => {
  if (includeText)
    return (
      <ButtonGroup>
        {handleNew && (
          <ToolbarButton variant="outlined" startIcon={<AddOutlinedIcon />} onClick={handleNew}>
            {t('actions.buttonNew')}
          </ToolbarButton>
        )}
        <ToolbarButton variant="outlined" startIcon={<ReplayOutlinedIcon />} onClick={handleReload}>
          {t('actions.buttonReload')}
        </ToolbarButton>
        <FilterButton
          includeText={includeText}
          hasFilters={hasFilters}
          handleCleanFilters={handleCleanFilters}
        />
        <ViewModeButton
          includeText={includeText}
          viewMode={viewMode}
          handleViewMode={handleViewMode}
        />
        {handleExport && (
          <ToolbarButton
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExport}
          >
            {t('actions.buttonExportExcel')}
          </ToolbarButton>
        )}
      </ButtonGroup>
    );

  return (
    <Stack direction={'row'} spacing={1}>
      {handleNew && (
        <ToolbarBaseIcon
          icon={<AddOutlinedIcon />}
          onClick={handleNew}
          title={t('actions.buttonNew')}
        />
      )}
      {handleReload && (
        <ToolbarBaseIcon
          icon={<ReplayOutlinedIcon />}
          onClick={handleReload}
          title={t('actions.buttonReload')}
        />
      )}
      {handleExport && (
        <ToolbarBaseIcon
          icon={<FileDownloadOutlinedIcon />}
          onClick={handleExport}
          title={t('actions.buttonExportExcel')}
        />
      )}
      <FilterButton
        includeText={includeText}
        hasFilters={hasFilters}
        handleCleanFilters={handleCleanFilters}
      />
      <ViewModeButton
        includeText={includeText}
        viewMode={viewMode}
        handleViewMode={handleViewMode}
      />
    </Stack>
  );
};

export const BasicToolbar = ({
  includeText,
  hasFilters,
  viewMode,
  handleExport,
  handleNew,
  handleReload,
  handleCleanFilters,
  handleSearchChange,
  handleViewMode,
}: BasicToolbarProps) => {
  return (
    <Toolbar
      sx={{
        width: '100%',
        alignItems: 'center',
        paddingLeft: '0!important',
        paddingRight: '0!important',
        py: 0,
      }}
    >
      <RenderButtons
        includeText={includeText}
        hasFilters={hasFilters}
        viewMode={viewMode}
        handleExport={handleExport}
        handleNew={handleNew}
        handleReload={handleReload}
        handleCleanFilters={handleCleanFilters}
        handleViewMode={handleViewMode}
        handleSearchChange={handleSearchChange}
        search={undefined}
      />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ padding: 1 }} />
      <SearchControl onChange={(e: any) => handleSearchChange(e.target.value)} />
    </Toolbar>
  );
};
