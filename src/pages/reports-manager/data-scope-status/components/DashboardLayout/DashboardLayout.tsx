import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useModelConfig } from 'hooks';
import { EntityType } from 'models';
import { RootState } from 'store';

interface DashboardLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  gap?: number;
  fullHeight?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  leftContent,
  rightContent,
  gap = 3,
  fullHeight = true,
}) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.GdsDashboard);
  const displayMetrics = useSelector(
    (state: RootState) => state.drawer.profile?.[config.type]?.open
  );
  return (
    <Box
      display="flex"
      flexDirection="row"
      gap={gap}
      height={fullHeight ? 'calc(100vh - 100px)' : 'auto'}
      paddingTop={2}
      paddingBottom={2}
      overflow="hidden"
    >
      {displayMetrics && (
        <Box
          sx={{
            width: '282px',
            flexShrink: 0,
            maxHeight: '100%',
            height: 'auto',
            overflowY: 'auto',
          }}
        >
          {leftContent}
        </Box>
      )}

      <Box flexGrow={1} overflow="auto">
        {rightContent}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
