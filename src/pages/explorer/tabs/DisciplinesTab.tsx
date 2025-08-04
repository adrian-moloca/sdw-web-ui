import { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { IPanelTabProps } from 'types/views';
import { formatDisciplineList } from '_helpers';
import { EntityType } from 'models';
import { DisciplineEventDetails } from '../components';
import { DisciplineSelect, EventSelect } from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

const disciplineIdAtom = atomWithHash<string | null>('disciplineId', null);
const eventIdAtom = atomWithHash<string | null>('eventId', null);
export const DisciplinesTab = (props: IPanelTabProps) => {
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Discipline);
  const { i18n } = useTranslation();
  const apiService = useApiService();
  const displayDisciplines = formatDisciplineList(props.data?.disciplines);
  const totalDisciplines = displayDisciplines.length ?? 0;

  const [disciplineId, setDisciplineId] = useAtom(disciplineIdAtom);
  const [eventId, setEventId] = useAtom(eventIdAtom);
  const discipline =
    totalDisciplines > 0
      ? disciplineId
        ? (displayDisciplines.find((x) => x.id === disciplineId) ?? displayDisciplines[0])
        : displayDisciplines[0]
      : null;

  const [disciplineEvents, setDisciplineEvents] = useState<any[]>([]);
  const selectedEvent =
    disciplineEvents.length > 0
      ? eventId
        ? (disciplineEvents.find((x) => x.id === eventId) ?? disciplineEvents[0])
        : disciplineEvents[0]
      : null;

  useEffect(() => {
    if (!disciplineId && displayDisciplines.length > 0) {
      setDisciplineId(displayDisciplines[0].id);
    }
  }, [disciplineId, displayDisciplines]);

  useEffect(() => {
    if (discipline) {
      apiService
        .fetch(`${config.apiNode}/${discipline.id}?extended=true&languageCode=${i18n.language}`)
        .then((response) => {
          setDisciplineEvents(response.data.events);
          if (!eventId && response.data.events.length > 0) {
            setEventId(response.data.events[0].id);
          }
        });
    }
  }, [discipline?.id, config.apiNode]);

  if (totalDisciplines === 0) {
    return (
      <Alert severity="info">
        {t('message.notDataAvailable').replace('{0}', t('general.disciplines'))}
      </Alert>
    );
  }
  return (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, md: 5 }}>
        <DisciplineSelect
          disciplines={props.data?.disciplines}
          onSelect={(discipline) => {
            setDisciplineId(discipline.id);
            setEventId(null);
          }}
          selectedDiscipline={discipline}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <EventSelect
          events={disciplineEvents}
          onSelect={(event) => setEventId(event.id)}
          selectedEvent={selectedEvent}
        />
      </Grid>
      {selectedEvent && (
        <Grid size={12}>
          <DisciplineEventDetails data={selectedEvent} discipline={discipline?.sportDisciplineId} />
        </Grid>
      )}
    </Grid>
  );
};
