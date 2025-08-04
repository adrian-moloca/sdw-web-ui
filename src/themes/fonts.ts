// theme/fonts.ts
// Defines the typography styles for the Olympics Web Design System
/**
 * Helper function to retrieve a raw CSS variable value.
 * @param varName The name of the CSS variable (e.g., '--font-family-base')
 * @returns The CSS var() string (e.g., 'var(--font-family-base)')
 */
const getCSSVar = (varName: string): string => {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '';
};

/**
 * Helper function to retrieve a specific typography CSS variable.
 * @param type The type of typography (e.g., 'body1', 'quote', 'headline1')
 * @param property The CSS property (e.g., 'size', 'line-height')
 * @param breakpoint The breakpoint (e.g., 'desktop', 'mobile')
 * @returns The CSS var() string for the specific typography property
 */
export const getTypographyVar = (
  type: string,
  property: 'size' | 'line-height',
  breakpoint: 'desktop' | 'mobile'
): string => {
  return getCSSVar(`--font-${property}-${type}-${breakpoint}`);
};

export const fonts = {
  families: {
    base: getCSSVar('--font-family-base'),
    headline: getCSSVar('--font-family-headline'),
    secondary: getCSSVar('--font-family-secondary'),
  },
  sizes: {
    quote: {
      desktop: getTypographyVar('quote', 'size', 'desktop'),
      mobile: getTypographyVar('quote', 'size', 'mobile'),
    },
    deck: {
      desktop: getTypographyVar('deck', 'size', 'desktop'),
      mobile: getTypographyVar('deck', 'size', 'mobile'),
    },
    footer: {
      desktop: getTypographyVar('footer', 'size', 'desktop'),
      mobile: getTypographyVar('footer', 'size', 'mobile'),
    },
    footerBold: {
      desktop: getTypographyVar('footer-bold', 'size', 'desktop'),
      mobile: getTypographyVar('footer-bold', 'size', 'mobile'),
    },
    title1: {
      desktop: getTypographyVar('title1', 'size', 'desktop'),
      mobile: getTypographyVar('title1', 'size', 'mobile'),
    },
    title2: {
      desktop: getTypographyVar('title2', 'size', 'desktop'),
      mobile: getTypographyVar('title2', 'size', 'mobile'),
    },
    title3: {
      desktop: getTypographyVar('title3', 'size', 'desktop'),
      mobile: getTypographyVar('title3', 'size', 'mobile'),
    },
    headline1: {
      desktop: getTypographyVar('headline1', 'size', 'desktop'),
      mobile: getTypographyVar('headline1', 'size', 'mobile'),
    },
    headline2: {
      desktop: getTypographyVar('headline2', 'size', 'desktop'),
      mobile: getTypographyVar('headline2', 'size', 'mobile'),
    },
    headline3: {
      desktop: getTypographyVar('headline3', 'size', 'desktop'),
      mobile: getTypographyVar('headline3', 'size', 'mobile'),
    },
    headline4: {
      desktop: getTypographyVar('headline4', 'size', 'desktop'),
      mobile: getTypographyVar('headline4', 'size', 'mobile'),
    },
    body1: {
      desktop: getTypographyVar('body1', 'size', 'desktop'),
      mobile: getTypographyVar('body1', 'size', 'mobile'),
    },
    body2: {
      desktop: getTypographyVar('body2', 'size', 'desktop'),
      mobile: getTypographyVar('body2', 'size', 'mobile'),
    },
    caption1: {
      desktop: getTypographyVar('caption1', 'size', 'desktop'),
      mobile: getTypographyVar('caption1', 'size', 'mobile'),
    },
    caption2: {
      desktop: getTypographyVar('caption2', 'size', 'desktop'),
      mobile: getTypographyVar('caption2', 'size', 'mobile'),
    },
    buttonL: {
      desktop: getTypographyVar('button-l', 'size', 'desktop'),
      mobile: getTypographyVar('button-l', 'size', 'mobile'),
    },
    buttonS: {
      desktop: getTypographyVar('button-s', 'size', 'desktop'),
      mobile: getTypographyVar('button-s', 'size', 'mobile'),
    },
  },
  lineHeights: {
    quote: {
      desktop: getTypographyVar('quote', 'line-height', 'desktop'),
      mobile: getTypographyVar('quote', 'line-height', 'mobile'),
    },
    deck: {
      desktop: getTypographyVar('deck', 'line-height', 'desktop'),
      mobile: getTypographyVar('deck', 'line-height', 'mobile'),
    },
    footer: {
      desktop: getTypographyVar('footer', 'line-height', 'desktop'),
      mobile: getTypographyVar('footer', 'line-height', 'mobile'),
    },
    footerBold: {
      desktop: getTypographyVar('footer-bold', 'line-height', 'desktop'),
      mobile: getTypographyVar('footer-bold', 'line-height', 'mobile'),
    },
    title1: {
      desktop: getTypographyVar('title1', 'line-height', 'desktop'),
      mobile: getTypographyVar('title1', 'line-height', 'mobile'),
    },
    title2: {
      desktop: getTypographyVar('title2', 'line-height', 'desktop'),
      mobile: getTypographyVar('title2', 'line-height', 'mobile'),
    },
    title3: {
      desktop: getTypographyVar('title3', 'line-height', 'desktop'),
      mobile: getTypographyVar('title3', 'line-height', 'mobile'),
    },
    headline1: {
      desktop: getTypographyVar('headline1', 'line-height', 'desktop'),
      mobile: getTypographyVar('headline1', 'line-height', 'mobile'),
    },
    headline2: {
      desktop: getTypographyVar('headline2', 'line-height', 'desktop'),
      mobile: getTypographyVar('headline2', 'line-height', 'mobile'),
    },
    headline3: {
      desktop: getTypographyVar('headline3', 'line-height', 'desktop'),
      mobile: getTypographyVar('headline3', 'line-height', 'mobile'),
    },
    headline4: {
      desktop: getTypographyVar('headline4', 'line-height', 'desktop'),
      mobile: getTypographyVar('headline4', 'line-height', 'mobile'),
    },
    body1: {
      desktop: getTypographyVar('body1', 'line-height', 'desktop'),
      mobile: getTypographyVar('body1', 'line-height', 'mobile'),
    },
    body2: {
      desktop: getTypographyVar('body2', 'line-height', 'desktop'),
      mobile: getTypographyVar('body2', 'line-height', 'mobile'),
    },
    caption1: {
      desktop: getTypographyVar('caption1', 'line-height', 'desktop'),
      mobile: getTypographyVar('caption1', 'line-height', 'mobile'),
    },
    caption2: {
      desktop: getTypographyVar('caption2', 'line-height', 'desktop'),
      mobile: getTypographyVar('caption2', 'line-height', 'mobile'),
    },
    buttonL: {
      desktop: getTypographyVar('button-l', 'line-height', 'desktop'),
      mobile: getTypographyVar('button-l', 'line-height', 'mobile'),
    },
    buttonS: {
      desktop: getTypographyVar('button-s', 'line-height', 'desktop'),
      mobile: getTypographyVar('button-s', 'line-height', 'mobile'),
    },
  },
};
