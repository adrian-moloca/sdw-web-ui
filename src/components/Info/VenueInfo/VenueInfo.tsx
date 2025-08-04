import { Box, Typography, useMediaQuery } from '@mui/material';
import get from 'lodash/get';
import { t } from 'i18next';
import { OdfWeather, GeneralInfo } from 'components';

export const VenueInfo = (param: { data: any }) => {
  const extendedInfo = get(param.data, 'extendedInfo');
  const matchDownSM = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  if (!extendedInfo) return null;
  return (
    <Box>
      <Typography variant={matchDownSM ? 'h5' : 'h4'}>{t('general.extendedInfo')}</Typography>
      <GeneralInfo data={extendedInfo} />
      <OdfWeather data={extendedInfo} />
    </Box>
  );
};
