import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import { t } from 'i18next';
import { ToolbarBaseIcon } from 'components/toolbar';
import { ToolbarButton } from './ToolbarButton';
import { FilterButtonProps } from './types';

export const FilterButton = ({
  hasFilters,
  includeText,
  handleCleanFilters,
}: FilterButtonProps) => {
  if (!handleCleanFilters) return null;

  if (!hasFilters) return null;

  if (includeText)
    return (
      <ToolbarButton
        variant="outlined"
        startIcon={<FilterAltOffOutlinedIcon />}
        onClick={handleCleanFilters}
      >
        {t('actions.buttonClearFilters')}/
      </ToolbarButton>
    );
  return (
    <ToolbarBaseIcon
      icon={<FilterAltOffOutlinedIcon />}
      onClick={handleCleanFilters}
      title={t('actions.buttonClearFilters')}
    />
  );
};
