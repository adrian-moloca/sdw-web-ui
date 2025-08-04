// Defines the color palette for the Olympics Web Design System,
// separating colors for light and dark themes, and including base colors.
// All colors are now fetched dynamically from CSS custom properties.

/**
 * Helper function to get a CSS variable value from the document.
 * This function should ideally be called after the DOM is loaded
 * and CSS is applied.
 * @param {string} varName The name of the CSS variable (e.g., '--color-base-brand-blue').
 * @returns {string | null} The value of the CSS variable, or null if not found.
 */
const getCSSVariable = (varName: string): string => {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '';
};

export const olympicsDesignColors = {
  // Base colors that are generally theme-agnostic
  base: {
    brand: {
      brandBlue: getCSSVariable('--color-base-brand-blue'),
      brandYellow: getCSSVariable('--color-base-brand-yellow'),
      brandGreen: getCSSVariable('--color-base-brand-green'),
      brandRed: getCSSVariable('--color-base-brand-red'),
    },
    neutral: {
      black: getCSSVariable('--color-base-neutral-black'),
      grey900: getCSSVariable('--color-base-neutral-grey900'),
      grey800: getCSSVariable('--color-base-neutral-grey800'),
      grey700: getCSSVariable('--color-base-neutral-grey700'),
      grey600: getCSSVariable('--color-base-neutral-grey600'),
      grey500: getCSSVariable('--color-base-neutral-grey500'),
      grey400: getCSSVariable('--color-base-neutral-grey400'),
      grey300: getCSSVariable('--color-base-neutral-grey300'),
      grey200: getCSSVariable('--color-base-neutral-grey200'),
      grey100: getCSSVariable('--color-base-neutral-grey100'),
      grey50: getCSSVariable('--color-base-neutral-grey50'),
      white: getCSSVariable('--color-base-neutral-white'),
    },
    medals: {
      textBronze: getCSSVariable('--color-base-medals-textBronze'),
      textSilver: getCSSVariable('--color-base-medals-textSilver'),
      textGold: getCSSVariable('--color-base-medals-textGold'),
    },
  },
  light: {
    general: {
      background: getCSSVariable('--color-light-general-background'),
      surface: getCSSVariable('--color-light-general-surface'),
      surfaceVariant: getCSSVariable('--color-light-general-surfaceVariant'),
      divider: getCSSVariable('--color-light-general-divider'),
      accent: getCSSVariable('--color-light-general-accent'),
      onAccent: getCSSVariable('--color-light-general-onAccent'),
      fixedNavStroke: getCSSVariable('--color-light-general-fixedNavStroke'),
      backgroundLight: getCSSVariable('--color-light-general-background-light'),
    },
    text: {
      primary: getCSSVariable('--color-light-text-primary'),
      secondary: getCSSVariable('--color-light-text-secondary'),
    },
    button: {
      primary: getCSSVariable('--color-light-button-primary'),
      onPrimary: getCSSVariable('--color-light-button-onPrimary'),
      secondary: getCSSVariable('--color-light-button-secondary'),
      onSecondary: getCSSVariable('--color-light-button-onSecondary'),
      disabled: getCSSVariable('--color-light-button-disabled'),
      onDisabled: getCSSVariable('--color-light-button-onDisabled'),
      hover: getCSSVariable('--color-light-button-hover'),
      iconSelected: getCSSVariable('--color-light-button-iconSelected'),
    },
    input: {
      default: getCSSVariable('--color-light-input-default'),
      outline: getCSSVariable('--color-light-input-outline'),
      disabled: getCSSVariable('--color-light-input-disabled'),
      onDisabled: getCSSVariable('--color-light-input-onDisabled'),
    },
    icon: {
      primary: getCSSVariable('--color-light-icon-primary'),
      secondary: getCSSVariable('--color-light-icon-secondary'),
    },
    controls: {
      off: getCSSVariable('--color-light-controls-off'),
    },
    semantic: {
      error: getCSSVariable('--color-light-semantic-error'),
      errorOnContainer: getCSSVariable('--color-light-semantic-errorOnContainer'),
      errorContainer: getCSSVariable('--color-light-semantic-errorContainer'),
      success: getCSSVariable('--color-light-semantic-success'),
      successOnContainer: getCSSVariable('--color-light-semantic-successOnContainer'),
      successContainer: getCSSVariable('--color-light-semantic-successContainer'),
      warning: getCSSVariable('--color-light-semantic-warning'),
      warningOnContainer: getCSSVariable('--color-light-semantic-warningOnContainer'),
      warningContainer: getCSSVariable('--color-light-semantic-warningContainer'),
    },
  },
  dark: {
    general: {
      background: getCSSVariable('--color-dark-general-background'),
      surface: getCSSVariable('--color-dark-general-surface'),
      surfaceVariant: getCSSVariable('--color-dark-general-surfaceVariant'),
      divider: getCSSVariable('--color-dark-general-divider'),
      accent: getCSSVariable('--color-dark-general-accent'),
      onAccent: getCSSVariable('--color-dark-general-onAccent'),
      fixedNavStroke: getCSSVariable('--color-dark-general-fixedNavStroke'),
      backgroundLight: getCSSVariable('--color-dark-general-background-light'),
    },
    text: {
      primary: getCSSVariable('--color-dark-text-primary'),
      secondary: getCSSVariable('--color-dark-text-secondary'),
    },
    button: {
      primary: getCSSVariable('--color-dark-button-primary'),
      onPrimary: getCSSVariable('--color-dark-button-onPrimary'),
      secondary: getCSSVariable('--color-dark-button-secondary'),
      onSecondary: getCSSVariable('--color-dark-button-onSecondary'),
      disabled: getCSSVariable('--color-dark-button-disabled'),
      onDisabled: getCSSVariable('--color-dark-button-onDisabled'),
      hover: getCSSVariable('--color-dark-button-hover'),
      iconSelected: getCSSVariable('--color-dark-button-iconSelected'),
    },
    input: {
      default: getCSSVariable('--color-dark-input-default'),
      outline: getCSSVariable('--color-dark-input-outline'),
      disabled: getCSSVariable('--color-dark-input-disabled'),
      onDisabled: getCSSVariable('--color-dark-input-onDisabled'),
    },
    icon: {
      primary: getCSSVariable('--color-dark-icon-primary'),
      secondary: getCSSVariable('--color-dark-icon-secondary'),
    },
    controls: {
      off: getCSSVariable('--color-dark-controls-off'),
    },
    semantic: {
      error: getCSSVariable('--color-dark-semantic-error'),
      errorOnContainer: getCSSVariable('--color-dark-semantic-errorOnContainer'),
      errorContainer: getCSSVariable('--color-dark-semantic-errorContainer'),
      success: getCSSVariable('--color-dark-semantic-success'),
      successOnContainer: getCSSVariable('--color-dark-semantic-successOnContainer'),
      successContainer: getCSSVariable('--color-dark-semantic-successContainer'),
      warning: getCSSVariable('--color-dark-semantic-warning'),
      warningOnContainer: getCSSVariable('--color-dark-semantic-warningOnContainer'),
      warningContainer: getCSSVariable('--color-dark-semantic-warningContainer'),
    },
  },
};
export const OlympicColors = {
  BLUE: olympicsDesignColors.base.brand.brandBlue,
  YELLOW: olympicsDesignColors.base.brand.brandYellow,
  GREEN: olympicsDesignColors.base.brand.brandGreen,
  RED: olympicsDesignColors.base.brand.brandRed,
};

