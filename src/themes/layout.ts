// theme/layout.ts

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const layout = {
  spacing: {
    none: getCSSVar('--spacing-none'),
    1: getCSSVar('--spacing-1'),
    2: getCSSVar('--spacing-2'),
    3: getCSSVar('--spacing-3'),
    4: getCSSVar('--spacing-4'),
    5: getCSSVar('--spacing-5'),
    6: getCSSVar('--spacing-6'),
    7: getCSSVar('--spacing-7'),
    8: getCSSVar('--spacing-8'),
  },
  radius: {
    none: getCSSVar('--radius-none'),
    xs: getCSSVar('--radius-xs'),
    sm: getCSSVar('--radius-sm'),
    md: getCSSVar('--radius-md'),
    lg: getCSSVar('--radius-lg'),
    xl: getCSSVar('--radius-xl'),
    '2xl': getCSSVar('--radius-2xl'),
  },
  shadows: {
    sm: getCSSVar('--box-shadow-sm'),
    md: getCSSVar('--box-shadow-md'),
    lg: getCSSVar('--box-shadow-lg'),
    xl: getCSSVar('--box-shadow-xl'),
  },
  zIndex: {
    overtop: parseInt(getCSSVar('--z-overtop'), 10),
    modalContent: parseInt(getCSSVar('--z-modal-content'), 10),
    modalOverlay: parseInt(getCSSVar('--z-modal-overlay'), 10),
    super: parseInt(getCSSVar('--z-super'), 10),
    above: parseInt(getCSSVar('--z-above'), 10),
    overDefault: parseInt(getCSSVar('--z-over-default'), 10),
    default: parseInt(getCSSVar('--z-default'), 10),
    zero: parseInt(getCSSVar('--z-zero'), 10),
    below: parseInt(getCSSVar('--z-below'), 10),
  },
  breakpoints: {
    s: getCSSVar('--breakpoint-s'),
    m: getCSSVar('--breakpoint-m'),
    md: getCSSVar('--breakpoint-md'),
    l: getCSSVar('--breakpoint-l'),
  },
};
