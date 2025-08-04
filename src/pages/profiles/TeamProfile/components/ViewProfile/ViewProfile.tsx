import Grid from '@mui/material/Grid';
import { HistoricalResultsTab } from 'pages/explorer/tabs/HistoricalResultsTab';
import { MedalTab } from 'pages/explorer/tabs/MedalTab';
import { TeamMembersTab } from 'pages/explorer/tabs/TeamMembersTab';
import { t } from 'i18next';
import BallotOutlined from '@mui/icons-material/BallotOutlined';
import { EditionMode, EntityType } from 'models';
import {
  BiographyCompletion,
  HistoryControl,
  NotesControl,
  TeamMembersControl,
} from 'pages/biographies-manager/components';
import { hasInfo } from 'pages/profiles/utils/team-profile';
import { BiographyProfileBlock, BiographyProfileInfo } from 'pages/profiles/components';
import { SectionCard } from 'components';

type Props = {
  data: any;
  setup: any;
  editionMode: EditionMode;
  type: EntityType;
};

export const ViewProfile = (props: Props) => {
  if (props.editionMode !== EditionMode.Detail) return null;
  const id = props.type === EntityType.TeamBiography ? props.data.innerId : props.data.id;
  return (
    <>
      <BiographyCompletion {...props} />
      <Grid size={12}>
        <SectionCard title={t('general.historicalResults')}>
          <HistoricalResultsTab
            data={props.data}
            parameter={{ type: EntityType.Team, id, display: 'id' }}
          />
        </SectionCard>
      </Grid>
      <MedalTab
        data={props.data}
        parameter={{ type: EntityType.Team, id, display: 'id' }}
        includeHeader={true}
      />
      <TeamMembersTab
        data={props.data}
        parameter={{ type: EntityType.Team, id, display: 'id' }}
        includeHeader={true}
      />
      {hasInfo(props.data) && (
        <Grid size={12}>
          <SectionCard title={t('general.biographyAchievements')} icon={BallotOutlined}>
            <Grid container spacing={2}>
              <BiographyProfileBlock
                data={props.data}
                field="website"
                title={t('general.website')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="generalBiography"
                markDown={true}
                title={t('general.generalBiography')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="competingBiography"
                markDown={true}
                title={t('general.competingBiography')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="summary"
                title={t('general.summary')}
              />
              <BiographyProfileBlock data={props.data} field="awards" title={t('general.awards')} />
              <BiographyProfileBlock
                data={props.data}
                field="training"
                title={t('general.training')}
              />
            </Grid>
          </SectionCard>
        </Grid>
      )}
      <TeamMembersControl {...props} />
      <NotesControl {...props} />
      <HistoryControl {...props} />
      <BiographyProfileInfo data={props.data} />
    </>
  );
};
