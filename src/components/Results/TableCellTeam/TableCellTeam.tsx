import { Popover, Stack, Typography } from '@mui/material';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import React from 'react';

export const TeamChip = (param: { data: any }) => {
  const competitorType = get(param.data, 'competitorType');
  const name = get(param.data, 'participation_name');
  const participants = get(param.data, 'participants');
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  if (competitorType != 'TEAM') return <>-</>;

  if (participants) {
    return (
      <Stack direction={'row'} spacing={0.2} sx={{ alignItems: 'center' }} component={'span'}>
        <InfoTwoToneIcon style={{ fontSize: '18px' }} />
        <Typography
          variant="body1"
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          {name}
        </Typography>
        <Popover
          id="mouse-over-popover"
          sx={{ pointerEvents: 'none' }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Stack sx={{ p: 2 }}>
            {sortBy(participants, 'name').map((x: any) => (
              <Typography variant="body1" key={x.name}>
                {x.name}
              </Typography>
            ))}
          </Stack>
        </Popover>
      </Stack>
    );
  }
  return <>{name}</>;
};
