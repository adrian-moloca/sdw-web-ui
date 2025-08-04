import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { EnumType, MasterData, useEnums } from 'models';
import { useStoreCache } from 'hooks';
import { MainCard } from 'components';
import baseConfig from 'baseConfig';

export const InfoSection = ({ title, data }: { title: string; data: string[] }) =>
  data.length > 0 && (
    <Typography variant="body2">
      <span>{`${title}:  `}</span>
      <span style={{ fontWeight: '600' }}>{data.join(', ')}</span>
    </Typography>
  );

export const formatDate = (title: string, date: string | undefined) =>
  date && (
    <Typography variant="body2">
      <span>{`${title}:  `}</span>
      <span style={{ fontWeight: '600' }}>
        {dayjs(date).format(baseConfig.generalDateFormat).toUpperCase()}
      </span>
    </Typography>
  );

export const SectionDefaultFilterDisplay = ({ data }: { data: any }) => {
  const { getEnumValueOf } = useEnums();
  const {
    disciplines,
    genders,
    categories,
    events,
    sources,
    participantTypes,
    startDate,
    finishDate,
  } = data;
  const { getDisciplineEntry, getMasterDataValue, getSourceEntry } = useStoreCache();

  return (
    <Grid size={12}>
      <MainCard contentSX={{ paddingBottom: '12px !important', paddingTop: '12px !important' }}>
        {disciplines && (
          <InfoSection
            title={t('general.disciplines')}
            data={disciplines.map((x: string) => getDisciplineEntry(x).value)}
          />
        )}
        {genders && (
          <InfoSection
            title={t('general.genders')}
            data={genders.map((x: string) => getMasterDataValue(x, MasterData.SportGender).value)}
          />
        )}
        {categories && <InfoSection title={t('general.competitionCategories')} data={categories} />}
        {events && (
          <InfoSection
            title={t('general.events')}
            data={events.map((x: string) => getMasterDataValue(x, MasterData.EventType).value)}
          />
        )}
        {sources && (
          <InfoSection
            title={t('general.sources')}
            data={sources.map((x: string) => getSourceEntry(x).title)}
          />
        )}
        {participantTypes && (
          <InfoSection
            title={t('general.participationTypes')}
            data={participantTypes.map(
              (x: string) => getEnumValueOf(x, EnumType.ReportParticipantType)?.text
            )}
          />
        )}
        {formatDate(t('common.startDate'), startDate)}
        {formatDate(t('common.finishDate'), finishDate)}
      </MainCard>
    </Grid>
  );
};
