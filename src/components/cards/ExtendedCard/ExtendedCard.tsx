import React from 'react';
import { Typography, Avatar, SvgIconTypeMap, TypographyVariant } from '@mui/material';
import { MainCard } from '../MainCard';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { olympicsDesignColors } from 'themes/colors';

interface Props {
  titleText: string;
  icon: OverridableComponent<SvgIconTypeMap>;
  secondary?: React.ReactElement;
  children?: React.ReactElement | React.ReactElement[];
  variant?: TypographyVariant;
}

export const ExtendedCard: React.FC<Props> = ({
  titleText,
  icon,
  children,
  variant,
  secondary,
}) => {
  const Icon = icon;
  return (
    <MainCard
      title={<Typography variant={variant || 'subtitle2'}>{titleText}</Typography>}
      avatar={
        <Avatar
          sx={[
            (theme) => ({
              width: 30,
              height: 30,
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
              border: '1px solid',
            }),
            (theme) =>
              theme.applyStyles('dark', {
                width: 30,
                height: 30,
                background: olympicsDesignColors.dark.general.background,
                color: olympicsDesignColors.dark.text.primary,
                borderColor: olympicsDesignColors.dark.general.divider,
                border: '1px solid',
              }),
          ]}
        >
          <Icon sx={{ fontSize: 16 }} />
        </Avatar>
      }
      divider={false}
      border={false}
      headerSX={[
        (theme) => ({
          textAlign: 'left',
          background: theme.palette.grey[50],
        }),
        (theme) =>
          theme.applyStyles('dark', {
            textAlign: 'left',
            background: olympicsDesignColors.dark.general.background,
          }),
      ]}
      sx={[
        (theme) => ({
          width: '100%',
          borderRadius: 0,
          textAlign: 'left',
          backgroundColor: theme.palette.grey[50],
        }),
        (theme) =>
          theme.applyStyles('dark', {
            borderRadius: 0,
            width: '100%',
            textAlign: 'left',
            backgroundColor: olympicsDesignColors.dark.general.background,
          }),
      ]}
      secondary={secondary}
    >
      {children}
    </MainCard>
  );
};
