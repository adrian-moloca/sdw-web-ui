import { t } from 'i18next';
import { FieldTemplate } from 'components';
import { TemplateType } from 'models';
import { extractCountries, mergeCountries } from '../../utils/countries';

import uniq from 'lodash/uniq';

type Props = { data: any };

export const ProfileItemCountry = (props: Props) => {
  if (!props.data) return null;

  const countries = mergeCountries(props.data);
  if (countries.length > 1)
    return (
      <>
        <FieldTemplate
          type={TemplateType.ListCountry}
          value={uniq(props.data.nocs?.filter((c: any) => c.code.startsWith('NOC')))}
          title="NOC"
          withText={false}
        />
        <FieldTemplate
          type={TemplateType.ListCountry}
          value={extractCountries(props.data)}
          title={t('general.country')}
          withText={false}
        />
      </>
    );

  return (
    <FieldTemplate
      type={TemplateType.ListCountry}
      value={countries}
      title={t('general.noc-and-country')}
      withText={false}
    />
  );
};
