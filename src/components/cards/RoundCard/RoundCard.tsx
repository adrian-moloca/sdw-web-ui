import React from 'react';
import { Avatar, SvgIconTypeMap } from '@mui/material';
import { MainCard } from '../MainCard';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { olympicsDesignColors } from 'themes/colors';

interface Props {
  title?: string | React.ReactElement;
  icon?: OverridableComponent<SvgIconTypeMap>;
  secondary?: React.ReactElement;
  children?: React.ReactElement | React.ReactElement[];
  transparent?: boolean;
}

export const RoundCard: React.FC<Props> = ({ title, icon, children, secondary, transparent }) => {
  const Icon = icon;
  return (
    <MainCard
      title={title}
      size="tiny"
      avatar={
        <>
          {Icon && (
            <Avatar
              sx={[
                (theme) => ({
                  width: 24,
                  height: 24,
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
          )}
        </>
      }
      divider={false}
      border={false}
      headerSX={{
        px: transparent === true ? 0 : 1,
        pt: transparent === true ? 0 : 4,
        pb: transparent === true ? 0 : 'inherit',
        textAlign: 'left',
      }}
      sx={[
        (theme) => ({
          width: '100%',
          backgroundColor: transparent === true ? 'transparent' : theme.palette.grey[50],
        }),
        (theme) =>
          theme.applyStyles('dark', {
            width: '100%',
            backgroundColor:
              transparent === true ? 'transparent' : olympicsDesignColors.dark.general.background,
          }),
      ]}
      secondary={secondary}
    >
      {children}
    </MainCard>
  );
};
