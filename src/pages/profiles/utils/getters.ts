import { formatMasterCode } from '_helpers';
import baseConfig from 'baseConfig';
import dayjs from 'dayjs';
import get from 'lodash/get';

export const getFullName = (data: any): string => {
  if (!data) return '';

  const givenName = get(data, 'fullGivenName');
  const familyName = get(data, 'fullFamilyName');
  if (!givenName && !familyName) return '';

  if (!givenName) return familyName;

  if (!familyName) return givenName;

  return `${givenName} ${familyName}`;
};

export const getNativeName = (data: any): string => {
  if (!data) return '';

  const givenName = get(data, 'nativeGivenName');
  const familyName = get(data, 'nativeFamilyName');
  if (!givenName && !familyName) return '';

  if (!givenName) return familyName;

  if (!familyName) return givenName;

  return `${givenName} ${familyName}`;
};

export const getPassportName = (data: any): string => {
  if (!data) return '';

  const givenName = get(data, 'passportGivenName');
  const familyName = get(data, 'passportFamilyName');
  if (!givenName && !familyName) return '';

  if (!givenName) return familyName;

  if (!familyName) return givenName;

  return `${givenName} ${familyName}`;
};

export const getDateOfBirth = (data: any): string => {
  if (!data) return '';

  if (!get(data, 'dateOfBirth') && !get(data, 'age')) return '';

  return `${dayjs(get(data, 'dateOfBirth')).format(baseConfig.generalDateFormat).toUpperCase()} (${get(data, 'age')} years)`;
};

export const getBirthInfo = (country: string, data: any): string => {
  if (!data) return '';

  if (country.length > 18) country = formatMasterCode(get(data, 'countryOfBirth'));
  const possiblePaths = [
    'placeOfBirth',
    'extendedInfo.placeOfBirth.details.name',
    'extendedInfo.PlaceBirth.details.name',
    'extendedInfo.placeOfBirth.name',
    'extendedInfo.PlaceBirth.name',
  ];
  const place = possiblePaths.map((path) => get(data, path)).find((v) => v !== undefined);

  if (!place && !country) return '';
  if (!place) return country;
  if (!country) return place;
  return `${place}, ${country}`;
};

export const getDeathInfo = (country: string, data: any): string => {
  if (!data) return '';

  if (country.length > 18) country = formatMasterCode(get(data, 'countryOfDeath'));
  const possiblePaths = [
    'placeOfDeath',
    'extendedInfo.placeOfDeath.details.name',
    'extendedInfo.placeDeath.details.name',
    'extendedInfo.placeOfDeath.name',
    'extendedInfo.PlaceDeath.name',
  ];
  const place = possiblePaths.map((path) => get(data, path)).find((v) => v !== undefined);
  if (!place && !country) return '';

  if (!place) return country;

  if (!country) return place;

  return `${place}, ${country}`;
};

export const getResidenceInfo = (country: string, data: any): string => {
  if (!data) return '';

  if (country.length > 18) country = formatMasterCode(get(data, 'countryOfResidence'));
  const place = get(data, 'placeOfResidence');
  if (!place && !country) return '';

  if (!place) return country;

  return `${place}, ${country}`;
};

export const getLocationInfo = (country: string, data: any): string => {
  if (!data) return '';

  if (country.length > 18) country = formatMasterCode(get(data, 'country'));
  const region = get(data, 'region');
  if (!region && !country) return '';

  if (!region) return country;

  if (!country) return region;

  return `${region}, ${country}`;
};

export const getDateRanges = (data: any): string => {
  if (!data) return '';

  const startDate = get(data, 'startDate');
  const endDate = get(data, 'finishDate');
  if (!startDate && !endDate) return '';

  if (!startDate) return endDate;

  if (!endDate) return startDate;

  return `${dayjs(startDate).format(baseConfig.dayDateFormat).toUpperCase()} to ${dayjs(endDate).format(baseConfig.dayDateFormat).toUpperCase().toUpperCase()}`;
};
export const capitalizeFirstLetter = (str: string | undefined | null): string => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getWithExtended = (data: any, field: string): string | undefined => {
  const possiblePaths = [
    field,
    `extendedInfo.${field}`,
    `extendedInfo.${capitalizeFirstLetter(field)}`,
    `extendedInfo.raw.${field}`,
  ];
  const value = possiblePaths.map((path) => get(data, path)).find((v) => v !== undefined);
  if (!value) return undefined;
  if (typeof value === 'string') {
    if (value.trim() === ',') return undefined;
    return value.trim();
  }
  return value;
};
