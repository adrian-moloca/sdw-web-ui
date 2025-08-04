import Grid from '@mui/material/Grid';
import AssignmentIndOutlined from '@mui/icons-material/AssignmentIndOutlined';
import BallotOutlined from '@mui/icons-material/BallotOutlined';
import { t } from 'i18next';
import { EditionMode, EntityType } from 'models';
import { HistoricalResultsTab } from 'pages/explorer/tabs/HistoricalResultsTab';
import { TeamsTab } from 'pages/explorer/tabs/TeamsTab';
import { MedalTab } from 'pages/explorer/tabs/MedalTab';
import { IndividualOfficials } from 'pages/explorer/components';
import {
  BiographyCompletion,
  HistoryControl,
  NotesControl,
} from 'pages/biographies-manager/components';
import {
  BiographyFamily,
  BiographyProfileBlock,
  BiographyProfileInfo,
} from 'pages/profiles/components';
import { hasGeneralInfo, hasInfo } from 'pages/profiles/utils/person-profile';
import { SectionCard } from 'components';
import { RecordsTab } from 'pages/explorer/tabs/RecordsTab';

type Props = {
  data: any;
  setup: any;
  editionMode: EditionMode;
  type: EntityType;
};

export const ViewProfile = (props: Props) => {
  if (props.editionMode !== EditionMode.Detail) return null;

  const id = props.type === EntityType.PersonBiography ? props.data.innerId : props.data.id;

  return (
    <>
      <BiographyCompletion {...props} />
      {hasGeneralInfo(props.data) && (
        <Grid size={12}>
          <SectionCard title={t('general.generalInformation')} icon={AssignmentIndOutlined}>
            <Grid container spacing={2}>
              <BiographyProfileBlock
                data={props.data}
                field="nickname"
                title={t('general.nickname')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="otherNames"
                title={t('general.otherNames')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="previousNames"
                title={t('general.previousNames')}
              />
              <BiographyProfileBlock data={props.data} field="hand" title={t('general.hand')} />
              <BiographyProfileBlock
                data={props.data}
                field="positionStyle"
                title={t('general.positionStyle')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="clubName"
                title={t('general.clubName')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="nationalTeam"
                title={t('general.nationalTeam')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="nationalLeague"
                title={t('general.nationalLeague')}
              />
              <BiographyProfileBlock data={props.data} field="family" title={t('general.family')} />
              <BiographyProfileBlock
                data={props.data}
                field="maritalStatus"
                title={t('general.maritalStatus')}
              />
              <BiographyProfileBlock data={props.data} field="coach" title={t('general.coach')} />
              <BiographyProfileBlock
                data={props.data}
                title={t('general.spokenLanguages')}
                field="spokenLanguages"
              />
              <BiographyProfileBlock
                data={props.data}
                field="profilePage"
                title={t('general.profilePage')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="education"
                title={t('general.education')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="occupation"
                title={t('general.occupation')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="hobbies"
                title={t('general.hobbies')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="philosophy"
                title={t('general.philosophy')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="otherSports"
                title={t('general.otherSports')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="otherRoles"
                title={t('general.otherRoles')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="sponsors"
                title={t('general.sponsors')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="favoriteGame"
                title={t('general.favoriteGame')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="favoriteSong"
                title={t('general.favoriteSong')}
              />
              <BiographyFamily data={props.data} />
            </Grid>
          </SectionCard>
        </Grid>
      )}
      <Grid size={12}>
        <SectionCard title={t('general.historicalResults')}>
          <HistoricalResultsTab
            data={props.data}
            parameter={{ type: EntityType.Person, id, display: 'id' }}
          />
        </SectionCard>
      </Grid>
      <IndividualOfficials
        data={props.data}
        parameter={{ type: EntityType.Person, id, display: 'id' }}
      />
      <MedalTab
        data={props.data}
        parameter={{ type: EntityType.Person, id, display: 'id' }}
        includeHeader={true}
      />
      <TeamsTab
        data={props.data}
        parameter={{ type: EntityType.Person, id: props.data.id, display: 'id' }}
        includeHeader={true}
      />
      <RecordsTab
        data={props.data}
        parameter={{ type: EntityType.Person, id, display: 'id' }}
        includeHeader={true}
      />
      {hasInfo(props.data) && (
        <Grid size={12}>
          <SectionCard title={t('general.biographyAchievements')} icon={BallotOutlined}>
            <Grid container spacing={2}>
              <BiographyProfileBlock
                data={props.data}
                field="startedCompeting"
                title={t('general.startedCompeting')}
              />
              <BiographyProfileBlock data={props.data} field="reason" title={t('general.reason')} />
              <BiographyProfileBlock
                data={props.data}
                field="ambition"
                title={t('general.ambition')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="memorableAchievement"
                title={t('general.memorableAchievement')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="milestones"
                title={t('general.milestones')}
              />
              <BiographyProfileBlock data={props.data} field="hero" title={t('general.hero')} />
              <BiographyProfileBlock
                data={props.data}
                field="influence"
                title={t('general.influence')}
              />
              <BiographyProfileBlock data={props.data} field="ritual" title={t('general.ritual')} />
              <BiographyProfileBlock
                data={props.data}
                field="sportingRelatives"
                title={t('general.sportingRelatives')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="injuries"
                title={t('general.injuries')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="generalBiography"
                markDown={true}
                title={t('general.generalBiography')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="summary"
                title={t('general.summary')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="officialBiography"
                markDown={true}
                title={t('general.officialBiography')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="officialAppointment"
                title={t('general.officialAppointment')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="coachingBiography"
                title={t('general.coachingBiography')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="coachingAppointment"
                title={t('general.coachingAppointment')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="coachingWinLoss"
                title={t('general.coachingWinLoss')}
              />
              <BiographyProfileBlock
                data={props.data}
                field="training"
                title={t('general.training')}
              />
              <BiographyProfileBlock data={props.data} field="awards" title={t('general.awards')} />
            </Grid>
          </SectionCard>
        </Grid>
      )}
      <NotesControl {...props} />
      <HistoryControl {...props} />
      <BiographyProfileInfo data={props.data} />
    </>
  );
};
