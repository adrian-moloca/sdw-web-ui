import type { JSX, ReactNode } from 'react';
import { Card, Theme, Typography, useTheme } from '@mui/material';
import { layout } from 'themes/layout';
import { colors, OlympicColors, olympicsDesignColors } from 'themes/colors';
import { BorderedLinearProgress } from '../BorderedLinearProgress';

type Props = {
  title: string;
  value: number;
  hasProgressBar?: boolean;
  icon?: ReactNode;
  isSelected?: boolean;
  label?: string;
  progressValue?: number;
  onClick: () => void;
};

export const MetricCard = ({
  isSelected,
  title,
  value,
  hasProgressBar,
  icon,
  label,
  progressValue,
  onClick,
}: Props): JSX.Element => {
  const theme = useTheme();

  const titleColor = [
    () => ({
      color: isSelected
        ? olympicsDesignColors.base.neutral.white
        : olympicsDesignColors.base.neutral.black,
    }),
    (theme: Theme) =>
      theme.applyStyles('dark', {
        color: isSelected ? olympicsDesignColors.base.neutral.white : theme.palette.text.secondary,
      }),
  ];
  const valueColor = isSelected ? theme.palette.background.paper : OlympicColors.BLUE;

  return (
    <Card
      sx={[
        {
          pt: layout.spacing['4'],
          pr: layout.spacing['5'],
          pb: layout.spacing['3'],
          pl: layout.spacing['5'],
          border: '1px solid',
          borderColor: isSelected ? OlympicColors.BLUE : colors.neutral['200'],
          borderRadius: '12px',
          width: '274px',
          boxShadow: 'none',
          position: 'relative',
          '&:hover': {
            cursor: 'pointer',
          },
        },
        () => ({
          bgcolor: isSelected ? OlympicColors.BLUE : olympicsDesignColors.base.neutral.white,
        }),
        (theme) =>
          theme.applyStyles('dark', {
            bgcolor: isSelected
              ? OlympicColors.BLUE
              : olympicsDesignColors.dark.general.backgroundLight,
          }),
      ]}
      data-testid="metric-card"
      tabIndex={0}
      role="treeitem"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onClick();
        }
      }}
    >
      {icon}
      <Typography fontWeight="700" lineHeight="32px" variant="subtitle1" sx={titleColor}>
        {title}
      </Typography>
      {label && (
        <Typography sx={titleColor} marginBottom={layout.spacing['2']}>
          {label}
        </Typography>
      )}
      <Typography fontWeight="700" variant="h4" color={valueColor}>
        {value}
      </Typography>
      {hasProgressBar && progressValue !== undefined && (
        <BorderedLinearProgress
          value={progressValue}
          variant="determinate"
          displayLabel
          labelColor={valueColor}
          width={144}
        />
      )}
    </Card>
  );
};
