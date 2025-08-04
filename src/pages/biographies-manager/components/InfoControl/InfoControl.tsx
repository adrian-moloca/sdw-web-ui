import { Chip } from '@mui/material';

type Props = {
  data: any;
};

export const InfoControl = ({ data }: Props): React.ReactElement => {
  return (
    <Chip
      color="secondary"
      label={data.code}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: 16 }}
    />
  );
};
