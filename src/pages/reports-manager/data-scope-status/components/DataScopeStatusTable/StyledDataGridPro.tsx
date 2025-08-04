import { alpha, styled } from '@mui/material/styles';
import { DataGridPro, DataGridProProps, gridClasses } from '@mui/x-data-grid-pro';
import { layout } from 'themes/layout';
import { colors, olympicsDesignColors } from 'themes/colors';
import { customGridClasses, ODD_OPACITY } from 'components';

export const StyledDataGridPro = styled(DataGridPro)<DataGridProProps>(({ theme }) => ({
  p: 2,
  borderRadius: layout.radius.sm,
  background: colors.neutral[100],
  ...theme.applyStyles('dark', {
    background: olympicsDesignColors.dark.general.backgroundLight,
  }),
  '& .MuiDataGrid-columnHeaders .MuiDataGrid-scrollbarFiller': {
    backgroundColor: theme.palette.grey[200],
  },
  '& .MuiDataGrid-columnHeader': {
    fontWeight: 500,
    borderBottom: `2px solid ${theme.palette.grey[400]}!important`,
    backgroundColor: '#F3F4F5',
    background: '#F3F4F5',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '15%',
      bottom: '15%',
      right: 0,
      width: '2px',
      backgroundColor: colors.neutral[100],
    },
    color: colors.neutral.black,
    ...theme.applyStyles('dark', {
      borderRightColor: theme.palette.grey[800],
      background: olympicsDesignColors.dark.general.background,
      color: colors.neutral.white,
    }),
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: theme.typography.body1.fontSize,

    paddingTop: '4px!important',
    paddingBottom: '4px!important',
  },
  '&.MuiDataGrid-filler': {
    background: colors.neutral.white,
    ...theme.applyStyles('dark', {
      borderRightColor: theme.palette.grey[800],
      background: theme.palette.grey[900],
    }),
    color: theme.palette.text.primary,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderBottomColor: '#f0f0f0',
    }),
  },
  '& .MuiCheckbox-root': {
    paddingTop: 0.1,
    paddingBottom: 0.1,
  },
  '& .MuiDataGrid-cell': {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    paddingTop: '4px',
    paddingBottom: '4px',
    alignContent: 'center',
    lineHeight: '20px',
  },
  '& .MuiTablePagination-root .MuiSelect-select': {
    borderRadius: layout.radius.md,
    border: `1px solid ${colors.neutral[400]}`,
    background: colors.neutral.white,
    textAlign: 'left',
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
      background: theme.palette.grey[900],
    }),
    '& .MuiSelect-icon': {
      color: colors.neutral[600],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[400],
      }),
    },
  },
  '& .MuiDataGrid-filler--pinnedLeft, & .MuiDataGrid-filler--pinnedRight': {
    backgroundColor: olympicsDesignColors.base.neutral.white,
    border: 'none',
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.base.neutral.black,
    }),
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
    backgroundColor: olympicsDesignColors.light.general.backgroundLight,
    ...theme.applyStyles('dark', {
      backgroundColor: olympicsDesignColors.dark.general.backgroundLight,
    }),
  },
  [`& .${gridClasses.row}.odd`]: {
    background: colors.neutral.white,
    ...theme.applyStyles('dark', {
      borderRightColor: theme.palette.grey[800],
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
