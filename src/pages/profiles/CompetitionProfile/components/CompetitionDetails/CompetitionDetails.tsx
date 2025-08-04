import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { ParticipantsTab } from 'pages/explorer/tabs/ParticipantsTab';
import { CompetitionScheduleTab } from 'pages/explorer/tabs/CompetitionScheduleTab';
import get from 'lodash/get';
import { DisciplinesTab } from 'pages/explorer/tabs/DisciplinesTab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useModelConfig } from 'hooks';
import { EditionMode, EntityType } from 'models';
import { SectionCard } from 'components/cards/SectionCard';
import { CompetitionAwardsTab } from 'pages/explorer/tabs/CompetitionAwardsTab';
import { BiographyProfileBlock, BiographyProfileInfo } from 'pages/profiles/components';
import { ButtonTabHeader } from 'components';
import { atomWithHash } from 'jotai-location';
import { useAtom } from 'jotai';
import { CompetitionRecordsTab } from 'pages/explorer/tabs/CompetitionRecordsTab';
import { Box } from '@mui/material';
type Props = {
  data: any;
  editionMode: EditionMode;
};
const locationAtom = atomWithHash('section', 0);
export const CompetitionDetails: React.FC<Props> = ({
  data,
  editionMode,
}): React.ReactElement | null => {
  const { hasDisciplineRecords } = useModelConfig();
  if (editionMode !== EditionMode.Detail) return null;

  const [value, setValue] = useAtom(locationAtom);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const hasInfo =
    get(data, 'information') ?? get(data, 'mediaInformation') ?? get(data, 'travelInformation');

  if (editionMode !== EditionMode.Detail) return null;
  const parameter = {
    type: EntityType.Competition,
    id: data.id,
    display: 'id',
  };
  const hasRecords =
    data.categories?.includes('CCAT$OLYMPIC_GAMES') &&
    data.disciplines?.some((discipline: any) => hasDisciplineRecords(discipline.sportDisciplineId));
  const tabConfig = [
    {
      value: 0,
      label: t('general.disciplines'),
      component: <DisciplinesTab data={data} parameter={parameter} />,
    },
    {
      value: 1,
      label: t('general.awards'),
      component: <CompetitionAwardsTab data={data} parameter={parameter} />,
    },
    hasRecords && {
      value: 2,
      label: t('general.records'),
      component: <CompetitionRecordsTab data={data} parameter={parameter} />,
    },
    {
      value: 3,
      label: t('general.participants'),
      component: <ParticipantsTab data={data} parameter={parameter} />,
    },
    {
      value: 4,
      label: t('general.schedule'),
      component: <CompetitionScheduleTab data={data} parameter={parameter} />,
    },
  ].filter(Boolean);
  return (
    <>
      <Grid size={12}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="competitions data">
              {tabConfig.map((tab) => (
                <ButtonTabHeader
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  aria-label={tab.value}
                />
              ))}
            </TabList>
          </Box>
          {tabConfig.map((tab) => (
            <TabPanel key={tab.value} value={tab.value} sx={{ px: 0, py: 2 }}>
              {tab.component}
            </TabPanel>
          ))}
        </TabContext>
      </Grid>
      {hasInfo && (
        <Grid size={12}>
          <SectionCard title={t('general.generalInformation')}>
            <Grid container spacing={2}>
              <BiographyProfileBlock
                data={data}
                title={t('general.information')}
                field="information"
              />
              <BiographyProfileBlock data={data} title={t('general.contact')} field="contact" />
              <BiographyProfileBlock
                data={data}
                title={t('general.mediaInformation')}
                field="mediaInformation"
              />
              <BiographyProfileBlock
                data={data}
                title={t('general.travelInformation')}
                field="travelInformation"
              />
            </Grid>
          </SectionCard>
        </Grid>
      )}
      <BiographyProfileInfo data={data} />
    </>
  );
};
