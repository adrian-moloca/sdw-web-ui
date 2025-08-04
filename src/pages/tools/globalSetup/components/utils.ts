import { Theme, useColorScheme } from '@mui/material';
import { amber, blue } from '@mui/material/colors';
import { SxProps } from '@mui/system';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { layout } from 'themes/layout';
dayjs.extend(duration);

function getDuration(timeSpanStr: string): duration.Duration | null {
  if (!timeSpanStr) return null;

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (timeSpanStr.includes('.')) {
    // Format: "days.hh:mm:ss"
    const [daysStr, timeStr] = timeSpanStr.split('.');
    if (!daysStr || !timeStr) return null;

    const parts = timeStr.split(':');
    if (parts.length !== 3) return null;

    days = parseInt(daysStr, 10);
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    seconds = parseInt(parts[2], 10);
  } else {
    // Format: "hh:mm:ss"
    const parts = timeSpanStr.split(':');
    if (parts.length !== 3) return null;

    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    seconds = parseInt(parts[2], 10);
  }

  if ([days, hours, minutes, seconds].some(isNaN)) return null;

  const totalDuration = dayjs.duration({
    days,
    hours,
    minutes,
    seconds,
  });

  return totalDuration;
}
export function isGreaterThanMinutes(timeSpanStr: string, thresholdMinutes: number): boolean {
  const totalDuration = getDuration(timeSpanStr);
  if (!totalDuration) return false;

  return totalDuration.asMinutes() > thresholdMinutes;
}
export function isSmallerThanMinutes(timeSpanStr: string, thresholdMinutes: number): boolean {
  const totalDuration = getDuration(timeSpanStr);
  if (!totalDuration) return false;

  return totalDuration.asMinutes() <= thresholdMinutes;
}
export function isEnabled(flag: string, flags: Record<string, boolean | string>): boolean {
  if (flag === 'productionModeEnabled' || flag === 'automaticModeEnabled') {
    const value = flags.canUseProduction;
    return value === 'true' || value === true;
  }
  return true;
}
export function getCardStyle(flag: string, theme: Theme): SxProps<Theme> {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  if (
    flag === 'analyticModeEnabled' ||
    flag === 'productionModeEnabled' ||
    flag === 'automaticModeEnabled'
  ) {
    return {
      borderColor: isDark ? theme.palette.grey[700] : theme.palette.grey[500],
      backgroundColor: isDark ? blue[900] : theme.palette.grey[100],
      borderRadius: layout.radius.md,
    };
  }
  if (flag == 'isViewSyncActive' || flag == 'isDataIngestActive' || flag == 'isDataWriteActive') {
    return {
      borderColor: isDark ? theme.palette.grey[700] : amber[600],
      backgroundColor: isDark ? amber[900] : amber[50],
      borderRadius: layout.radius.md,
    };
  }
  if (flag === 'canUseProduction' || flag === 'shouldUseProduction') {
    return { borderStyle: 'dashed' };
  }
  if (flag === 'dataWriteAge' || flag === 'viewEventAge' || flag === 'viewSyncCheckpointAge') {
    return {
      borderColor: isDark ? theme.palette.grey[700] : blue[400],
      backgroundColor: isDark ? theme.palette.grey[800] : blue[50],
      borderRadius: layout.radius.md,
    };
  }
  return {};
}
export function canStartSync(flags: Record<string, boolean | string>): boolean {
  if (!flags.analyticModeEnabled) return false;
  if (!flags.isGlobalViewSyncEnabled) return false;
  if (flags.isViewSyncActive) return false;
  if (flags.isDataWriteActive) return false;

  const dataWriteDuration = getDuration(flags.dataWriteAge as string);
  const syncCheckpointDuration = getDuration(flags.viewSyncCheckpointAge as string);

  if (!dataWriteDuration || !syncCheckpointDuration) return false;

  // Condition: last sync is older than last DB write
  // Means: viewSyncCheckpointAge > dataWriteAge
  if (syncCheckpointDuration.asSeconds() <= dataWriteDuration.asSeconds()) return false;

  // Condition: at least 5 minutes passed since last write
  if (dataWriteDuration.asMinutes() < 5) return false;

  // Condition: last sync was within 30 minutes
  if (syncCheckpointDuration.asMinutes() > 30) return false;

  return true;
}
