import { createTheme } from '@mui/material';
import { fonts } from './fonts';
import { layout } from './layout';
import { createOlympicPalette } from './helpers';

// Step 1: Define a base theme to get access to breakpoints
const baseTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  defaultColorScheme: 'light',
  colorSchemes: {
    light: { palette: createOlympicPalette('light') },
    dark: { palette: createOlympicPalette('dark') },
  },
  spacing: (factor: number) => `${0.25 * factor}rem`,
  breakpoints: {
    values: {
      xs: 0, // Still required by MUI, even if not used
      sm: 768, // small starts at 768
      md: 1024, // medium starts at 1024
      lg: 1440, // large starts at 1440
      xl: 1600, // optional: define >1440 explicitly
    },
  },
});
export const toolpadTheme = createTheme(baseTheme, {
  typography: {
    fontFamily: fonts.families.base,
    h1: {
      fontFamily: fonts.families.headline,
      fontSize: fonts.sizes.title1.desktop,
      fontWeight: 'bold',
      lineHeight: fonts.lineHeights.title1.desktop,
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.title1.mobile,
        lineHeight: fonts.lineHeights.title1.mobile,
      },
    },
    h2: {
      fontFamily: fonts.families.headline,
      fontWeight: 'bold',
      fontSize: fonts.sizes.title2.desktop,
      lineHeight: fonts.lineHeights.title2.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.title2.mobile,
        lineHeight: fonts.lineHeights.title2.mobile,
      },
    },
    h3: {
      fontFamily: fonts.families.secondary,
      fontWeight: 'bold',
      fontSize: fonts.sizes.title3.desktop,
      lineHeight: fonts.lineHeights.title3.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.title3.mobile,
        lineHeight: fonts.lineHeights.title3.mobile,
      },
    },
    h4: {
      fontFamily: fonts.families.base,
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline1.desktop,
      lineHeight: fonts.lineHeights.headline1.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline1.mobile,
        lineHeight: fonts.lineHeights.headline1.mobile,
      },
    },
    h5: {
      fontFamily: fonts.families.base, // Uses Olympic Sans for Headline 3
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline2.desktop,
      lineHeight: fonts.lineHeights.headline2.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline2.mobile,
        lineHeight: fonts.lineHeights.headline2.mobile,
      },
    },
    h6: {
      fontFamily: fonts.families.base, // Uses Olympic Sans for Headline 4
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline3.desktop,
      lineHeight: fonts.lineHeights.headline3.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline3.mobile,
        lineHeight: fonts.lineHeights.headline4.mobile,
      },
    },
    h7: {
      fontFamily: fonts.families.base, // Uses Olympic Sans for Headline 4
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline4.desktop,
      lineHeight: fonts.lineHeights.headline4.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline4.mobile,
        lineHeight: fonts.lineHeights.headline4.mobile,
      },
    },

    subtitle1: {
      fontFamily: fonts.families.base,
      fontWeight: 'normal',
      fontSize: fonts.sizes.footer.desktop,
      lineHeight: fonts.lineHeights.footer.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.footer.mobile,
        lineHeight: fonts.lineHeights.footer.mobile,
      },
    },
    subtitle2: {
      fontFamily: fonts.families.base,
      fontWeight: 'normal',
      fontSize: fonts.sizes.footer.mobile,
      lineHeight: fonts.lineHeights.footer.mobile,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.footer.mobile,
        lineHeight: fonts.lineHeights.footer.mobile,
      },
    },
    body1: {
      fontFamily: fonts.families.base,
      fontWeight: 'normal',
      fontSize: fonts.sizes.body1.desktop,
      lineHeight: fonts.lineHeights.body1.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.body1.mobile,
        lineHeight: fonts.lineHeights.body1.mobile,
      },
    },

    body2: {
      fontFamily: fonts.families.base,
      fontWeight: 'normal',
      fontSize: fonts.sizes.body2.desktop,
      lineHeight: fonts.lineHeights.body2.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.body2.mobile,
        lineHeight: fonts.lineHeights.body2.mobile,
      },
    },

    caption: {
      fontFamily: fonts.families.base,
      fontWeight: 'normal',
      fontSize: fonts.sizes.caption1.desktop,
      lineHeight: fonts.lineHeights.caption1.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.caption1.mobile,
        lineHeight: fonts.lineHeights.caption1.mobile,
      },
    },

    button: {
      fontFamily: fonts.families.base,
      fontWeight: 'bold',
      fontSize: fonts.sizes.buttonL.desktop,
      lineHeight: fonts.lineHeights.buttonL.desktop,
      letterSpacing: '0',
      textTransform: 'none',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.buttonL.mobile,
        lineHeight: fonts.lineHeights.buttonL.mobile,
      },
    },

    footer: {
      fontFamily: fonts.families.base,
      fontWeight: 'bold',
      fontSize: fonts.sizes.footer.desktop,
      lineHeight: fonts.lineHeights.footer.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.footer.mobile,
        lineHeight: fonts.lineHeights.footer.mobile,
      },
    },
    body1bold: {
      fontFamily: fonts.families.base,
      fontWeight: 'bold',
      fontSize: fonts.sizes.body1.desktop,
      lineHeight: fonts.lineHeights.body1.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.body1.mobile,
        lineHeight: fonts.lineHeights.body1.mobile,
      },
    },
    quote: {
      fontFamily: fonts.families.secondary,
      fontWeight: 'normal',
      fontSize: fonts.sizes.quote.desktop,
      lineHeight: fonts.lineHeights.quote.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.quote.mobile,
        lineHeight: fonts.lineHeights.quote.mobile,
      },
    },
    deck: {
      fontFamily: fonts.families.base,
      fontWeight: 'bold',
      fontSize: fonts.sizes.deck.desktop,
      lineHeight: fonts.lineHeights.deck.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.deck.mobile,
        lineHeight: fonts.lineHeights.deck.mobile,
      },
    },
    // Titles (mapped to h1, h2, h3 implicitly via default overrides below)
    title1: {
      fontFamily: fonts.families.headline, // Olympic Headline
      fontWeight: 'normal',
      fontSize: fonts.sizes.title1.desktop,
      lineHeight: fonts.lineHeights.title1.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.title1.mobile,
        lineHeight: fonts.lineHeights.title1.mobile,
      },
    },
    title2: {
      fontFamily: fonts.families.headline, // Olympic Headline
      fontWeight: 'normal',
      fontSize: fonts.sizes.title2.desktop,
      lineHeight: fonts.lineHeights.title2.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.title2.mobile,
        lineHeight: fonts.lineHeights.title2.mobile,
      },
    },
    title3: {
      fontFamily: fonts.families.headline, // Olympic Headline
      fontWeight: 'normal',
      fontSize: fonts.sizes.title3.desktop,
      lineHeight: fonts.lineHeights.title3.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.title3.mobile,
        lineHeight: fonts.lineHeights.title3.mobile,
      },
    },

    // Headlines (mapped to h3, h4, h5, h6 implicitly via default overrides below)
    headline1: {
      fontFamily: fonts.families.secondary, // Olympic Serif
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline1.desktop,
      lineHeight: fonts.lineHeights.headline1.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline1.mobile,
        lineHeight: fonts.lineHeights.headline1.mobile,
      },
    },
    headline2: {
      fontFamily: fonts.families.base, // Olympic Sans
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline2.desktop,
      lineHeight: fonts.lineHeights.headline2.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline2.mobile,
        lineHeight: fonts.lineHeights.headline2.mobile,
      },
    },
    headline3: {
      fontFamily: fonts.families.base, // Olympic Sans
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline3.desktop,
      lineHeight: fonts.lineHeights.headline3.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline3.mobile,
        lineHeight: fonts.lineHeights.headline3.mobile,
      },
    },
    headline4: {
      fontFamily: fonts.families.base, // Olympic Sans
      fontWeight: 'bold',
      fontSize: fonts.sizes.headline4.desktop,
      lineHeight: fonts.lineHeights.headline4.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.headline4.mobile,
        lineHeight: fonts.lineHeights.headline4.mobile,
      },
    },
    caption2: {
      fontFamily: fonts.families.base, // Olympic Sans
      fontWeight: 'bold',
      fontSize: fonts.sizes.caption2.desktop,
      lineHeight: fonts.lineHeights.caption2.desktop,
      letterSpacing: '0',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: fonts.sizes.caption2.mobile,
        lineHeight: fonts.lineHeights.caption2.mobile,
      },
    },
    commonAvatar: {
      cursor: 'pointer',
      borderRadius: '8px',
      fontFamily: 'Olympic Sans',
    },
    headerAvatar: {
      cursor: 'pointer',
      borderRadius: '6px',
      borderWidth: '1px',
      borderStyle: 'solid',
      fontFamily: 'Olympic Sans',
    },
    smallAvatar: {
      width: '20px',
      height: '20px',
      fontSize: '1rem',
    },
    buttonAvatar: {
      width: '32px',
      height: '32px',
      fontSize: '1.2rem',
    },
    buttonHeaderAvatar: {
      width: '40px',
      height: '40px',
      fontSize: '1.2rem',
    },
    mediumAvatar: {
      width: '46px',
      height: '46px',
      fontSize: '1.6rem',
    },
    kpiAvatar: {
      width: '62px',
      height: '62px',
      fontSize: '1.8rem',
    },
    largeAvatar: {
      width: '60px',
      height: '60px',
      fontSize: '2rem',
    },
    xlargeAvatar: {
      width: '82px',
      height: '82px',
      fontSize: '2rem',
    },
    imageAvatar: {
      width: '130px',
      height: '130px',
      fontSize: '2rem',
    },
  },
  components: {
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: fonts.sizes.body2.desktop,
          fontWeight: '400!important',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: layout.radius.md,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          borderRadius: layout.radius.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: layout.radius.sm,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: baseTheme.spacing(2),
          '&:last-child': {
            paddingBottom: baseTheme.spacing(2),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: layout.radius.sm,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontSize: fonts.sizes.body1.desktop,
          fontFamily: fonts.families.base,
          fontWeight: '400!important',
        },
        primary: {
          fontSize: fonts.sizes.body1.desktop,
          fontFamily: fonts.families.base,
          fontWeight: '400!important',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          padding: '6px 24px!important',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '8px 8px!important',
          '&:hover': {
            backgroundColor: baseTheme.palette.action.hover,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: fonts.families.base,
          fontSize: fonts.sizes.buttonL.desktop,
          height: '36px',
          fontWeight: 'normal',
          borderRadius: layout.radius.xl,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: baseTheme.palette.primary.main,
          color: baseTheme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: baseTheme.palette.primary.dark,
          },
          '&:disabled': {
            backgroundColor: baseTheme.palette.olympics.button.hover,
            color: baseTheme.palette.olympics.button.disabled,
          },
        },
        containedSecondary: {
          backgroundColor: baseTheme.palette.secondary.main,
          color: baseTheme.palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: baseTheme.palette.secondary.dark,
          },
          '&:disabled': {
            backgroundColor: baseTheme.palette.olympics.button.disabled,
            color: baseTheme.palette.olympics.button.disabled,
          },
        },
        textPrimary: {
          color: baseTheme.palette.primary.main,
          '&:hover': {
            backgroundColor: baseTheme.palette.action.hover, // MUI default hover for text buttons
            color: baseTheme.palette.primary.dark,
          },
        },
        textSecondary: {
          color: baseTheme.palette.secondary.main,
          '&:hover': {
            backgroundColor: baseTheme.palette.action.hover,
            color: baseTheme.palette.secondary.dark,
          },
        },
        outlinedPrimary: {
          borderColor: baseTheme.palette.primary.main,
          color: baseTheme.palette.primary.main,
          '&:hover': {
            borderColor: baseTheme.palette.primary.dark,
            color: baseTheme.palette.primary.dark,
            backgroundColor: baseTheme.palette.action.hover,
          },
        },
        outlinedSecondary: {
          borderColor: baseTheme.palette.secondary.dark,
          color: baseTheme.palette.secondary.dark,
          '&:hover': {
            borderColor: baseTheme.palette.secondary.dark,
            color: baseTheme.palette.secondary.dark,
            backgroundColor: baseTheme.palette.action.hover,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: '2px',
          marginLeft: '4px',
          lineHeight: '1.1',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '3px 4px',
          fontSize: fonts.sizes.body1.desktop,
          fontFamily: fonts.families.base,
          lineHeight: '1!important',
        },
        sizeSmall: {
          padding: '2px 6px',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        labelContainer: {
          '.MuiStepLabel-label': {
            fontFamily: fonts.families.headline,
            fontSize: '1.2rem',
          },
        },
        iconContainer: {
          '.MuiStepIcon-text': {
            fontFamily: fonts.families.headline,
            fontSize: fonts.sizes.body1.desktop,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 'normal',
          fontSize: fonts.sizes.footer.desktop,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '.MuiTypography-caption': {
            opacity: 0.6,
            //fontSize: '8px!important',
            //color: 'text.secondary',
          },
        },
      },
    },
  },
});
