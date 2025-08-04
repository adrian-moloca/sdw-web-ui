import { LinearProgress, TableCell, TableRow } from '@mui/material';

type Props = {
  loading: boolean;
};

export const GenericTableLoadingPanel = ({ loading }: Props) => {
  if (!loading) return null;

  return (
    <TableRow
      sx={{
        backgroundColor: 'transparent',
        width: '100%',
        p: 1,
        m: 0,
      }}
    >
      <TableCell colSpan={100}>
        <LinearProgress />
      </TableCell>
    </TableRow>
  );
};
