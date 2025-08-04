import { CardContent, Typography, Chip, Tooltip, IconButton, Box, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { t } from 'i18next';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { isGreaterThanMinutes, isSmallerThanMinutes } from '../utils';
import { getChipColor, getChipLabel } from './utils';
import { FlagMeta } from '../types';
import { SpinningRefresh } from './SpinningIcon';

interface Props {
  flag: string;
  value: boolean | string;
  enabled?: boolean;
  meta: FlagMeta;
}
export const FlagContent: React.FC<Props> = ({ flag, value, meta }) => {
  const isBoolean = typeof value === 'boolean';
  const showGreaterIcon =
    meta.moreThanMinutes && isGreaterThanMinutes(value as string, meta.moreThanMinutes);
  const showSmallerIcon =
    meta.lessThanMinutes && isSmallerThanMinutes(value as string, meta.lessThanMinutes);
  function getChipIcon(flag: string, value: boolean): any {
    if (flag == 'isViewSyncActive' || flag == 'isDataIngestActive' || flag == 'isDataWriteActive') {
      return value ? <SpinningRefresh /> : <StopCircleOutlinedIcon />;
    }
    return value ? <CheckCircleIcon /> : <CancelIcon />;
  }
  return (
    <CardContent>
      <Typography variant="caption" lineHeight={1.2} gutterBottom sx={{ color: 'text.secondary' }}>
        {meta.group}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" lineHeight={1.2} fontWeight={500}>
          {meta.label}
        </Typography>
        {meta.link && (
          <Tooltip title={t('general.more-info')}>
            <IconButton size="small" href={meta.link} target="_blank">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {(showGreaterIcon || showSmallerIcon) && (
          <Tooltip title={t('global-setup.view-sync-is-currently-in-progress')}>
            <SyncProblemOutlinedIcon fontSize="small" color="warning" />
          </Tooltip>
        )}
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minHeight: 70, mb: 1 }}
        lineHeight={1.2}
      >
        {meta.description}
      </Typography>
      {showGreaterIcon && (
        <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
          {`> ${meta.moreThanMinutes} ${t('common.minutes')}`}
        </Typography>
      )}
      {showSmallerIcon && (
        <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
          {`< ${meta.lessThanMinutes} ${t('common.minutes')}`}
        </Typography>
      )}
      <Box mt="auto">
        {isBoolean ? (
          <Chip
            size="small"
            label={<Typography variant="body2">{getChipLabel(flag, value)}</Typography>}
            color={getChipColor(flag, value)}
            icon={getChipIcon(flag, value)}
            variant="outlined"
          />
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body1">{value}</Typography>
          </Stack>
        )}
      </Box>
    </CardContent>
  );
};
