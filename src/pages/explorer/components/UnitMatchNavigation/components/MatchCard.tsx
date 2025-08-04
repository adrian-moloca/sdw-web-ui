import { Box, Stack, Typography, useTheme } from '@mui/material';
import { MedalAvatarMap } from 'components';
import { t } from 'i18next';
import { MasterData } from 'models';
import { useStoreCache } from 'hooks';
import { getScheduleDate } from '../../ScheduleDisplay';
import { MatchCompetitorDisplay } from './MatchCompetitorDisplay';

interface MatchCardProps {
  match: any;
  isSelected?: boolean;
  onClick: (id: string) => void;
}
/**
 * Renders a card component displaying information about a specific match, including its title,
 * competitors, schedule, and status. The card visually indicates selection state and provides
 * navigation to the match's detailed results page. Special icons are shown for golden and bronze matches.
 *
 * @param match - The match data to display, including title, competitors, and metadata.
 * @param isSelected - Optional. If true, highlights the card as selected. Defaults to false.
 *
 * @remarks
 * - Uses theme colors for styling and hover effects.
 * - Displays medal icons for golden and bronze matches.
 * - Navigates to a detailed match results page when clicked.
 */
export const MatchCard: React.FC<MatchCardProps> = ({ match, isSelected = false, onClick }) => {
  const theme = useTheme();
  const { getMasterDataValue } = useStoreCache();
  const backgroundColor = isSelected ? theme.palette.common.black : theme.palette.background.paper;
  const textColor = isSelected
    ? theme.palette.getContrastText(theme.palette.common.black)
    : theme.palette.text.primary;
  const borderColor = theme.palette.divider;
  const hoverEffect = !isSelected
    ? {
        '&:hover': {
          boxShadow: theme.shadows[4], // Stronger shadow on hover
        },
      }
    : {};

  const title =
    match.title?.indexOf('Game') > -1
      ? match.title
      : `${match.title}, ${t('general.game')} ${match.order ?? 'N'}`;
  const isGolden =
    match.title.toLowerCase().includes('gold') || match.title.toLowerCase().includes('big final');
  const isBronze =
    match.title.toLowerCase().includes('bronze') ||
    match.title.toLowerCase().includes('small final');
  const status = getMasterDataValue(match?.resultStatus, MasterData.ResultStatus)?.value;
  return (
    <Box
      sx={{
        backgroundColor,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        height: '100%',
        color: textColor,
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease-in-out',
        ...hoverEffect,
      }}
      onClick={() => onClick(match.id)}
    >
      <Box
        sx={{
          padding: '12px 16px',
          borderBottom: `1px solid ${borderColor}`,
          color: textColor,
        }}
      >
        <Stack direction={'row'} spacing={2} alignItems={'center'}>
          <Typography
            variant="body1"
            fontWeight={500}
            color={textColor}
            lineHeight={1.2}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
          >
            {title}
          </Typography>
          {isGolden && <>{MedalAvatarMap.golden(21)}</>}
          {isBronze && <>{MedalAvatarMap.bronze(21)}</>}
        </Stack>
      </Box>
      <Box sx={{ padding: '12px 16px' }}>
        <MatchCompetitorDisplay competitor={match.competitors?.[0]} isSelected={isSelected} />
        <MatchCompetitorDisplay competitor={match.competitors?.[1]} isSelected={isSelected} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderTop: `1px solid ${borderColor}`,
          color: textColor, // Use main text color, or a specific subtle color
        }}
      >
        <Typography variant="body2">{getScheduleDate(match)}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {status}
        </Typography>
      </Box>
    </Box>
  );
};
