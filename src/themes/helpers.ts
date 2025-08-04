// A helper function to create a palette object with main, light, dark, and contrastText
import { darken, lighten } from '@mui/system';
import { olympicsDesignColors } from './colors';
import { PaletteOptions, PaletteMode } from '@mui/material';

// based on the olympicsColors structure.
export const createOlympicPalette = (mode: PaletteMode): PaletteOptions => {
  const colors = olympicsDesignColors[mode]; // 'light' or 'dark' color set
  const baseColors = olympicsDesignColors.base; // Base colors (theme-agnostic)

  return {
    mode, // Sets the theme mode (light/dark)
    primary: {
      main: colors.general.accent,
      light: lighten(colors.general.accent, 0.5),
      dark: darken(colors.general.accent, 0.3),
    },
    secondary: {
      main: colors.button.secondary,
      light: lighten(colors.button.secondary, 0.5),
      dark: darken(colors.button.secondary, 0.5),
    },
    error: {
      main: colors.semantic.error,
      light: colors.semantic.errorContainer,
      dark: darken(colors.semantic.error, 0.5),
      contrastText: colors.semantic.errorOnContainer,
    },
    warning: {
      main: colors.semantic.warning,
      light: colors.semantic.warningContainer,
      dark: darken(colors.semantic.warning, 0.5),
      contrastText: colors.semantic.warningOnContainer,
    },
    info: {
      main: colors.general.accent,
      light: lighten(colors.general.accent, 0.5),
      dark: darken(colors.general.accent, 0.5),
      contrastText: colors.button.onPrimary,
    },
    success: {
      main: colors.semantic.success,
      light: colors.semantic.successContainer,
      dark: darken(colors.semantic.success, 0.5),
      contrastText: colors.semantic.successOnContainer,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.button.onDisabled,
    },
    background: {
      paper: colors.general.background,
      default: colors.general.surface,
    },
    common: {
      black: baseColors.neutral.black,
      white: baseColors.neutral.white,
    },
    grey: {
      50: baseColors.neutral.grey50,
      100: baseColors.neutral.grey100,
      200: baseColors.neutral.grey200,
      300: baseColors.neutral.grey300,
      400: baseColors.neutral.grey400,
      500: baseColors.neutral.grey500,
      600: baseColors.neutral.grey600,
      700: baseColors.neutral.grey700,
      800: baseColors.neutral.grey800,
      900: baseColors.neutral.grey900,
    },
    divider: colors.general.divider,
    // Custom Olympics Design System specific colors (beyond standard MUI palette)
    // These allow direct access to properties not mapped to MUI's default structure.
    olympics: {
      general: {
        surfaceVariant: colors.general.surfaceVariant,
        fixedNavStroke: colors.general.fixedNavStroke,
      },
      button: {
        hover: colors.button.hover,
        iconSelected: colors.button.iconSelected,
        disabled: colors.button.disabled,
      },
      input: {
        default: colors.input.default,
        outline: colors.input.outline,
        disabled: colors.input.disabled,
        onDisabled: colors.input.onDisabled,
      },
      icon: {
        primary: colors.icon.primary,
        secondary: colors.icon.secondary,
        disabled: colors.button.disabled,
      },
      controls: {
        off: colors.controls.off,
      },
      semantic: {
        errorOnContainer: colors.semantic.errorOnContainer,
        errorContainer: colors.semantic.errorContainer,
        successOnContainer: colors.semantic.successOnContainer,
        successContainer: colors.semantic.successContainer,
        warningOnContainer: colors.semantic.warningOnContainer,
        warningContainer: colors.semantic.warningContainer,
      },
      base: baseColors,
    },
  };
};
