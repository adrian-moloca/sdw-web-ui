import { Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

type Props = {
  title: string;
};

export const Feature = ({ title, ...props }: Props) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        transition: 'transform .3s',
        '&:hover': {
          transform: 'translateX(5px)',
          '& .MuiTypography-root': {
            color: (theme) => theme.palette.secondary.dark,
          },
        },
      }}
      {...props}
    >
      <CheckIcon color="primary" fontSize="small" />
      <Typography variant="body2">{title}</Typography>
    </Stack>
  );
};
