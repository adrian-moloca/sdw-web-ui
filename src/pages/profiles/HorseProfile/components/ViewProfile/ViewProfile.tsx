import Grid from '@mui/material/Grid';
import BallotOutlined from '@mui/icons-material/BallotOutlined';
import { t } from 'i18next';
import { HistoricalResultsTab } from 'pages/explorer/tabs/HistoricalResultsTab';
import { MedalTab } from 'pages/explorer/tabs/MedalTab';
import { RidersTab } from 'pages/explorer/tabs/RidersTab';
import {
  BiographyCompletion,
  HistoryControl,
  NotesControl,
} from 'pages/biographies-manager/components';
import { BiographyProfileBlock, BiographyProfileInfo } from 'pages/profiles/components';
import { hasInfo } from 'pages/profiles/utils/horse-profile';
import { EditionMode, EntityType } from 'models';
import { SectionCard } from 'components/cards/SectionCard';

type Props = {
  data: any;
  setup: any;
  editionMode: EditionMode;
  type: EntityType;
};

export const ViewProfile = (props: Props) => {
  if (props.editionMode !== EditionMode.Detail) return null;

  const id = props.type == EntityType.HorseBiography ? props.data.innerId : props.data.id;

  return (
    <>
      <BiographyCompletion {...props} />
      <Grid size={12}>
        <SectionCard title={t('general.historicalResults')}>
          <HistoricalResultsTab
            data={props.data}
            parameter={{ type: EntityType.Horse, id, display: 'id' }}
          />
        </SectionCard>
      </Grid>
      <MedalTab
        data={props.data}
        parameter={{ type: EntityType.Horse, id, display: 'id' }}
        includeHeader={true}
      />
      <RidersTab
        data={props.data}
        parameter={{ type: EntityType.Horse, id, display: 'id' }}
        includeHeader={true}
      />
      {hasInfo(props.data) && (
        <Grid size={12}>
          <SectionCard title={t('general.biographyInformation')} icon={BallotOutlined}>
            <Grid container spacing={2}>
              <BiographyProfileBlock data={props.data} field={'dam'} title={t('general.dam')} />
              <BiographyProfileBlock data={props.data} field={'sire'} title={t('general.sire')} />
              <BiographyProfileBlock
                data={props.data}
                field={'breeder'}
                title={t('general.breeder')}
              />
              <BiographyProfileBlock data={props.data} field={'owner'} title={t('general.owner')} />
              <BiographyProfileBlock
                data={props.data}
                field={'secondOwner'}
                title={t('general.secondOwner')}
              />
              <BiographyProfileBlock
                data={props.data}
                field={'website'}
                title={t('general.website')}
              />
              <BiographyProfileBlock
                data={props.data}
                field={'generalBiography'}
                markDown={true}
                title={t('general.generalBiography')}
              />
              <BiographyProfileBlock
                data={props.data}
                field={'competingBiography'}
                markDown={true}
                title={t('general.competingBiography')}
              />
              <BiographyProfileBlock
                data={props.data}
                field={'studBook'}
                title={t('general.studBook')}
              />
              <BiographyProfileBlock
                data={props.data}
                field={'summary'}
                title={t('general.summary')}
              />
              <BiographyProfileBlock
                data={props.data}
                field={'awards'}
                title={t('general.awards')}
              />
              <BiographyProfileBlock
                data={props.data}
                field={'training'}
                title={t('general.training')}
              />
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
