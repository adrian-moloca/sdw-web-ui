import { Box, SvgIconTypeMap, SxProps, Theme, useTheme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { MainCard } from 'components/cards/MainCard';
import { grey } from '@mui/material/colors';

type Props = {
  id?: string;
  title?: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  children?: React.ReactElement | React.ReactElement[];
  avatar?: React.ReactElement | React.ReactElement[];
  sx?: SxProps<Theme>;
  icon?: OverridableComponent<SvgIconTypeMap>;
  ref?: React.RefObject<HTMLDivElement>;
};

export const SectionCard = ({
  id,
  title,
  avatar,
  defaultExpanded,
  subtitle,
  icon,
  ref,
  children,
  sx = {},
}: Props) => {
  const Icon = icon;
  const theme = useTheme();
  return (
    <MainCard
      ref={ref}
      id={id}
      title={title}
      subtitle={subtitle}
      avatar={avatar}
      defaultExpanded={defaultExpanded}
      expandable={true}
      sx={sx}
      contentSX={{ position: 'relative', px: theme.spacing(6), py: theme.spacing(4) }}
    >
      <>
        {children}
        {Icon && (
          <Box
            sx={{
              fontSize: 36,
              position: 'absolute',
              right: '-30px',
              bottom: '-40px',
              transform: 'rotate(-25deg)',
              color: grey[200],
              zIndex: 0,
            }}
          >
            <Icon sx={{ fontSize: 140, zIndex: -1 }} />
          </Box>
        )}
      </>
    </MainCard>
  );
};
