import get from 'lodash/get';
import { memo, useMemo } from 'react';
import { MedalAvatarMap } from 'components/AwardAvatar';
import { Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { medalMap } from 'models';

type Props = {
  data: any;
};

export const AwardCardMedal = memo(function AwardCardMedalFn({ data }: Props) {
  const awardSubclass = get(data, 'subClass');
  const medalColor = medalMap[awardSubclass] ?? 'bronze'; // Default to bronze
  const medalLabel = useMemo(() => {
    switch (medalColor) {
      case 'golden':
        return t('general.golden');
      case 'silver':
        return t('general.silver');
      default:
        return t('general.bronze');
    }
  }, [medalColor, t]);

  return (
    <Stack direction={'row'} spacing={1} alignItems={'center'}>
      {MedalAvatarMap[medalColor](32)}
      <Typography variant="subtitle1" fontWeight={'500'} lineHeight={1}>
        {medalLabel}
      </Typography>
    </Stack>
  );
});
