import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Stack, Typography } from '@mui/material';
import { CountryChip } from 'components/CountryChip';
import { formatMasterCode } from '_helpers';
import get from 'lodash/get';
import { olympicsDesignColors } from 'themes/colors';

export const ParticipantBracketChip: React.FC<{
  data: any;
  textAlign: 'left' | 'right' | 'center';
}> = ({ data, textAlign }) => {
  if (textAlign === 'center') {
    return (
      <Stack spacing={2} justifyItems={'center'} alignItems={'center'} textAlign={'center'}>
        <CountryChip code={get(data, 'organisation.country')} hideTitle={true} size={'small'} />
        <Typography
          variant="body1"
          lineHeight={1.1}
          color={olympicsDesignColors.base.neutral.white}
        >
          {formatMasterCode(get(data, 'organisation.country'))}
        </Typography>
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={2} alignItems={'center'}>
      {textAlign == 'left' && (
        <>
          {data.frameBracket?.winner && (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: olympicsDesignColors.base.neutral.white }}
            />
          )}
          <Typography
            variant="subtitle1"
            lineHeight={1.1}
            color={olympicsDesignColors.base.neutral.white}
          >
            {formatMasterCode(get(data, 'organisation.country'))}
          </Typography>
        </>
      )}
      <CountryChip code={get(data, 'organisation.country')} hideTitle={true} size={'small'} />
      {textAlign == 'right' && (
        <>
          <Typography
            variant="subtitle1"
            lineHeight={1.1}
            color={olympicsDesignColors.base.neutral.white}
          >
            {formatMasterCode(get(data, 'organisation.country'))}
          </Typography>
          {data.frameBracket?.winner && (
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: olympicsDesignColors.base.neutral.white }}
            />
          )}
        </>
      )}
    </Stack>
  );
};
