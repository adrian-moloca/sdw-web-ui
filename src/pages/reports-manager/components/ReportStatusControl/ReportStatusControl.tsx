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
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import { EntityType, EnumType, IEnumProps, useEnums } from 'models';
import { isDevelopment, Logger } from '_helpers';

type Props = {
  dataItem: any;
  mode: 'report' | 'data';
  type: EntityType;
  displayMode?: 'toolbar' | 'table';
  invalidateQueries?: string[];
};

export const ReportStatusControl = ({
  dataItem,
  mode,
  type,
  displayMode,
  invalidateQueries,
}: Props) => {
  const apiService = useApiService();
  const queryClient = useQueryClient();
  const { getEnumValueOf, getEnumValues } = useEnums();
  const id = `${dataItem.id}${mode}${displayMode}`;
  const { getDataSourceUrl, getConfig } = useModelConfig();
  const config = getConfig(type);
  const theme = useTheme();

  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const inputStatus = useMemo(
    () => (mode == 'report' ? dataItem.status : dataItem.statusData),
    [mode, dataItem]
  );

  const [status, setStatus] = useState(inputStatus);
  const enumType = useMemo(
    () =>
      type === EntityType.DeliveryPlan || type === EntityType.ReportDelivery
        ? EnumType.DeliveryStatus
        : mode == 'report'
          ? EnumType.ReportStatus
          : EnumType.DataStatus,
    [type, mode]
  );

  const currentStatus = useMemo(() => getEnumValueOf(status, enumType), [type, mode, dataItem]);
  const allStatus = useMemo(() => getEnumValues(enumType), [type, mode, dataItem]);
  const url = useMemo(
    () =>
      mode == 'report'
        ? `${getDataSourceUrl(config.type)}/${dataItem.id}/status?status={0}`
        : `${getDataSourceUrl(config.type)}/${dataItem.id}/status/data?status={0}`,
    [type, mode, dataItem]
  );

  const mutation = useMutation({
    mutationFn: async (updateData: any) =>
      apiService.put(url.replace('{0}', updateData), undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${config.entityName}_index`] });
      queryClient.invalidateQueries({ queryKey: [`${dataItem.id}_view`] });
      invalidateQueries?.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      );

      setOpen(false);
    },
    onError: (error: any) => error,
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

  const handleListKeyDown = (event: KeyboardEvent) => {
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
      if (isDevelopment) Logger.error('Error during form submission');
    }
  };

  const IconComponent = currentStatus?.icon;

  return (
    <>
      <ButtonBase>
        {displayMode === 'table' ? (
          <Chip
            sx={{
              p: 0,
              height: '25px',
              borderRadius: '5px',
              fontSize: theme.typography.body1.fontSize,
              '&:hover': {
                backgroundColor: theme.palette.common.white,
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
            label={currentStatus?.text}
            ref={anchorRef}
            aria-controls={open ? `menu-merge_${id}` : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          />
        ) : (
          <Chip
            sx={{
              borderRadius: '5px',
              py: 2.5,
              border: `1px solid`,
              bgcolor: theme.palette.background.default,
              fontSize: theme.typography.body2.fontSize,
              fontWeight: 500,
              borderColor: currentStatus?.color ?? theme.palette.secondary.light,
              color: currentStatus?.color ?? theme.palette.secondary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.light,
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
            ref={anchorRef}
            aria-controls={open ? `menu-merge_${id}` : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          />
        )}
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
                  id={`toolbar-menu_${id}`}
                  aria-labelledby={`toolbar-button${id}`}
                  onKeyDown={handleListKeyDown}
                >
                  {allStatus
                    .filter((x: IEnumProps) => x.code != currentStatus?.code)
                    .map((tool: IEnumProps, i: number) => (
                      <MenuItem key={i} onClick={() => handleClick(tool.code)} disableRipple>
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
