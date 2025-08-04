import { Avatar } from '@mui/material';
import { getDisciplineCode } from '_helpers';
import { apiConfig } from 'config/app.config';

interface Props {
  code: string;
  title: string;
  size: number;
  border?: boolean;
  variant?: 'square' | 'circular' | 'rounded';
}
export const DisciplineAvatar = (param: Props) => {
  if (!param.code) {
    return null;
  }
  return (
    <Avatar
      variant={param.variant ?? 'square'}
      src={apiConfig.disciplinesIconEndPoint.replace(
        '{0}',
        getDisciplineCode(param.code, param.title)
      )}
      alt={param.title}
      title={param.title}
      sx={{
        backgroundColor: 'white',
        width: `${param.size}px`,
        height: `${param.size}px`,
        border: param.border ? '1px solid #ccc' : 'none',
      }}
    />
  );
};
