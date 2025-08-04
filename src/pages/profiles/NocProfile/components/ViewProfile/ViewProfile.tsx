import BallotOutlined from '@mui/icons-material/BallotOutlined';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { FieldTemplate, SectionCard } from 'components';
import { EditionMode, EntityType, TemplateType } from 'models';
import { MedalTab } from 'pages/explorer/tabs/MedalTab';
import {
  BiographyCompletion,
  HistoryControl,
  NotesControl,
} from 'pages/biographies-manager/components';
import { BiographyProfileBlock, BiographyProfileInfo } from 'pages/profiles/components';

type Props = {
  data: any;
  setup: any;
  type: EntityType;
  editionMode: EditionMode;
};

export const ViewProfile = (props: Props) => {
  if (props.editionMode !== EditionMode.Detail) return null;

  const id = props.type === EntityType.NocBiography ? props.data.innerId : props.data.id;

  return (
    <>
      <BiographyCompletion {...props} />
      <Grid size={12}>
        <SectionCard title={t('general.generalInformation')} icon={BallotOutlined}>
          <Grid container spacing={2}>
            <BiographyProfileBlock
              data={props.data}
              title={t('general.iocExecutiveBoard')}
              field="iocExecutiveBoard"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              field="iocMembers"
              title={t('general.iocMembers')}
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.anthemTitle')}
              field="anthemTitle"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.anthemComposer')}
              field="anthemComposer"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.anthemInducted')}
              field="anthemInducted"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.flagBearers')}
              field="extendedInfo.flagBearers"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.nocUrl')}
              field="extendedInfo.nocUrl"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.generalBiography')}
              field="generalBiography"
              bold={true}
              markDown={true}
            />
            <Grid size={12}>
              <FieldTemplate
                type={TemplateType.BlockDiscipline}
                value={props.data.disciplines}
                withText={false}
              />
            </Grid>
            <BiographyProfileBlock
              data={props.data}
              title={t('general.additionalInformation')}
              field="additionalInformation"
              bold={true}
            />
          </Grid>
        </SectionCard>
      </Grid>
      <MedalTab
        data={props.data}
        parameter={{ type: EntityType.Organization, id, display: 'id' }}
        includeHeader={true}
      />
      <NotesControl {...props} />
      <HistoryControl {...props} />
      <BiographyProfileInfo data={props.data} />
    </>
  );
};
