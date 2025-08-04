import '@xyflow/react/dist/style.css';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { ParticipantItemMobile } from './ParticipantItemMobile';
import { CombinedFrameResultsDisplay } from '../../FrameResultsTable';
import { ParticipantItem } from './ParticipantItem';
import { formatMasterCode } from '_helpers';
import { olympicsDesignColors } from 'themes/colors';

type ParticipantProps = {
  data: any;
  open: boolean;
  discipline: string;
};
export const ScoreBracket: React.FC<ParticipantProps> = ({ data, open, discipline }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (isMobile)
    return (
      <Box
        sx={{
          width: '100%',
          px: 1,
          gap: 2,
        }}
      >
        <ParticipantItemMobile data={data[0]} textAlign={'right'} open={open} />
        <ParticipantItemMobile data={data[1]} textAlign={'right'} open={open} />
        <CombinedFrameResultsDisplay data={data} discipline={discipline} />
      </Box>
    );
  return (
    <Box
      sx={{
        width: '100%',
        px: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        gap: 4,
      }}
    >
      <ParticipantItem data={data[0]} textAlign={'right'} open={open} />
      <Stack spacing={1} alignItems={'center'}>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography
            variant={'h2'}
            lineHeight={1.1}
            color={olympicsDesignColors.base.neutral.white}
          >
            {formatMasterCode(data[0]?.frameBracket.result)}
          </Typography>
          <RemoveOutlinedIcon sx={{ color: olympicsDesignColors.base.neutral.white }} />
          <Typography
            variant={'h2'}
            lineHeight={1.1}
            color={olympicsDesignColors.base.neutral.white}
          >
            {formatMasterCode(data[1]?.frameBracket.result)}
          </Typography>
        </Stack>
        <CombinedFrameResultsDisplay data={data} discipline={discipline} />
      </Stack>
      <ParticipantItem data={data[1]} textAlign={'left'} open={open} />
    </Box>
  );
};
