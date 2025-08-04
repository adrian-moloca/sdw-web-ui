import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { t } from 'i18next';
import { ToolbarBaseIcon } from 'components/toolbar';
import { ToolbarButton } from './ToolbarButton';
import { ViewModeButtonProps } from './types';

export const ViewModeButton = ({ includeText, viewMode, handleViewMode }: ViewModeButtonProps) => {
  if (!viewMode || !handleViewMode) return null;

  if (includeText)
    return (
      <ToolbarButton
        variant="outlined"
        startIcon={viewMode == 'list' ? <TableRowsOutlinedIcon /> : <TableChartOutlinedIcon />}
        onClick={handleViewMode}
      >
        {t('actions.buttonViewMode')}
      </ToolbarButton>
    );

  return (
    <ToolbarBaseIcon
      icon={viewMode == 'list' ? <TableRowsOutlinedIcon /> : <TableChartOutlinedIcon />}
      onClick={handleViewMode}
      title={t('actions.buttonViewMode')}
    />
  );
};
