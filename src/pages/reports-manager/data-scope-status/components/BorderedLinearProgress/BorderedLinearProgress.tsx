import {
  Box,
  LinearProgress,
  linearProgressClasses,
  LinearProgressProps,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from 'themes/colors';
import { type JSX } from 'react';

type Props = LinearProgressProps & {
  value: number;
  displayLabel?: boolean;
  labelColor?: string;
  width?: number;
  fontTableStyle?: boolean;
};

const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: 6,
  borderRadius: 4,
  width: '100%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: colors.neutral['100'],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
    backgroundColor: colors.blue['300'],
    marginRight: 12,
  },
}));

export const BorderedLinearProgress = (props: Props): JSX.Element => {
  const { value, displayLabel, labelColor, width, variant, fontTableStyle, ...otherProps } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Box sx={{ width }}>
        <StyledLinearProgress
          {...otherProps}
          value={value}
          variant={variant}
          aria-label="Readiness"
        />
      </Box>
      {displayLabel && (
        <Box>
          <Typography
            variant={fontTableStyle ? 'body1' : 'h5'}
            fontWeight={fontTableStyle ? '400' : '700'}
            color={labelColor}
          >{`${value}%`}</Typography>
        </Box>
      )}
    </Box>
  );
};
