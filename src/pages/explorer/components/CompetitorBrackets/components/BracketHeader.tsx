import { Box, Stack, Typography, useTheme } from '@mui/material';
import baseConfig from 'baseConfig';
import { MedalAvatarMap } from 'components/AwardAvatar';
import { t } from 'i18next';

type Props = {
  data: any;
};
export const BracketHeader: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const title =
    data.title?.indexOf('Game') > -1
      ? data.title
      : `${data.title}, ${t('general.game')} ${data.order ?? 'N'}`;
  const isGolden =
    data.title.toLowerCase().includes('gold') || data.title.toLowerCase().includes('big final');
  const isBronze =
    data.title.toLowerCase().includes('bronze') || data.title.toLowerCase().includes('small final');
  return (
    <Box gap={2} sx={{ py: 1 }}>
      <Stack
        direction="row"
        spacing={baseConfig.gridSpacing}
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
      >
        <Typography variant="body1" sx={{ color: theme.palette.common.white }}>
          {title}
        </Typography>
        {isGolden && <>{MedalAvatarMap.golden(21)}</>}
        {isBronze && <>{MedalAvatarMap.bronze(21)}</>}
      </Stack>
    </Box>
  );
};
