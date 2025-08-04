export type FilterButtonProps = {
  includeText: boolean;
  hasFilters: boolean;
  handleCleanFilters?: () => void;
};

export type ViewModeButtonProps = {
  includeText: boolean;
  viewMode?: 'list' | 'grid';
  handleViewMode?: () => void;
};

export type BasicToolbarProps = FilterButtonProps &
  ViewModeButtonProps & {
    search: string | undefined;
    className?: string;
    handleSearchChange: (e: any) => void;
    handleNew?: () => void;
    handleReload?: () => void;
    handleExport?: () => void;
    //actions?: IActionProps[];
  };
