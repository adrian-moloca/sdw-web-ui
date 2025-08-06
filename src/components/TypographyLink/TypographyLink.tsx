import { SxProps, Theme, Typography, TypographyVariant, useColorScheme } from '@mui/material';
import { Nullable } from 'models';
import { Link as RouteLink } from 'react-router-dom';
interface Props {
  value: string | string[];
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
  const title = Array.isArray(value) ? value.join('-') : value;
  if (onClick)
    return (
      <Typography
        variant={typoSize}
        title={title}
        onClick={onClick}
        sx={{ ...commonStyles, whiteSpace: 'pre-line' }}
      >
        {Array.isArray(value) ? value.join('\n') : value}
      </Typography>
    );
  if (!route)
    return (
      <Typography
        variant={typoSize}
        title={title}
        sx={{
          ...sx,
          whiteSpace: 'pre-line',
        }}
      >
        {Array.isArray(value) ? value.join('\n') : value}
      </Typography>
    );
  if (direct === true)
    return (
      <Typography
        variant={typoSize}
        component={RouteLink}
        to={route}
        title={title}
        sx={{ ...commonStyles, whiteSpace: 'pre-line' }}
      >
        {Array.isArray(value) ? value.join('\n') : value}
      </Typography>
    );
  return (
    <Typography
      variant={typoSize}
      component={RouteLink}
      to={route}
      title={title}
      target="_blank"
      rel="noreferrer"
      sx={{ ...commonStyles, whiteSpace: 'pre-line' }}
    >
      {Array.isArray(value) ? value.join('\n') : value}
    </Typography>
  );
};
