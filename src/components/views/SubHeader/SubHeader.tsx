import { EntityType, IConfigProps, MasterData, TemplateType } from 'models';
import { Stack } from '@mui/system';
import { FieldTemplate } from '../../templates';
import { Button, Chip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { t } from 'i18next';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { useStoreCache } from 'hooks';
import { CountryChip } from 'components/CountryChip';
import dayjs from 'dayjs';
import baseConfig from 'baseConfig';

interface Props {
  element: any;
  config: IConfigProps;
}

export const SubHeader = ({ element, config }: Props) => {
  const { getMasterDataValue } = useStoreCache();

  const getDisciplineAndCountryFields = (disciplines: any, countries: any, title = 'Country') => (
    <Stack direction="row" spacing={1}>
      <FieldTemplate type={TemplateType.ListDiscipline} value={disciplines} withText={false} />
      <FieldTemplate
        type={TemplateType.ListCountry}
        value={countries}
        title={title}
        withText={false}
      />
    </Stack>
  );

  const getChipList = (items: string[]) => (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      {items.map((e: string) => (
        <Chip
          icon={<BookmarkBorderOutlinedIcon fontSize="small" color="primary" />}
          key={e}
          variant="filled"
          label={e}
          sx={{ fontSize: '1rem' }}
        />
      ))}
    </Stack>
  );

  const getCountryList = () => {
    let countries = [];
    if (element.countries?.length > 0) {
      countries = element.countries;
    } else if (element.nationality) {
      countries = [{ code: element.nationality }];
    }
    if (element.nocs?.length > 0) {
      countries = countries.filter((x: any) => !element.nocs.some((y: any) => y.title === x.title));
    }
    return countries;
  };

  const renderDisciplineCountryStack = () => (
    <Stack direction="row" spacing={1}>
      <FieldTemplate
        type={TemplateType.ListDiscipline}
        value={element.disciplines}
        withText={false}
      />
      <FieldTemplate
        type={TemplateType.ListCountry}
        value={element.nocs}
        title={getCountryList().length === 0 ? 'NOC+Country' : 'NOC'}
        withText={false}
      />
      <FieldTemplate
        type={TemplateType.ListCountry}
        value={getCountryList()}
        title="Country"
        withText={false}
      />
    </Stack>
  );

  switch (config.type) {
    case EntityType.Person:
    case EntityType.Horse:
    case EntityType.Team:
      return renderDisciplineCountryStack();

    case EntityType.QualifiedAthlete:
    case EntityType.QualifiedTeam:
      return (
        <Stack direction="row" spacing={1}>
          {element.nationality && (
            <FieldTemplate
              type={TemplateType.Country}
              value={element.nationality}
              withText={false}
            />
          )}
          {element.organisation && (
            <FieldTemplate
              type={TemplateType.Country}
              value={element.organisation}
              withText={false}
            />
          )}
          {element.disciplineCode && (
            <FieldTemplate
              type={TemplateType.ListDiscipline}
              value={[{ code: element.disciplineCode }]}
              withText={false}
            />
          )}
        </Stack>
      );

    case EntityType.Venue:
      if (element.latitude && element.longitude) {
        const googleUrl = `https://maps.google.com/?q=${element.latitude},${element.longitude}`;
        return (
          <Button
            size="small"
            component={Link}
            to={googleUrl}
            target="_blank"
            rel="noreferrer"
            sx={{ p: 0, mx: 0 }}
          >
            {t('actions.open-in-google-maps')}
          </Button>
        );
      }
      return null;

    case EntityType.Competition:
      if (element.country || element.categories?.length > 0) {
        return (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {element.country && (
              <CountryChip sizeNumber={18} code={element.country} hideTitle={false} />
            )}
            {element.categories && getChipList(element.categories)}
          </Stack>
        );
      }
      return null;

    case EntityType.Organization:
      if (element.country && element.disciplines?.length > 0) {
        return getDisciplineAndCountryFields(element.disciplines, [{ code: element.country }]);
      }
      if (element.country) {
        return <CountryChip sizeNumber={18} code={element.country} hideTitle={false} />;
      }
      if (element.disciplines?.length > 0) {
        return <FieldTemplate type={TemplateType.ListDiscipline} value={element.disciplines} />;
      }
      return null;

    case EntityType.Phase:
      return (
        <Chip
          size="medium"
          variant="outlined"
          color="primary"
          label={
            <Typography variant="body1" color="primary">
              {getMasterDataValue(element.type, MasterData.PhaseType)?.value}
            </Typography>
          }
        />
      );
    case EntityType.Stage:
      return (
        <Chip
          size="medium"
          variant="outlined"
          color="primary"
          label={
            <Typography variant="body1" color="primary">
              {getMasterDataValue(element.type, MasterData.StageType)?.value}
            </Typography>
          }
        />
      );
    case EntityType.Event:
      return (
        <Typography variant="subtitle1" component={'h3'} sx={{ lineHeight: 1 }}>
          {`${dayjs(element.startDate).format(baseConfig.fullDayDateFormat)} - ${dayjs(element.finishDate).format(baseConfig.fullDayDateFormat)}`}
        </Typography>
      );
    default:
      return config.display;
  }
};
