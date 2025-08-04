import {
  ButtonBase,
  useTheme,
  ClickAwayListener,
  Grow,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  ListItemIcon,
  Chip,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { EntityType, EnumType, IEnumProps, useEnums } from 'models';
import appConfig from 'config/app.config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import { isDevelopment, Logger } from '_helpers';
import { t } from 'i18next';
import { useModelConfig } from 'hooks';

type Props = {
  type: EntityType;
  dataItem: any;
};
export const BioStatusControl = ({
  dataItem,
  type,
}: Readonly<Props>): React.ReactElement | null => {
  const { getConfig } = useModelConfig();
  const { getEnumValueOf, getEnumValues } = useEnums();
  const config = getConfig(type);
  const theme = useTheme();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(dataItem.status?.toUpperCase());

  const currentStatus = getEnumValueOf(status, EnumType.BioStatus);
  const allStatus = getEnumValues(EnumType.BioStatus);
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const url = `${appConfig.biographiesManagerEndPoint}${config.apiNode}/${dataItem.id}/status?status={0}`;

  const mutation = useMutation({
    mutationFn: async (updateData: any) =>
      apiService.put(url.replace('{0}', updateData), undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${dataItem.id}_view`] });
    },
    onError: (error: any) => {
      return error;
    },
  });

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

  const handleClick = async (e: any) => {
    setStatus(e);
    try {
      await mutation.mutateAsync(e.toLocaleLowerCase());
    } catch {
      if (isDevelopment) Logger.error(t('message.error-during-form-submission'));
    }
  };

  if (
    ![
      EntityType.PersonBiography,
      EntityType.HorseBiography,
      EntityType.TeamBiography,
      EntityType.NocBiography,
    ].includes(type)
  ) {
    return null;
  }

  const IconComponent = currentStatus?.icon;
  return (
    <>
      <ButtonBase aria-label={'Toolbar control details'} title={'Toolbar control details'}>
        <Chip
          sx={{
            borderRadius: '5px',
            py: 2.5,
            border: `1px solid`,
            bgcolor: theme.palette.common.white,
            fontWeight: 500,
            borderColor: currentStatus?.color ?? theme.palette.secondary.light,
            color: currentStatus?.color ?? theme.palette.secondary.main,
            '&:hover': {
              bgcolor: theme.palette.common.white,
            },
          }}
          icon={
            IconComponent && (
              <IconComponent
                sx={{ color: `${currentStatus?.color}!important`, fontSize: '1.2rem' }}
              />
            )
          }
          variant="outlined"
          label={currentStatus?.text.toLocaleUpperCase()}
          aria-label={'Toolbar control details icon'}
          ref={anchorRef}
          aria-controls={open ? 'menu-merge' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        />
      </ButtonBase>
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
                  {allStatus
                    .filter((x: IEnumProps) => x.code != status)
                    .map((tool: IEnumProps, i: number) => (
                      <MenuItem
                        key={i}
                        onClick={() => handleClick(tool.code)}
                        disableRipple
                        aria-label={'toolbar-button'}
                      >
                        {tool.icon && (
                          <ListItemIcon>
                            <tool.icon sx={{ color: tool.color }} />
                          </ListItemIcon>
                        )}
                        <ListItemText>{tool.text}</ListItemText>
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
