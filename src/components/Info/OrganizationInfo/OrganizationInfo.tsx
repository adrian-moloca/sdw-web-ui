import { Box } from '@mui/material';
import { GeneralInfo } from '../GeneralInfo';
import get from 'lodash/get';

export const OrganizationInfo = (param: { data: any }) => {
  const extendedInfo = get(param.data, 'extendedInfo');
  if (!extendedInfo) return null;
  return (
    <Box sx={{ marginBottom: 2 }}>
      <GeneralInfo data={extendedInfo} />
    </Box>
  );
};
