import { Grid, lighten, Stack, Typography, useMediaQuery } from '@mui/material';
import { formatAthleteName } from '_helpers';
import { useStoreCache } from 'hooks';
import { t } from 'i18next';
import { MasterData } from 'models';
import { olympicsDesignColors } from 'themes/colors';
import { layout } from 'themes/layout';
interface Props {
  match: any;
  discipline: string;
}
export const MatchHeader: React.FC<Props> = ({ match, discipline }: Props) => {
  const { getMasterDataValue } = useStoreCache();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const disciplineName = getMasterDataValue(discipline, MasterData.Discipline)?.value ?? '';
  const matchTitle = match?.competitors
    ?.map((competitor: any) => {
      const displayName = formatAthleteName(competitor);
      return displayName;
    })
    .join(' vs ');

  const title =
    match?.title?.indexOf('Game') > -1
      ? match?.title
      : `${match?.title}, ${t('general.game')} ${match?.order ?? 'N'}`;

  return (
    <Grid size={12} alignItems={'center'} justifyContent={'center'}>
      <Stack
        sx={[
          (theme) => ({
            py: 3,
            borderTopLeftRadius: layout.radius.sm,
            borderTopRightRadius: layout.radius.sm,
            backgroundColor: lighten(theme.palette.primary.light, 0.8),
          }),
          (theme) =>
            theme.applyStyles('dark', {
              py: 3,
              borderTopLeftRadius: layout.radius.sm,
              borderTopRightRadius: layout.radius.sm,
              backgroundColor: olympicsDesignColors.dark.general.background,
              color: theme.palette.common.white,
            }),
        ]}
        border={0}
        spacing={0}
      >
        <Typography variant={isMobile ? 'body1' : 'subtitle1'} textAlign={'center'} gutterBottom>
          {`${disciplineName} - ${title}`}
        </Typography>
        <Typography variant={'h2'} textAlign={'center'}>
          {matchTitle}
        </Typography>
      </Stack>
    </Grid>
  );
};
