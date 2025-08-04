import { Box, Stack, Typography } from '@mui/material';
import { formatAthleteName, formatMasterCode } from '_helpers';
import { CountryChip } from 'components/CountryChip';
import get from 'lodash/get';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
interface Props {
  competitor: any;
  isSelected: boolean;
}

export const MatchCompetitorDisplay: React.FC<Props> = ({ competitor, isSelected }) => {
  const displayName = formatAthleteName(competitor);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
        color: isSelected ? 'white' : 'inherit',
      }}
    >
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <CountryChip
          code={get(competitor, 'organisation.country')}
          hideTitle={true}
          size={'small'}
        />
        <Typography variant="body1" sx={{ fontWeight: '500' }}>
          {displayName}
        </Typography>
        {get(competitor, 'frameBracket.winner') === true && (
          <CheckCircleOutlineOutlinedIcon
            sx={{ color: isSelected ? 'white' : 'inherit', fontSize: '12px' }}
          />
        )}
      </Stack>
      <Typography variant="body1" sx={{ fontWeight: '500' }}>
        {formatMasterCode(get(competitor, 'frameBracket.result') || '')}
      </Typography>
    </Box>
  );
};
