import get from 'lodash/get';
import { RuleModeEnum } from 'models';
import { IconButton, TableCell } from '@mui/material';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';

type Props = {
  rule: any;
  onClick: (e: any) => void;
};

export const DisableRuleCell = (props: Props) => {
  const kind = get(props.rule, 'kind');

  if (kind === RuleModeEnum.Ignored) {
    return (
      <TableCell>
        <IconButton aria-label="enable row" size="small" onClick={() => props.onClick(props.rule)}>
          <FavoriteBorderOutlined color="success" fontSize="small" />
        </IconButton>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <IconButton aria-label="disable row" size="small" onClick={() => props.onClick(props.rule)}>
        <DeleteOutline color="error" fontSize="small" />
      </IconButton>
    </TableCell>
  );
};
