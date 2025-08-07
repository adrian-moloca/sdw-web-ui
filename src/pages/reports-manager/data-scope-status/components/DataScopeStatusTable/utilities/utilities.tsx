import { JSX } from 'react';
import { t } from 'i18next';
import FileDownloadDoneOutlinedIcon from '@mui/icons-material/FileDownloadDoneOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { blue, orange, pink, green, lime, teal, purple, amber } from '@mui/material/colors';
import { StatusType } from 'types/delivery-data-scope';

export const scopeTypeMap: Record<string, { label: string; icon: JSX.Element }> = {
  results: {
    label: t('general.results'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: blue[800], fontSize: 18 }} />,
  },
  fullResults: {
    label: t('general.fullResults'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: blue[800], fontSize: 18 }} />,
  },
  ranking: {
    label: t('general.ranking'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: orange[800], fontSize: 18 }} />,
  },
  medallists: {
    label: t('general.medallists'),
    icon: <WorkspacePremiumOutlinedIcon sx={{ color: pink[600], fontSize: 18 }} />,
  },
  teamMembers: {
    label: t('general.team-members'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: green[600], fontSize: 18 }} />,
  },
  pools: {
    label: t('general.pools'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: lime[800], fontSize: 18 }} />,
  },
  resultsBreakdown: {
    label: t('general.resultsBreakdown'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: blue[800], fontSize: 18 }} />,
  },
  seasonalStandings: {
    label: t('general.seasonal-standings'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: teal[800], fontSize: 18 }} />,
  },
  seasonalRankings: {
    label: t('general.seasonal-rankings'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: purple[800], fontSize: 18 }} />,
  },
  overallStandings: {
    label: t('general.overall-standings'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: amber[800], fontSize: 18 }} />,
  },
  relay: {
    label: t('general.relay'),
    icon: <FileDownloadDoneOutlinedIcon sx={{ color: blue[800], fontSize: 18 }} />,
  },
};

export const getScopeTypeConfig = (type: string) => scopeTypeMap[type];

export const isValidStatus = (status: string | undefined): status is StatusType => {
  if (!status) return false;

  return [
    'fullyReceived',
    'partiallyReceivedWithErrors',
    'partiallyReceivedWithoutErrors',
    'notReceived',
    'notApplicable',
  ].includes(status);
};

export const calculateOverallStatus = (scopes: any[]): any => {
  if (!scopes.length) return 'notApplicable';

  const statuses = scopes.map((s) => s.status);

  if (statuses.every((s) => s === 'fullyReceived')) return 'fullyReceived';

  if (statuses.some((s) => s === 'notReceived')) return 'notReceived';

  if (statuses.some((s) => s === 'partiallyReceivedWithErrors'))
    return 'partiallyReceivedWithErrors';

  return 'partiallyReceived';
};
