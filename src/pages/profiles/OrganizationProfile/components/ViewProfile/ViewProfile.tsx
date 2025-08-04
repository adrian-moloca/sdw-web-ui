import Grid from '@mui/material/Grid';
import AssignmentIndOutlined from '@mui/icons-material/AssignmentIndOutlined';
import BallotOutlined from '@mui/icons-material/BallotOutlined';
import { t } from 'i18next';
import { MedalTab } from 'pages/explorer/tabs/MedalTab';
import get from 'lodash/get';
import { FieldTemplate, SectionCard } from 'components';
import { EditionMode, EntityType, TemplateType } from 'models';
import { BiographyProfileBlock, BiographyProfileInfo } from 'pages/profiles/components';

type Props = {
  data: any;
  setup: any;
  editionMode: EditionMode;
};

export const ViewProfile = (props: Props) => {
  if (props.editionMode !== EditionMode.Detail) return null;

  const hasNoc = get(props.data, 'noc') != null && get(props.data, 'noc') !== undefined;

  const disciplines =
    props.data.disciplines && props.data.disciplines.length > 0
      ? props.data.disciplines
      : get(props.data, 'sportDisciplineId')
        ? [{ code: get(props.data, 'sportDisciplineId') }]
        : [];

  return (
    <>
      <Grid size={12}>
        <SectionCard title={t('general.generalInformation')} icon={AssignmentIndOutlined}>
          <Grid container spacing={2}>
            <BiographyProfileBlock
              data={props.data}
              title={t('general.generalBiography')}
              field="generalBiography"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.summary')}
              field="summary"
              bold={true}
            />
            <BiographyProfileBlock
              data={props.data}
              title={t('general.contact')}
              field="contact"
              bold={true}
            />
            {disciplines.length > 5 && (
              <Grid size={12}>
                <FieldTemplate
                  type={TemplateType.BlockDiscipline}
                  value={props.data.disciplines}
                  withText={false}
                />
              </Grid>
            )}
          </Grid>
        </SectionCard>
      </Grid>
      {hasNoc && (
        <Grid size={12}>
          <SectionCard title={t('general.noc-profile')} icon={BallotOutlined}>
            <Grid container spacing={2}>
              <BiographyProfileBlock
                data={props.data}
                title={t('general.iocExecutiveBoard')}
                field="noc.iocExecutiveBoard"
                bold={true}
              />
              <BiographyProfileBlock
                data={props.data}
                title={t('general.iocMembers')}
                field="noc.iocMembers"
                bold={true}
              />
              <BiographyProfileBlock
                data={props.data}
                title={t('general.anthemTitle')}
                field="noc.anthemTitle"
                bold={true}
              />
              <BiographyProfileBlock
                data={props.data}
                field="noc.anthemComposer"
                title={t('general.anthemComposer')}
                bold={true}
              />
              <BiographyProfileBlock
                data={props.data}
                field="noc.anthemInducted"
                title={t('general.anthemInducted')}
                bold={true}
              />
              <BiographyProfileBlock
                data={props.data}
                field="noc.extendedInfo.flagBearers"
                title={t('general.flagBearers')}
                bold={true}
              />
              <BiographyProfileBlock
                data={props.data}
                field="noc.extendedInfo.nocUrl"
                title={t('general.olympediaPage')}
                bold={true}
              />
              <BiographyProfileBlock
                data={props.data}
                field="noc.generalBiography"
                title={t('general.generalBiography')}
                bold={true}
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
                field="noc.additionalInformation"
                title={t('general.additional-information')}
                bold={true}
              />
            </Grid>
          </SectionCard>
        </Grid>
      )}
      <MedalTab
        data={props.data}
        parameter={{ type: EntityType.Organization, id: props.data.id, display: 'id' }}
        includeHeader={true}
      />
      <BiographyProfileInfo data={props.data} />
    </>
  );
};
