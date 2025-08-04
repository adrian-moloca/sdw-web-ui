import { LinearProgress, Paper } from '@mui/material';

type Props = {
  loading: boolean;
};
export const GenericLoadingPanel = ({ loading }: Props) => {
  if (!loading) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        width: '100%',
        p: 1,
        m: 0,
      }}
    >
      <LinearProgress />
    </Paper>
  );
};
