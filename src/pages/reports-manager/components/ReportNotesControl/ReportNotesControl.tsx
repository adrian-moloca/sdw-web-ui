import { Badge } from '@mui/material';
import Grid from '@mui/material/Grid';
import { MainCard } from 'components/cards/MainCard';
import { t } from 'i18next';
import SpeakerNotesTwoTone from '@mui/icons-material/SpeakerNotesTwoTone';
import { NoteDisplayControl } from '../NoteDisplayControl';
import { NoteCreateControl } from '../NoteCreateControl';

type Props = {
  data: any;
};

export const ReportNotesControl = (props: Props) => {
  return (
    <Grid size={12}>
      <MainCard
        size="small"
        border={false}
        title={t('general.notes-and-comments')}
        avatar={
          <Badge color="primary" badgeContent={props.data.notes?.length ?? 0} showZero>
            <SpeakerNotesTwoTone />
          </Badge>
        }
        expandable={true}
      >
        <Grid container spacing={1}>
          {props.data?.notes?.map((x: any, index: number) => (
            <NoteDisplayControl data={x} key={index} />
          ))}
          <NoteCreateControl {...props} />
        </Grid>
      </MainCard>
    </Grid>
  );
};
