import { useState } from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Avatar, Box, Popover, useTheme } from '@mui/material';
import { GridRenderCellParams, GridRowId } from '@mui/x-data-grid-pro';
import { MedalIcon } from '../MedalCard';

export const CalendarCell: React.FC<{
  data: GridRenderCellParams;
  onHover: (rowIndex: GridRowId | null, field: string | null) => void;
}> = ({ data, onHover }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  if (!data.value) return null;
  return (
    <Box>
      <Avatar
        color={data.value.awarded ? 'warning' : 'primary'}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        variant={data.value.awarded ? 'rounded' : 'circular'}
        onMouseEnter={(event) => {
          handlePopoverOpen(event);
          onHover(data.id as number, data.field);
        }}
        onMouseLeave={() => {
          handlePopoverClose();
          onHover(null, null);
        }}
        sx={{
          height: 24,
          width: 24,
          backgroundColor: 'transparent',
          cursor: 'pointer',
        }}
      >
        {data.value.awarded ? (
          <MedalIcon size={20} />
        ) : (
          <FiberManualRecordIcon fontSize="small" color="primary" />
        )}
      </Avatar>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box px={2} py={1}>
          <ol style={{ paddingLeft: '1.5rem', fontSize: theme.typography.body2.fontSize }}>
            {data.value.rounds.map((e: any, index: number) => (
              <li key={index} style={{ marginBottom: 0 }}>
                {e.title}
              </li>
            ))}
          </ol>
        </Box>
      </Popover>
    </Box>
  );
};
