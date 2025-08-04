import {
  Avatar,
  ButtonBase,
  ClickAwayListener,
  Paper,
  Popper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CallMergeOutlinedIcon from '@mui/icons-material/CallMergeOutlined';
import { useRef, useState } from 'react';
import { EntityType } from 'models';
import { MainCard, Transitions } from 'components';
import { MergeRequestCard } from '../MergeRequestCard';
import useConsolidation from 'hooks/useConsolidation';

type Props = {
  type: EntityType;
  data: any;
};

export const MergeBox = ({ type, data }: Props) => {
  const { hasMerge } = useConsolidation();
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  if (!hasMerge(type)) return null;
  if (!hasMerge(type) || !data) return null;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ButtonBase>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.headerAvatar,
            ...theme.typography.buttonHeaderAvatar,
            transition: 'all .2s ease-in-out',
            '&[aria-controls="menu-merge"],&:hover': {
              background: theme.palette.primary.light,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            },
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-merge' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          <CallMergeOutlinedIcon />
        </Avatar>
      </ButtonBase>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="fade"
            position={matchesXs ? 'top' : 'top-right'}
            direction="up"
            in={open}
            {...TransitionProps}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  boxShadow
                  shadow={theme.shadows[16]}
                  sx={{ width: 380, px: 1 }}
                >
                  <MergeRequestCard data={data} key={data.requestId} />
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};
