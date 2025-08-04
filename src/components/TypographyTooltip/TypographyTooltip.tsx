import { SxProps, Theme, Tooltip, Typography } from '@mui/material';
import { Nullable } from 'models';
interface Props {
  value: string;
  tooltip?: Nullable<string>;
  sx?: SxProps<Theme>;
  typoSize?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit';
}
export const TypographyTooltip = ({ value, typoSize, tooltip, sx }: Props) => {
  if (!tooltip)
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

  return (
    <Tooltip title={tooltip ?? value}>
      <Typography
        variant={typoSize}
        sx={{
          lineHeight: 1.2,
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'text-decoration-color 0.2s ease-in-out',
          '&:hover': {
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            textUnderlineOffset: '4px', // optional: spacing between text and underline
          },
          ...sx,
        }}
      >
        {value}
      </Typography>
    </Tooltip>
  );
};
