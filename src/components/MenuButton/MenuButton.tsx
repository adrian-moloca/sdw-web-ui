import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Box, CardActionArea, SvgIconTypeMap, Typography, useTheme } from '@mui/material';
import { MainCard } from '../cards';

type Props = {
  icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
  title: string;
  subtitle: string;
  onClick: () => void;
};

export const MenuButton = ({ icon, title, subtitle, onClick }: Props) => {
  const Icon = icon;
  const theme = useTheme();

  return (
    <MainCard
      sx={{ position: 'relative', minHeight: 100, background: 'transparent' }}
      border={true}
      boxShadow={true}
      divider={false}
      fullHeight
    >
      <CardActionArea onClick={onClick} sx={{ p: 2, minHeight: 90, background: 'transparent' }}>
        <Typography variant="h5" sx={{ zIndex: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1">{subtitle}</Typography>
      </CardActionArea>
      <Box
        sx={{
          fontSize: 36,
          position: 'absolute',
          right: '-8px',
          bottom: '-20px',
          transform: 'rotate(-25deg)',
          color: theme.palette.divider,
        }}
      >
        <Icon sx={{ fontSize: 90 }} />
      </Box>
    </MainCard>
  );
};
