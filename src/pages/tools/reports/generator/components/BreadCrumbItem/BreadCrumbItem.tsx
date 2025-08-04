import { Typography } from '@mui/material';
import type { BreadcrumbItem } from 'types/tools';
import { LinkRouter } from '../';

type Props = {
  data: BreadcrumbItem;
};

const linkSX = {
  display: 'flex',
  textDecoration: 'none',
  alignContent: 'center',
  alignItems: 'center',
};

export const BreadCrumbItem = ({ data }: Props) => {
  if (data.to)
    return (
      <Typography
        component={LinkRouter}
        to={data.to}
        color="inherit"
        underline="hover"
        variant="body1"
        sx={linkSX}
      >
        {data.title}
      </Typography>
    );

  return (
    <Typography color="inherit" variant="body1">
      {data.title}
    </Typography>
  );
};
