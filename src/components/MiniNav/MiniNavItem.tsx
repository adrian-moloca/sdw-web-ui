import {
  Box,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
} from '@mui/material';
import { DashboardSidebarPageItem, type NavigationItem } from '@toolpad/core';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { hasKids } from 'utils/children-elements';

function MiniNavItem({ item, mini }: Readonly<{ item: NavigationItem; mini: boolean }>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const open = Boolean(anchorEl);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    clearTimer();
    setAnchorEl(e.currentTarget);
  };
  const onLeave = () => {
    clearTimer();
    timerRef.current = window.setTimeout(() => setAnchorEl(null), 200);
  };

  if (mini && hasKids(item)) {
    const pages = item.children.filter(
      (c): c is NavigationItem & { segment: string; title: string; icon?: React.ReactNode } =>
        typeof (c as any).segment === 'string'
    );

    return (
      <>
        <Box onMouseEnter={onEnter} onMouseLeave={onLeave} sx={{ px: 1, py: 0.5 }}>
          <DashboardSidebarPageItem
            item={item as any}
            href={`/${item.segment}`}
            LinkComponent={Link}
            expanded={false}
          />
        </Box>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="right-start"
          sx={{ zIndex: (theme) => theme.zIndex.tooltip }}
          modifiers={[
            { name: 'flip', enabled: false },
            { name: 'preventOverflow', options: { padding: 8 } },
          ]}
        >
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <Paper elevation={4} onMouseEnter={clearTimer} onMouseLeave={onLeave}>
              <List dense disablePadding>
                {pages.map((child) => (
                  <ListItemButton
                    key={child.segment}
                    component={Link}
                    to={`/${item.segment}/${child.segment}`}
                    onClick={() => setAnchorEl(null)}
                    sx={{ py: 1 }}
                  >
                    {child.icon && <ListItemIcon>{child.icon}</ListItemIcon>}
                    <ListItemText>{child.title}</ListItemText>
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </>
    );
  }

  return <DashboardSidebarPageItem item={item as any} />;
}

export default MiniNavItem;
