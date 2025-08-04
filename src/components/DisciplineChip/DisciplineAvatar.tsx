import { Avatar } from '@mui/material';
import { getDisciplineCode } from '_helpers';
import { apiConfig } from 'config/app.config';

export const DisciplineAvatar = (param: { code: string; title: string; size: number }) => {
  return (
    <Avatar
      variant="square"
      src={apiConfig.disciplinesIconEndPoint.replace(
        '{0}',
        getDisciplineCode(param.code, param.title)
      )}
      alt={param.title}
      title={param.title}
      component={'span'}
      sx={{ backgroundColor: 'white', width: `${param.size}px`, height: `${param.size}px` }}
    />
  );
};
