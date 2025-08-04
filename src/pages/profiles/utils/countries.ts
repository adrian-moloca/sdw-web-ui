import uniqBy from 'lodash/uniqBy';

export const mergeCountries = (data: any): any[] => {
  let countries = [];
  if (data.countries && data.countries.length > 0) {
    countries = data.countries;
  }

  if (data.nationality) {
    countries.push({ code: data.nationality });
  }

  if (data.nocs && data.nocs.length > 0) {
    countries = [
      ...countries,
      ...data.nocs
        .filter((c: any) => c.code?.startsWith('NOC'))
        .map((c: any) => ({ code: c.code.replace('NOC', 'CNTR') })),
    ];
  }

  return uniqBy(countries, 'code');
};

export const extractCountries = (data: any): any[] => {
  let countries = [];
  if (data.countries && data.countries.length > 0) {
    countries = data.countries;
  }

  if (data.nationality) {
    countries.push({ code: data.nationality });
  }

  if (data.nocs && data.nocs.length > 0) {
    countries = countries.filter(
      (x: any) =>
        !data.nocs.some((y: any) => y.code.replace('NOC$', '') === x.code?.replace('CNTR$', ''))
    );
  }

  return uniqBy(countries, 'code');
};
