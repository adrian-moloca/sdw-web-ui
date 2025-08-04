import React, { ElementType } from 'react';
import { Avatar, ButtonBase, useTheme } from '@mui/material';
import { EntityStatusType } from 'models';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import { t } from 'i18next';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

type Props = {
  status: string;
  currentSecurity?: any;
  handleActive?: () => void;
  handleDelete?: () => void;
};

export function ViewToolbar({
  status,
  handleActive,
  handleDelete,
}: Readonly<Props>): React.ReactElement {
  const theme = useTheme();

  const BuildButton = (Icon: ElementType, label: string, onClick?: () => void) => (
    <ButtonBase sx={{ borderRadius: 0, mb: 0.5 }}>
      <Avatar
        variant="square"
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          transition: 'all .2s ease-in-out',
          background: theme.palette.secondary.light,
          color: theme.palette.secondary.dark,
          '&[aria-controls="menu-list-grow"],&:hover': {
            background: theme.palette.primary.dark,
            color: theme.palette.primary.light,
          },
          marginRight: 0.4,
        }}
        aria-controls={label}
        onClick={onClick}
        color="inherit"
      >
        <Icon />
      </Avatar>
    </ButtonBase>
  );

  if (status == EntityStatusType.Inactive)
    return BuildButton(PlayCircleOutlineOutlinedIcon, t('actions.buttonActivate'), handleActive);

  return BuildButton(DeleteOutlinedIcon, t('actions.buttonDelete'), handleDelete);
}
