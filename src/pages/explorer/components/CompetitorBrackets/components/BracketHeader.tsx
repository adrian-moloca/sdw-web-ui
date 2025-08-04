import { Box, Chip, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { MedalAvatarMap } from 'components/AwardAvatar';
import { useStoreCache } from 'hooks';
import { t } from 'i18next';
import { MasterData } from 'models';

type Props = {
  data: any;
};
export const BracketHeader: React.FC<Props> = ({ data }) => {
  const { getMasterDataValue } = useStoreCache();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const status = getMasterDataValue(data?.resultStatus, MasterData.ResultStatus)?.value;
  const title =
    data.title?.indexOf('Game') > -1
      ? data.title
      : `${data.title}, ${t('general.game')} ${data.order ?? 'N'}`;
  const isGolden =
    data.title.toLowerCase().includes('gold') || data.title.toLowerCase().includes('big final');
  const isBronze =
    data.title.toLowerCase().includes('bronze') || data.title.toLowerCase().includes('small final');
  return (
    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      sx={{ px: 1 }}
    >
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Typography variant="subtitle1" fontWeight={500} sx={{ color: theme.palette.text.primary }}>
          {title}
        </Typography>
        {isGolden && <>{MedalAvatarMap.golden(21)}</>}
        {isBronze && <>{MedalAvatarMap.bronze(21)}</>}
      </Stack>
      {status && (
        <Chip
          size="small"
          variant="outlined"
          label={status.toUpperCase()}
          sx={{ fontWeight: 400, color: theme.palette.text.primary }}
        />
      )}
    </Box>
  );
};
