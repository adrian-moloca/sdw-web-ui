import { alpha, styled } from '@mui/material/styles';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';
import { StripedDataGridProps, customGridClasses, ODD_OPACITY } from './types';
import { layout } from 'themes/layout';
import { colors, olympicsDesignColors } from 'themes/colors';

export const StripedIndexDataGrid = styled(DataGridPro, {
  shouldForwardProp: (prop) => prop !== 'fontSize', // Avoid passing fontSize to DOM
})<StripedDataGridProps>(({ theme, fontSize }) => ({
  border: `1px solid ${theme.palette.divider}!important`,
  ...theme.applyStyles('dark', {
    border: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
  }),
  '& .MuiDataGrid-columnSeparator': {
    display: 'none!important',
  },
  '.MuiDataGrid-columnHeaderTitle': {
    whiteSpace: 'pre-wrap',
  },
  '& .MuiDataGrid-columnHeader': {
    background: theme.palette.grey[100],
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[100],
      background: olympicsDesignColors.dark.general.background,
    }),
    fontWeight: 200,
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
  },
  '&.MuiDataGrid-filler': {
    background: colors.neutral.white,
    ...theme.applyStyles('dark', {
      borderRightColor: theme.palette.grey[800],
      background: theme.palette.grey[900],
    }),
    color: theme.palette.text.primary,
  },
  '& .MuiCheckbox-root': {
    paddingTop: 0.1,
    paddingBottom: 0.1,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell, .MuiDataGrid-columnHeader': {
    borderBottom: `1px solid ${theme.palette.divider}!important`,
    ...theme.applyStyles('dark', {
      borderBottom: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
    }),
  },
  '& .MuiDataGrid-cell': {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
    paddingTop: '2px!important',
    paddingBottom: '2px!important',
    alignContent: 'center',
    lineHeight: 1.1,
  },
  '& .MuiTablePagination-root .MuiSelect-select': {
    borderRadius: layout.radius.md,
    border: `1px solid ${colors.neutral[400]}`, // !important often not needed with styled's specificity
    textAlign: 'left',
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800], // Using theme's grey for consistency
      background: theme.palette.grey[900], // Using theme's grey for consistency
    }),
    '& .MuiSelect-icon': {
      color: colors.neutral[600],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[400], // Example dark mode icon color
      }),
    },
  },

  [`& .${customGridClasses.hoveredRow}`]: {
    backgroundColor: colors.neutral.white,
    ...theme.applyStyles('dark', {
      background: colors.neutral[600],
    }),
  },
  [`& .${customGridClasses.hoveredCol}`]: {
    backgroundColor: alpha(
      theme.palette.primary.main,
      0.2 + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
    ),
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[50],
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.surface,
    }),
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: theme.palette.background.paper,
    ...theme.applyStyles('dark', {
      borderRightColor: theme.palette.grey[800],
      backgroundColor: theme.palette.grey[900],
    }),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[900],
    }),
  },
  [`& .${gridClasses.row}`]: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));
