import { t } from 'i18next';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DoDisturbOutlinedIcon from '@mui/icons-material/DoDisturbOutlined';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
export const useAccessRequestData = () => {
  const dataAccessOptions = [
    { value: 'ATHLETES_TEAMS', label: t('access-request.athletes-teams') },
    { value: 'COMPETITIONS', label: t('access-request.competitions') },
    { value: 'HISTORICAL_RESULTS', label: t('access-request.historical-results') },
    { value: 'MASTER_DATA', label: t('access-request.master-data') },
    { value: 'OLYMPIC_RESULTS', label: t('access-request.olympic-results') },
    { value: 'NON_OLYMPIC_RESULTS', label: t('access-request.non-olympic-results') },
    { value: 'SUMMER_DISCIPLINES', label: t('access-request.summer-disciplines') },
    { value: 'WINTER_DISCIPLINES', label: t('access-request.winter-disciplines') },
    { value: 'GAMES_TIME', label: t('access-request.games-time') },
  ];
  const operationAccessOptions = [
    { value: 'DATA_READ_ONLY', label: t('access-request.data-read-only') },
    { value: 'DATA_INGESTION', label: t('access-request.data-ingestion') },
    { value: 'CONSOLIDATION', label: t('access-request.data-edition-and-consolidation') },
    { value: 'BIOGRAPHIES', label: t('access-request.biographies') },
    { value: 'ADMINISTRATION', label: t('access-request.administration') },
    { value: 'MONITORING', label: t('access-request.monitoring') },
    { value: 'NOTIFICATIONS', label: t('access-request.notifications') },
    { value: 'REPORTING', label: t('access-request.reporting') },
    { value: 'I_DONT_KNOW', label: t('access-request.i-don-t-know') },
  ];
  const accessTypeOptions = [
    { label: t('access-request.web-access'), value: 'web' },
    { label: t('access-request.api-access'), value: 'api' },
    { label: t('access-request.web-api-access'), value: 'webApi' },
  ];
  const environmentOptions = [
    { label: t('access-request.development'), value: 'dev' },
    { label: t('access-request.testing'), value: 'qa' },
    { label: t('access-request.end-to-end'), value: 'ee' },
    { label: t('access-request.staging'), value: 'staging' },
    { label: t('access-request.production'), value: 'prod' },
    { label: t('access-request.live'), value: 'live' },
    { label: t('access-request.games'), value: 'og' },
  ];
  const statusOptions = [
    {
      label: t('access-request.status_new'),
      value: 'New',
      icon: ErrorOutlineOutlinedIcon,
      color: 'primary.main',
    },
    {
      label: t('access-request.status_processed'),
      value: 'Processed',
      icon: CheckCircleOutlineOutlinedIcon,
      color: 'success.main',
    },
    {
      label: t('access-request.status_cancelled'),
      value: 'Cancelled',
      icon: DoDisturbOutlinedIcon,
      color: 'error.main',
    },
    {
      label: t('access-request.status_denied'),
      value: 'Denied',
      icon: DoNotDisturbOnOutlinedIcon,
      color: 'error.main',
    },
  ];
  return {
    dataAccessOptions,
    operationAccessOptions,
    accessTypeOptions,
    statusOptions,
    environmentOptions,
  };
};
