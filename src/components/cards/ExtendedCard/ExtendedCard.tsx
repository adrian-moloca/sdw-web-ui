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
      title={
        <Typography variant={variant || 'body1'} fontWeight={500}>
          {titleText}
        </Typography>
      }
      avatar={
        <Avatar
          sx={[
            (theme) => ({
              width: 24,
              height: 24,
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
              border: '1px solid',
            }),
            (theme) =>
              theme.applyStyles('dark', {
                width: 24,
                height: 24,
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
      contentSX={{ pt: 0 }}
      headerSX={[
        (theme) => ({
          textAlign: 'left',
          width: '100%',
          background: theme.palette.grey[50],
          py: 2,
          px: 3,
        }),
        (theme) =>
          theme.applyStyles('dark', {
            textAlign: 'left',
            width: '100%',
            background: olympicsDesignColors.dark.general.background,
            py: 2,
            px: 3,
          }),
      ]}
      sx={[
        (theme) => ({
          width: '100%',
          borderRadius: 0,
          px: theme.spacing(2),
          backgroundColor: theme.palette.grey[50],
        }),
        (theme) =>
          theme.applyStyles('dark', {
            width: '100%',
            borderRadius: 0,
            px: theme.spacing(2),
            backgroundColor: olympicsDesignColors.dark.general.background,
          }),
      ]}
      secondary={secondary}
    >
      {children}
    </MainCard>
  );
};
