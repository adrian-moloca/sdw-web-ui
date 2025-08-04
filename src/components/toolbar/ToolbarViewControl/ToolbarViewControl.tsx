import React, { useRef, useState } from 'react';
import {
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAppModel } from 'hooks';
import { IToolbarPanelProps } from 'types/views';
import { olympicsDesignColors } from 'themes/colors';
import { t } from 'i18next';

interface ToolbarProps<T> {
  tools: IToolbarPanelProps<T>[];
  dataItem: T;
}

export function ToolbarViewControl<T>({
  dataItem,
  tools,
}: Readonly<ToolbarProps<T>>): React.ReactElement | null {
  const { getIconBase } = useAppModel();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const validTools = tools.filter(
    (x) => !x.condition || (x.condition && x.condition(dataItem) === true)
  );

  if (validTools.length === 0) return null;

  if (validTools.length === 1) {
    const Icon = getIconBase(validTools[0].type);
    return (
      <IconButton
        aria-label={'Toolbar control details'}
        title={'Toolbar control details'}
        onClick={() => tools[0].handleClick(dataItem)}
        sx={[
          (theme) => ({
            p: 0,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
            border: `1px solid!important`,
            borderColor: `${theme.palette.divider}!important`,
            transition: 'all .2s ease-in-out',
            '&[aria-controls="menu-merge"],&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.primary.dark,
            },
          }),
          (theme) =>
            theme.applyStyles('dark', {
              backgroundColor: olympicsDesignColors.dark.general.background,
              color: olympicsDesignColors.dark.text.secondary,
              border: `1px solid!important`,
              borderColor: `${olympicsDesignColors.dark.general.divider}!important`,
              transition: 'all .2s ease-in-out',
              '&[aria-controls="menu-merge"],&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: olympicsDesignColors.dark.general.surface,
                borderColor: theme.palette.primary.main,
              },
            }),
        ]}
      >
        <Icon />
      </IconButton>
    );
  }
  return (
    <>
      <IconButton
        aria-label={t('general.more-info')}
        title={t('general.more-info')}
        ref={anchorRef}
        aria-controls={open ? 'menu-merge' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={[
          (theme) => ({
            p: 0,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
            border: `1px solid!important`,
            borderColor: `${theme.palette.divider}!important`,
            transition: 'all .2s ease-in-out',
            '&[aria-controls="menu-merge"],&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.primary.dark,
            },
          }),
          (theme) =>
            theme.applyStyles('dark', {
              backgroundColor: olympicsDesignColors.dark.general.background,
              color: olympicsDesignColors.dark.text.secondary,
              border: `1px solid!important`,
              borderColor: `${olympicsDesignColors.dark.general.divider}!important`,
              transition: 'all .2s ease-in-out',
              '&[aria-controls="menu-merge"],&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: olympicsDesignColors.dark.general.surface,
                borderColor: theme.palette.primary.main,
              },
            }),
        ]}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        sx={{ zIndex: 3 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="toolbar-menu"
                  aria-labelledby="toolbar-button"
                  onKeyDown={handleListKeyDown}
                >
                  {validTools.map((tool: IToolbarPanelProps<T>, i: number) => {
                    const Icon = getIconBase(tool.type);
                    return (
                      <MenuItem
                        key={`${tool.type}-${tool.title}-${i}`}
                        onClick={() => tool.handleClick(dataItem)}
                        disableRipple
                      >
                        <ListItemIcon>
                          <Icon />
                        </ListItemIcon>
                        <ListItemText>{tool.title}</ListItemText>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
