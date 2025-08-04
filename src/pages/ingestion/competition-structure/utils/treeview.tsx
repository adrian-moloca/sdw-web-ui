import { Stack, Typography } from '@mui/material';
import ManOutlinedIcon from '@mui/icons-material/ManOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { CustomTreeItem } from 'components';

export const renderTreeItem = (item: any, theme: any, isUnit: boolean = false) => {
  const hasWarning = item.warning === true;
  const hasError = item.error === true;
  const hasMedal = item.medalFlag !== '0';

  return (
    <CustomTreeItem
      key={item.code}
      itemId={item.code}
      label={
        <Stack alignItems={'left'} direction={'row'} spacing={1}>
          {hasWarning && (
            <WarningAmberOutlinedIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
          )}
          {hasError && (
            <ErrorOutlineOutlinedIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          )}
          <Typography variant="body2">
            {isUnit ? `${item.title} (${item.type})` : item.title}
          </Typography>
          <EmojiEventsOutlinedIcon
            fontSize="small"
            sx={{ color: hasMedal ? theme.palette.primary.main : theme.palette.divider }}
          />
          <AccessTimeOutlinedIcon
            fontSize="small"
            sx={{ color: item.scheduled ? theme.palette.primary.dark : theme.palette.divider }}
          />
        </Stack>
      }
    >
      {item.subunits && item.subunits.length > 0 && renderSubunits(item.subunits, theme)}
      {item.units && item.units.length > 0 && renderUnits(item.units, theme)}
    </CustomTreeItem>
  );
};

export const renderUnits = (units: any[], theme: any) => {
  return units.map((unit) => renderTreeItem(unit, theme, true));
};

export const renderSubunits = (subunits: any[], theme: any) => {
  return subunits.map((subunit) => renderTreeItem(subunit, theme, true));
};

export const renderPhases = (phases: any[], theme: any) => {
  return phases.map((phase) => renderTreeItem(phase, theme));
};

export const renderStages = (stages: any[], theme: any) => {
  return stages.map((stage) => (
    <CustomTreeItem
      key={stage.code}
      itemId={`stage_${stage.code}`}
      label={<Typography variant="body2">{stage.title}</Typography>}
    >
      {stage.phases && stage.phases.length > 0 && renderPhases(stage.phases, theme)}
    </CustomTreeItem>
  ));
};

export const renderEvents = (events: any[], theme: any) => {
  return events.map((event) => (
    <CustomTreeItem
      key={event.code}
      itemId={event.code}
      label={
        <Stack alignItems={'center'} direction={'row'} spacing={1}>
          <Typography variant="body2">{event.title}</Typography>
          {event.isTeam ? (
            <Diversity3OutlinedIcon fontSize="small" sx={{ color: 'primary.main' }} />
          ) : (
            <ManOutlinedIcon fontSize="small" color="secondary" />
          )}
        </Stack>
      }
    >
      {event.stages && event.stages.length > 0 && renderStages(event.stages, theme)}
      {event.phases && event.phases.length > 0 && renderPhases(event.phases, theme)}
    </CustomTreeItem>
  ));
};
