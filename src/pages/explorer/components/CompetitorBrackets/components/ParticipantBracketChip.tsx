import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Stack, Typography } from '@mui/material';
import { CountryChip } from 'components/CountryChip';
import { formatMasterCode } from '_helpers';
import get from 'lodash/get';
import { olympicsDesignColors } from 'themes/colors';

export const ParticipantBracketChip: React.FC<{ data: any; textAlign: 'left' | 'right' }> = ({
  data,
  textAlign,
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems={'center'}>
      {textAlign == 'left' && (
        <>
          {data.frameBracket.winner && (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: olympicsDesignColors.base.neutral.white }}
            />
          )}
          <Typography variant="h1" lineHeight={1.1} color={olympicsDesignColors.base.neutral.white}>
            {formatMasterCode(get(data, 'organisation.country'))}
          </Typography>
        </>
      )}
      <CountryChip code={get(data, 'organisation.country')} hideTitle={true} size={'large'} />
      {textAlign == 'right' && (
        <>
          <Typography variant="h1" lineHeight={1.1} color={olympicsDesignColors.base.neutral.white}>
            {formatMasterCode(get(data, 'organisation.country'))}
          </Typography>
          {data.frameBracket.winner && (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: olympicsDesignColors.base.neutral.white }}
            />
          )}
        </>
      )}
    </Stack>
  );
};