export const colors = {
  blue: {
    100: getCSSVariable('--blue-100'),
    200: getCSSVariable('--blue-200'),
    300: getCSSVariable('--blue-300'),
    400: getCSSVariable('--blue-400'),
    500: getCSSVariable('--blue-500'),
    600: getCSSVariable('--blue-600'),
  },
  yellow: {
    100: getCSSVariable('--yellow-100'),
    200: getCSSVariable('--yellow-200'),
    300: getCSSVariable('--yellow-300'),
    400: getCSSVariable('--yellow-400'),
    500: getCSSVariable('--yellow-500'),
    600: getCSSVariable('--yellow-600'),
  },
  green: {
    100: getCSSVariable('--green-100'),
    200: getCSSVariable('--green-200'),
    300: getCSSVariable('--green-300'),
    400: getCSSVariable('--green-400'),
    500: getCSSVariable('--green-500'),
    600: getCSSVariable('--green-600'),
  },
  red: {
    100: getCSSVariable('--red-100'),
    200: getCSSVariable('--red-200'),
    300: getCSSVariable('--red-300'),
    400: getCSSVariable('--red-400'),
    500: getCSSVariable('--red-500'),
    600: getCSSVariable('--red-600'),
  },
  neutral: {
    50: getCSSVariable('--neutral-50'),
    100: getCSSVariable('--neutral-100'),
    200: getCSSVariable('--neutral-200'),
    300: getCSSVariable('--neutral-300'),
    400: getCSSVariable('--neutral-400'),
    500: getCSSVariable('--neutral-500'),
    600: getCSSVariable('--neutral-600'),
    700: getCSSVariable('--neutral-700'),
    800: getCSSVariable('--neutral-800'),
    900: getCSSVariable('--neutral-900'),
    white: getCSSVariable('--neutral-white'),
    black: getCSSVariable('--neutral-black'),
  },
  font: {
    dark: getCSSVariable('--font-dark'),
    darkMedium: getCSSVariable('--font-dark-medium'),
    darkSoft: getCSSVariable('--font-dark-soft'),
    light: getCSSVariable('--font-light'),
  },
};
