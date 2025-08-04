import { TableCell } from '@mui/material';
import Diversity3Outlined from '@mui/icons-material/Diversity3Outlined';
import ManOutlined from '@mui/icons-material/ManOutlined';

type Props = {
  data: any;
};

export const TeamCell = (props: Props) => {
  return (
    <TableCell>
      {props.data.isTeam ? (
        <Diversity3Outlined fontSize="small" sx={{ color: 'primary.dark' }} />
      ) : (
        <ManOutlined fontSize="small" color="secondary" />
      )}
    </TableCell>
  );
};
