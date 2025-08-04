import { MedalProps } from 'types/explorer';
import { BuildMedalChip } from '../TableCellAward';
import get from 'lodash/get';
import { t } from 'i18next';
import { Box } from '@mui/material';

export const MedalChip = (param: MedalProps) => {
  if (param.medals.length == 0) return <>-</>;
  const element = param.element;
  const medal = param.medals?.find((x: any) => x.event?.id === element.roundsResult?.id);
  if (!medal) return <>-</>;
  if (medal.golden > 0) return BuildMedalChip('golden', medal.golden);
  if (medal.silver > 0) return BuildMedalChip('silver', medal.silver);
  if (medal.bronze > 0) return BuildMedalChip('bronze', medal.bronze);
  return <>-</>;
};
export const SingleMedalChip = (param: { element: any; includeSpacing?: boolean }) => {
  const medal = get(param.element, 'medal');
  if (!medal && param.includeSpacing === true) return <Box sx={{ width: 21, height: 21 }}></Box>;
  if (!medal) return <>-</>;
  if (medal === 'AWSB$ME_GOLD' || medal === 'AWSB$GOLD')
    return BuildMedalChip('golden', 1, t('general.golden'));
  if (medal === 'AWSB$ME_SILVER' || medal === 'AWSB$SILVER')
    return BuildMedalChip('silver', 1, t('general.silver'));
  if (medal === 'AWSB$ME_BRONZE' || medal === 'AWSB$BRONZE')
    return BuildMedalChip('bronze', 1, t('general.bronze'));
  return <>-</>;
};
