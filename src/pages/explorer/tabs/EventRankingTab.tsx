import { Alert } from '@mui/material';
import { t } from 'i18next';
import type { IPanelTabProps } from 'types/views';
import { CompetitorTable } from '../components';
import { MainCard } from 'components';

export const EventRankingTab = (props: IPanelTabProps) => {
  if (!props.data?.competitors) {
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.competitors').toLowerCase())}
      </Alert>
    );
  }
  const disciplineCode = props.data?.discipline?.code ?? props.data.sportDisciplineId;
  return (
    <MainCard>
      <CompetitorTable data={props.data.competitors} discipline={disciplineCode} ranking={true} />
    </MainCard>
  );
};
