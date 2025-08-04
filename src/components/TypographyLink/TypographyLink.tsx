import { SxProps, Theme, Typography, TypographyVariant, useColorScheme } from '@mui/material';
import { Nullable } from 'models';
import { Link as RouteLink } from 'react-router-dom';
interface Props {
  value: string;
  route?: Nullable<string>;
  onClick?: () => void;
  direct?: boolean;
  sx?: SxProps<Theme>;
  typoSize?: TypographyVariant;
}
export const TypographyLink = ({ value, route, onClick, typoSize, direct, sx }: Props) => {
  const { mode } = useColorScheme();
  const commonStyles: SxProps<Theme> = {
    lineHeight: 1.2,
    textDecoration: 'none',
    color: mode === 'dark' ? 'white' : 'black',
    transition: 'text-decoration-color 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
      textDecorationStyle: 'dotted',
      textUnderlineOffset: '4px',
    },
    ...sx,
  };
  if (onClick)
    return (
      <Typography variant={typoSize} title={value} onClick={onClick} sx={{ ...commonStyles }}>
        {value}
      </Typography>
    );
  if (!route)
    return (
      <Typography
        variant={typoSize}
        title={value}
        sx={{
          lineHeight: 1.2,
          ...sx,
        }}
      >
        {value}
      </Typography>
    );
  if (direct === true)
    return (
      <Typography
        variant={typoSize}
        component={RouteLink}
        to={route}
        title={value}
        sx={{ ...commonStyles }}
      >
        {value}
      </Typography>
    );
  return (
    <Typography
      variant={typoSize}
      component={RouteLink}
      to={route}
      title={value}
      target="_blank"
      rel="noreferrer"
      sx={{ ...commonStyles }}
    >
      {value}
    </Typography>
  );
};
