import {
  ButtonBase,
  Avatar,
  useTheme,
  ClickAwayListener,
  Grow,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TableCell,
} from '@mui/material';
import { useRef, useState } from 'react';
import { StructureType } from 'types/ingestion';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

type Props = {
  type: StructureType;
  data: any;
  rules: Array<any>;
};

export const RulesControl = ({ data, type }: Props) => {
  const theme = useTheme();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const rules = data?.rules?.find(
    (x: any) => x.code === data.code || x.nextRules.some((y: any) => y.code === data.code)
  );

  if (rules.length === 0) {
    return null;
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const validTools = (): any[] => {
    switch (type) {
      case 'stage':
        return [
          {
            title: 'Add Stage',
            handleClick: (data: any) => {
              console.log('Add Stage', data);
            },
          },
          {
            title: 'Add Phase',
            handleClick: (data: any) => {
              console.log('Add Phase', data);
            },
          },
          {
            title: 'Add Unit',
            handleClick: (data: any) => {
              console.log('Add Unit', data);
            },
          },
          {
            title: 'Add Sub Unit',
            handleClick: (data: any) => {
              console.log('Add Sub Unit', data);
            },
          },
        ];
      case 'phase':
        return [
          {
            title: 'Convert to Stage',
            handleClick: (data: any) => {
              console.log('Convert to Stage', data);
            },
          },
          {
            title: 'Link to Stage',
            handleClick: (data: any) => {
              console.log('Link to Stage', data);
            },
          },
        ];
      case 'unit':
        return [
          {
            title: 'Convert to SubUnit',
            handleClick: (data: any) => {
              console.log('Convert to SubUnit', data);
            },
          },
          {
            title: 'Hide Unit',
            handleClick: (data: any) => {
              console.log('Hide Unit', data);
            },
          },
        ];
      case 'subunit':
        return [
          {
            title: 'Convert to Unit',
            handleClick: (data: any) => {
              console.log('Convert to Unit', data);
            },
          },
          {
            title: 'Hide SubUnit',
            handleClick: (data: any) => {
              console.log('Hide SubUnit', data);
            },
          },
        ];
      default:
        return [];
    }
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

  return (
    <TableCell>
      <ButtonBase>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.headerAvatar,
            width: '30px',
            height: '20px',
            fontSize: '1rem',
            transition: 'all .2s ease-in-out',
            '&[aria-controls="menu-rule"],&:hover': {
              background: theme.palette.primary.light,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            },
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-rule' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          <MoreHorizOutlinedIcon />
        </Avatar>
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
                  {validTools().map((tool: any, i: number) => (
                    <MenuItem key={i} onClick={() => tool.handleClick(data)} disableRipple>
                      <ListItemText>{tool.title}</ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </TableCell>
  );
};
