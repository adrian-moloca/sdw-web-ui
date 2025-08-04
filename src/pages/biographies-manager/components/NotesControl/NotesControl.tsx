import { EntityType } from 'models';
import { Badge, Grid } from '@mui/material';
import { SectionCard } from 'components';
import { t } from 'i18next';
import SpeakerNotesTwoTone from '@mui/icons-material/SpeakerNotesTwoTone';
import { NoteDisplayControl } from '../NoteDisplayControl';
import { NoteCreateControl } from '../NoteCreateControl';

type Props = { type: EntityType; data: any };

export const NotesControl = (props: Props): React.ReactElement | null => {
  const { data, type } = props;

  if (
    ![
      EntityType.PersonBiography,
      EntityType.HorseBiography,
      EntityType.TeamBiography,
      EntityType.NocBiography,
    ].includes(type)
  ) {
    return null;
  }

  return (
    <Grid size={12}>
      <SectionCard
        title={t('general.notes-and-comments')}
        avatar={
          <Badge color="primary" badgeContent={data.notes?.length ?? 0} showZero>
            <SpeakerNotesTwoTone />
          </Badge>
        }
      >
        <Grid container spacing={1}>
          {data?.notes?.map((x: any, index: number) => (
            <NoteDisplayControl {...props} data={x} key={index} />
          ))}
          <NoteCreateControl {...props} />
        </Grid>
      </SectionCard>
    </Grid>
  );
};
