import get from 'lodash/get';
import { memo, useMemo } from 'react';
import { MedalAvatarMap } from 'components/AwardAvatar';
import { Stack, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import { medalMap } from 'models';
import { olympicsDesignColors } from 'themes/colors';

type Props = {
  data: any;
};

export const AwardCardMedal = memo(function AwardCardMedalFn({ data }: Props) {
  const theme = useTheme();
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
    <Stack
      direction={'row'}
      spacing={4}
      alignItems={'center'}
      sx={[
        (theme) => ({
          p: 4,
          background: theme.palette.background.default,
        }),
        (theme) =>
          theme.applyStyles('dark', {
            p: 4,
            background: olympicsDesignColors.dark.general.background,
          }),
      ]}
    >
      {MedalAvatarMap[medalColor](40)}
      <Typography variant="headline2" fontFamily={theme.typography.h1.fontFamily} lineHeight={1}>
        {medalLabel}
      </Typography>
    </Stack>
  );
});
