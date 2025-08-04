import { alpha, styled } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { customGridClasses, StripedDataGridProps } from 'components';
import { olympicsDesignColors } from 'themes/colors';

export const StatsDataGrid = styled(DataGridPro, {
  shouldForwardProp: (prop) => prop !== 'fontSize', // Avoid passing fontSize to DOM
})<StripedDataGridProps>(({ theme, fontSize }) => ({
  border: `1px solid ${theme.palette.divider}!important`,
  ...theme.applyStyles('dark', {
    border: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
  }),
  '& .MuiDataGrid-columnSeparator': {
    display: 'none!important',
  },
  '.MuiDataGrid-mainContent': {
    backgroundColor: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.background,
    }),
  },
  '& .MuiDataGrid-columnHeader': {
    borderRightColor: theme.palette.background.paper,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.surface,
      color: olympicsDesignColors.dark.text.primary,
    }),
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
  },
  '& .MuiDataGrid-columnHeaders, .MuiDataGrid-overlay': {
    backgroundColor: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.background,
    }),
  },
  '.MuiDataGrid-filler': {
    backgroundColor: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.background,
    }),
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell, .MuiDataGrid-columnHeader': {
    borderBottom: `1px solid ${theme.palette.divider}!important`,
    ...theme.applyStyles('dark', {
      borderBottom: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
    }),
  },
  '& .MuiCheckbox-root': {
    paddingTop: 0.1,
    paddingBottom: 0.1,
  },
  '& .MuiDataGrid-cell': {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
    paddingTop: '2px!important',
    paddingBottom: '2px!important',
    alignContent: 'center',
    lineHeight: 1.1,
    background: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      background: olympicsDesignColors.dark.general.background,
    }),
  },
  [`& .${customGridClasses.hoveredRow}`]: {
    backgroundColor: alpha(
      theme.palette.primary.main,
      0.1 + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
    ),
  },
  [`& .${customGridClasses.hoveredCol}`]: {
    backgroundColor: alpha(
      theme.palette.primary.main,
      0.2 + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
    ),
  },
}));
