import { Box, Divider, Paper, Stack, styled, Typography, useTheme } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import { isNullOrEmpty } from '_helpers';
import { CountryChip } from 'components/CountryChip/CountryChip';
import { orderBy } from 'lodash';
import { olympicsDesignColors } from 'themes/colors';
import { CompetitorNodeProps, MatchNodeProps } from './type';

const StyledMatchNode = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  width: 250,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  ...theme.applyStyles('dark', {
    backgroundColor: olympicsDesignColors.dark.general.background,
    border: `1px solid ${theme.palette.grey[500]}`,
  }),
  border: `1px solid ${theme.palette.grey[300]}`,
  display: 'flex',
  flexDirection: 'column',
}));
const CompetitorBox = styled(Box)<{ isWinner: boolean }>(({ theme, isWinner }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isWinner ? theme.palette.background.paper : theme.palette.background.default,
  ...theme.applyStyles('dark', {
    backgroundColor: olympicsDesignColors.dark.general.background,
  }),
  fontWeight: isWinner ? 'bold' : 'normal',
  '&:last-child': {
    marginBottom: 0,
  },
}));

export const StageTitleNode = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  width: '100%',
  fontWeight: 'bold',
  fontSize: '1rem',
  color: theme.palette.text.primary,
  paddingBottom: '10px',
  borderBottom: `2px solid ${theme.palette.divider}`,
}));
export const MatchNode: React.FC<MatchNodeProps> = ({ data }) => {
  const theme = useTheme();
  const sortedCompetitors = orderBy(data.competitors, ['rank', 'name'], ['asc']);
  return (
    <StyledMatchNode elevation={0}>
      <Typography
        variant="body1"
        fontWeight={500}
        sx={{ mb: theme.spacing(2), textAlign: 'left', pl: 1 }}
      >
        {data.title}
      </Typography>
      <Divider sx={{ mb: theme.spacing(1) }} />
      {sortedCompetitors.map((competitor, index) => (
        <BracketCompetitorNode key={index} data={competitor} />
      ))}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </StyledMatchNode>
  );
};
export const BracketCompetitorNode: React.FC<CompetitorNodeProps> = ({ data }) => {
  const { name, organisation, result, wlt, rank } = data;

  const getDisplayName = () => {
    if (name.includes('/')) {
      return name.split('/');
    }
    return name;
  };
  const formatDisplay = getDisplayName();
  const hasRank = !isNullOrEmpty(rank?.toString());
  if (hasRank) {
    return (
      <CompetitorBox isWinner={wlt === 'WINNER'}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
          }}
        >
          <Typography variant="body2" component="div" sx={{ mr: 2 }}>
            {rank}
          </Typography>
          <Typography variant="body2" lineHeight={1.2} sx={{ whiteSpace: 'pre-line' }}>
            {Array.isArray(formatDisplay) ? formatDisplay.join('\n') : formatDisplay}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="body2"
            component="div"
            sx={{ fontWeight: result.length < 4 ? 'bold' : 'normal' }}
          >
            {result}
          </Typography>
        </Box>
      </CompetitorBox>
    );
  }
  return (
    <CompetitorBox isWinner={wlt === 'WINNER'}>
      <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ textAlign: 'center' }}>
        {!hasRank && (
          <CountryChip
            size={'tiny'}
            code={organisation?.country}
            title={organisation?.name}
            hideTitle={true}
          />
        )}
        <Typography
          variant="body2"
          textAlign={'left'}
          lineHeight={1.2}
          sx={{ whiteSpace: 'pre-line' }}
        >
          {Array.isArray(formatDisplay) ? formatDisplay.join('\n') : formatDisplay}
        </Typography>
      </Stack>
      <Box sx={{ textAlign: 'right' }}>
        <Typography
          variant="body2"
          component="div"
          sx={{ fontWeight: result.length < 4 ? 'bold' : 'normal' }}
        >
          {result}
        </Typography>
      </Box>
    </CompetitorBox>
  );
};
