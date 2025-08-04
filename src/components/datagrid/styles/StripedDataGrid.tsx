import { alpha, styled } from '@mui/material/styles';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';
import { ODD_OPACITY, customGridClasses } from './types';
import { colors, olympicsDesignColors } from 'themes/colors';

interface StripedDataGridProps {
  fontSize?: string | number;
}
export const StripedDataGrid = styled(DataGridPro, {
  shouldForwardProp: (prop) => prop !== 'fontSize', // Avoid passing fontSize to DOM
})<StripedDataGridProps>(({ theme, fontSize }) => ({
  border: `1px solid ${theme.palette.divider}!important`,
  ...theme.applyStyles('dark', {
    border: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
  }),
  '& .MuiDataGrid-columnHeader': {
    background: theme.palette.grey[50],
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.surface,
    }),
    fontWeight: 200,
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
  },
  // '.MuiDataGrid-mainContent': {
  //   backgroundColor: olympicsDesignColors.light.general.background,
  //   ...theme.applyStyles('dark', {
  //     backgroundColor: olympicsDesignColors.dark.general.background,
  //   }),
  // },
  '.MuiDataGrid-columnHeaderTitle': {
    whiteSpace: 'pre-wrap',
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none!important',
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell, .MuiDataGrid-columnHeader': {
    borderBottom: `1px solid ${theme.palette.divider}!important`,
    ...theme.applyStyles('dark', {
      borderBottom: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
    }),
  },
  '&.MuiDataGrid-filler': {
    background: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      background: olympicsDesignColors.dark.general.background,
    }),
    color: theme.palette.text.primary,
  },
  '& .MuiCheckbox-root': {
    paddingTop: 0.1,
    paddingBottom: 0.1,
  },
  '& .MuiDataGrid-detailPanel': {
    background: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      background: olympicsDesignColors.dark.general.background,
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
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.background,
    }),
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: theme.palette.grey[50],
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.surface,
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
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export const StripedDataGridBase = styled(DataGridPro, {
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
    borderRightColor: theme.palette.background.default,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.background,
      color: colors.neutral.white,
    }),
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
  },
  '& .MuiDataGrid-detailPanel': {
    background: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      background: olympicsDesignColors.dark.general.background,
    }),
  },
  '&.MuiDataGrid-filler': {
    background: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      background: olympicsDesignColors.dark.general.background,
    }),
    color: theme.palette.text.primary,
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
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: olympicsDesignColors.light.general.background,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.background,
    }),
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[50],
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.surface,
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
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
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
  [`& .${gridClasses.row}`]: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));
export const VerticalStripedDataGridBase = styled(DataGridPro, {
  shouldForwardProp: (prop) => prop !== 'fontSize', // Avoid passing fontSize to DOM
})<StripedDataGridProps>(({ theme, fontSize }) => ({
  border: `1px solid ${theme.palette.divider}!important`,
  ...theme.applyStyles('dark', {
    border: `1px solid ${olympicsDesignColors.dark.general.divider}!important`,
  }),
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderRightColor: '#f0f0f0',
    }),
  },
  '& .MuiDataGrid-columnHeader': {
    fontWeight: 600,
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  '&.MuiDataGrid-filler': {
    background: theme.palette.grey[300],
    ...theme.applyStyles('dark', {
      borderRightColor: theme.palette.grey[800],
    }),
    color: theme.palette.text.primary,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderBottomColor: '#f0f0f0',
    }),
  },
  '& .MuiDataGrid-row': {
    '& .MuiDataGrid-cell:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover, // or any color you like
    },
  },
  '& .MuiDataGrid-cell': {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: fontSize ?? theme.typography.body1.fontSize,
    paddingTop: '2px!important',
    paddingBottom: '2px!important',
    alignContent: 'center',
  },
  [`& .${customGridClasses.hoveredRow}`]: {
    backgroundColor: `${alpha(
      theme.palette.primary.main,
      0.1 + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
    )}!important`,
  },
  [`& .${customGridClasses.hoveredCol}`]: {
    backgroundColor: `${alpha(
      theme.palette.primary.main,
      0.1 + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
    )}!important`,
  },
}));
