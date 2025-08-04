import { Box, Typography, useMediaQuery } from '@mui/material';
import get from 'lodash/get';
import { GeneralInfo } from '../GeneralInfo';
import { t } from 'i18next';

export const CompetitionInfo = (param: { data: any }) => {
  const extendedInfo = get(param.data, 'extendedInfo');
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  if (!extendedInfo) return null;
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant={matchDownSM ? 'h5' : 'h4'}>{t('general.extendedInfo')}</Typography>
      <GeneralInfo data={extendedInfo} />
    </Box>
  );
};
