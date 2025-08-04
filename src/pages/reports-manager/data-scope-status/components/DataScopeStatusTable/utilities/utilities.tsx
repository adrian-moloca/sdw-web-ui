import { JSX } from 'react';
import { t } from 'i18next';
import FileDownloadDoneOutlinedIcon from '@mui/icons-material/FileDownloadDoneOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { blue, orange, pink, green, lime, teal, purple, amber } from '@mui/material/colors';
import { StatusType } from '../types';

export const scopeTypeMap: Record<string, { label: string; icon: JSX.Element }> = {
  results: {
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
    'partiallyReceived',
    'partiallyReceivedWithErrors',
    'notReceived',
    'notApplicable',
  ].includes(status);
};

export const transformDeliveryScopeRows = (items: any): any[] => {
  if (!items?.length) return [];

  return items.map((item: any) => {
    const cleanCategories =
      item.competitionCategories?.map((cat: any) => cat.replace('CCAT$', '').replace(/_/g, ' ')) ||
      [];

    return {
      id: item.competitionId || `${item.disciplineName}-${item.fromYear}`,
      competitionId: item.competitionId,
      status: item.status,
      readiness: item.readinessPercentage ?? 0,
      disciplineName: item.disciplineName,
      competitionName: item.competitionName || '',
      competitionCategories: cleanCategories,
      fromYear: item.fromYear?.toString() || '',
      toYear: item.toYear?.toString() || '',
      frequency: item.frequency || 0,
      country: item.country || '',
      region: item.region || '',
      season: item.fromYear && item.toYear ? `${item.fromYear}/${item.toYear}` : '',
      scopeTypes: item.scopeType || [],
      lastDataReceivedOn: item.lastDataReceivedOn || '',
      comments: item.comments || '',
      expectedCompetitions: 0,
      successfullyReceived: 0,
    };
  });
};
export const calculateOverallStatus = (scopes: any[]): StatusType => {
  if (!scopes.length) return 'notApplicable';

  const statuses = scopes.map((s) => s.status);

  if (statuses.every((s) => s === 'fullyReceived')) return 'fullyReceived';

  if (statuses.some((s) => s === 'notReceived')) return 'notReceived';

  if (statuses.some((s) => s === 'partiallyReceivedWithErrors'))
    return 'partiallyReceivedWithErrors';

  return 'partiallyReceived';
};
