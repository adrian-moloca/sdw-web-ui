import Skeleton from '@mui/material/Skeleton';

export const ImagePlaceholder = ({ ...others }) => (
  <Skeleton variant="rectangular" {...others} animation="wave" />
);
