// material-ui
import { Box, useTheme } from '@mui/material';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  const theme = useTheme();
  return (
    <Box sx={{ position: 'absolute', zIndex: -1, bottom: 0 }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="100%"
        height="calc(100vh - 175px)"
        preserveAspectRatio="none"
        viewBox="0 0 1440 560"
      >
        <g mask='url("#SvgjsMask1007")' fill="none">
          <path
            d="M587.16 619.39C728.25 598.72 771.72 286.87 1033.91 264.76 1296.11 242.65 1358.22 67.76 1480.67 63.16"
            stroke={theme.palette.primary.light}
            strokeWidth="2"
          ></path>
          <path
            d="M529.69 630.78C689.95 595.68 755.39 177.86 1001.71 174.86 1248.03 171.86 1348.03 345.74 1473.73 348.46"
            stroke={theme.palette.primary.dark}
            strokeWidth="2"
          ></path>
          <path
            d="M562.98 628.77C732.69 592.36 802.95 152.26 1064.88 149.06 1326.82 145.86 1433.58 325.6 1566.79 328.26"
            stroke={theme.palette.primary.main}
            strokeWidth="2"
          ></path>
          <path
            d="M326.62 632.37C448.62 624.64 536.5 396.35 754.43 395.57 972.36 394.79 968.34 465.57 1182.24 465.57 1396.15 465.57 1501.68 395.8 1610.05 395.57"
            stroke={theme.palette.primary.light}
            strokeWidth="2"
          ></path>
          <path
            d="M793.44 596.87C896.68 596.81 984.46 558.31 1204.09 553.09 1423.71 547.87 1492.58 295.89 1614.73 284.29"
            stroke={theme.palette.primary.main}
            strokeWidth="2"
          ></path>
        </g>
      </svg>
    </Box>
  );
};

export default AuthBackground;
