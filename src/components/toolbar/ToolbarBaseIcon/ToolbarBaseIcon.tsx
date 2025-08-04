import React from 'react';
import { Avatar, ButtonBase, useTheme } from '@mui/material';

type Props = { icon?: React.ReactNode; title: string; disabled?: boolean; onClick: () => void };

export const ToolbarBaseIcon = ({ title, disabled, icon, onClick }: Props): React.ReactElement => {
  const theme = useTheme();

  return (
    <ButtonBase title={title} disabled={disabled}>
      <Avatar
        variant="rounded"
        sx={{
          ...theme.typography.headerAvatar,
          ...theme.typography.mediumAvatar,
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
          border: '1px solid #ccc!important',
          transition: 'all .2s ease-in-out',
          '&:hover': {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          },
        }}
        onClick={onClick}
        color="inherit"
      >
        {icon}
      </Avatar>
    </ButtonBase>
  );
};
