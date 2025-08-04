import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Grid from '@mui/material/Grid';
import MoreOutlined from '@mui/icons-material/MoreOutlined';
import { t } from 'i18next';
import { SectionCard, DisplayTable } from 'components';
import omitBy from 'lodash/omitBy';

type Props = {
  data: any;
};

export const BiographyProfileInfo = (param: Props) => {
  const extendedInfo = get(param.data, 'extendedInfo');

  if (!extendedInfo || isEmpty(extendedInfo)) return null;
  const excludedPrefixes = [
    'familyRelations',
    'placeBirth',
    'placeDeath',
    'placeOfBirth',
    'placeOfDeath',
    'raw.sex',
    'raw.colour',
    'equipment',
    'title',
    'hand',
    'weight',
  ];
  const cleaned = omitBy(extendedInfo, (_, key) =>
    excludedPrefixes.some((prefix) => key?.toLowerCase().startsWith(prefix.toLowerCase()))
  );
  if (!cleaned || isEmpty(cleaned)) return null;
  return (
    <Grid size={12}>
      <SectionCard title={t('general.extendedInfo')} icon={MoreOutlined} defaultExpanded={false}>
        <Grid size={12}>{DisplayTable(cleaned)}</Grid>
      </SectionCard>
    </Grid>
  );
};
