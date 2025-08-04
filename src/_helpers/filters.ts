import get from 'lodash/get';
import { SearchQueryWhere, EntityType } from 'models';
import dayjs from 'dayjs';
import { removeDiacritics } from './utils';
import { FilterMode, BuildFilter } from 'types/filters';

interface Props {
  type: EntityType;
  data: any;
}
interface BuildProps extends Props {
  mode: FilterMode;
}

const buildGeneralNameFilter = (name: string): SearchQueryWhere => {
  const filter: SearchQueryWhere = {
    subQuery: {
      operator: 'OR',
      where: [{ column: 'name', value: `*${name.replace("'", ' ').trim()}*` }],
    },
  };

  const splitArray = name.split(/[ '-]/);
  if (splitArray.filter((x: string) => x.length > 3).length > 0) {
    splitArray
      .filter((x: string) => x.length > 3)
      .forEach((subName: string) => {
        filter.subQuery?.where?.push({
          column: 'name',
          value: `*${subName.replace("'", ' ').trim()}*`,
        });
      });
  }

  return filter;
};

const buildLocationNameFilter = (name: string): SearchQueryWhere => {
  const filter: SearchQueryWhere = {
    subQuery: {
      operator: 'OR',
      where: [{ column: 'name', value: `*${name.replace("'", ' ').trim()}*` }],
    },
  };

  const commonWords = [
    'center',
    'centre',
    'country',
    'club',
    'stadium',
    'depot',
    'ground',
    'park',
    'arena',
    'complex',
    'sports',
    'urban',
    'lot',
    'area',
    'field',
    'hall',
    'ground',
    'villa',
    'square',
    'national',
    'gymnasium',
    'village',
    'venue',
    'coliseum',
    'resort',
    'mountain',
    'grand',
    'valley',
    'santa',
    'san',
  ];

  const splitArray = name.split(/[ -]/);
  if (splitArray.filter((x: string) => x.length > 2).length > 0) {
    splitArray
      .filter((x: string) => x.length > 2)
      .filter((x: string) => !commonWords.includes(x.trim().toLowerCase()))
      .forEach((subName: string) => {
        filter.subQuery?.where?.push({
          column: 'name',
          value: `*${subName.trim().replace("'", ' ')}*`,
        });
      });
  }

  return filter;
};

const buildFamilyNameFilter = (name: string): SearchQueryWhere => {
  const filter: SearchQueryWhere = {
    subQuery: {
      operator: 'OR',
      where: [
        { column: 'preferredFamilyName', value: `*${name.replace("'", ' ')}*` },
        { column: 'preferredGivenName', value: `*${name.replace("'", ' ')}*` },
        { column: 'nickName', value: `*${name.replace("'", ' ')}*` },
      ],
    },
  };

  const nonDiacritics = removeDiacritics(name);
  if (nonDiacritics !== name) {
    filter.subQuery?.where?.push({
      column: 'preferredFamilyName',
      value: `*${nonDiacritics.replace("'", ' ')}*`,
    });
    filter.subQuery?.where?.push({
      column: 'preferredGivenName',
      value: `*${nonDiacritics.replace("'", ' ')}*`,
    });
  }

  const commonWords = [
    'van',
    'von',
    'den',
    'del',
    'der',
    'de',
    'do',
    'da',
    'al',
    'el',
    'jr',
    'bin',
  ];

  const splitArray = name.split(/[ '-]/);
  if (splitArray.length > 1) {
    splitArray
      .filter((x: string) => x.length > 1)
      .filter((x: string) => !commonWords.includes(x.trim().toLowerCase()))
      .forEach((subName: string) => {
        filter.subQuery?.where?.push({
          column: 'preferredFamilyName',
          value: `*${subName.replace("'", ' ')}*`,
        });
        filter.subQuery?.where?.push({
          column: 'preferredGivenName',
          value: `*${subName.replace("'", ' ')}*`,
        });
      });
  }

  return filter;
};

const buildGivenNameFilter = (name: string): SearchQueryWhere => {
  const splitArray = name.split(/[ '-]/);
  if (splitArray.length > 1) {
    const filter: SearchQueryWhere = {
      subQuery: {
        operator: 'OR',
        where: [{ column: 'preferredGivenName', value: `*${name.replace("'", ' ')}*` }],
      },
    };
    splitArray.forEach((subName: string) => {
      filter.subQuery?.where?.push({
        column: 'preferredGivenName',
        value: `*${subName.replace("'", ' ')}*`,
      });
    });
  }

  const nonDiacritics = removeDiacritics(name);

  if (nonDiacritics !== name) {
    const filter: SearchQueryWhere = {
      subQuery: {
        operator: 'OR',
        where: [
          { column: 'preferredGivenName', value: `*${name.replace("'", ' ')}*` },
          { column: 'preferredGivenName', value: `*${nonDiacritics.replace("'", ' ')}*` },
        ],
      },
    };
    return filter;
  }

  return { column: 'preferredGivenName', value: `*${name.replace("'", ' ')}*` };
};

const buildHorseFilters = (props: BuildProps, filters: SearchQueryWhere[]) => {
  const name = get(props.data, 'name');
  if (name) {
    filters.push(buildGeneralNameFilter(name));
  }

  const gender = get(props.data, 'sex');
  if (props.mode.gender && gender) {
    filters.push({ column: 'sex', value: gender });
  }

  const yearOfBirth = get(props.data, 'yearOfBirth');
  if (props.mode.date && yearOfBirth) {
    filters.push({ column: 'yearOfBirth', value: [yearOfBirth], operator: 'OR' });
  }

  const countryOfBirth = get(props.data, 'countryOfBirth');
  if (props.mode.country && countryOfBirth) {
    filters.push({ column: 'countryOfBirth', value: countryOfBirth });
  }
};

const buildTeamFilters = (props: BuildProps, filters: SearchQueryWhere[]) => {
  const name = get(props.data, 'name');
  if (props.mode.name && name) {
    filters.push(buildGeneralNameFilter(name));
  }

  const gender = get(props.data, 'gender');
  if (props.mode.gender && gender) {
    filters.push({ column: 'gender', value: gender });
  }

  const nationality = get(props.data, 'nationality');
  if (props.mode.country && nationality) {
    filters.push({ column: 'nationality', value: nationality });
  }

  const discipline = get(props.data, 'discipline') ?? get(props.data, 'sportDisciplineId');
  if (props.mode.discipline && discipline) {
    filters.push({ column: 'sportDisciplineId', value: `*${discipline}` });
  }

  const type = get(props.data, 'type') ?? get(props.data, 'teamType');
  if (props.mode.type && type) {
    filters.push({ column: 'type', value: type });
  }

  const eventType = get(props.data, 'eventType') ?? get(props.data, 'eventType');
  if (props.mode.eventType && eventType) {
    filters.push({ column: 'eventType', value: eventType });
  }
};

const buildVenueFilters = (props: BuildProps, filters: SearchQueryWhere[]) => {
  const name = get(props.data, 'name');
  if (name) {
    filters.push(buildLocationNameFilter(name));
  }

  const country = get(props.data, 'country');
  if (props.mode.country && country) {
    filters.push({ column: 'country', value: country });
  }
};

const buildOrganizationFilters = (props: BuildProps, filters: SearchQueryWhere[]) => {
  const name = get(props.data, 'name');
  if (props.mode.name && name) {
    filters.push(buildGeneralNameFilter(name));
  }

  const country = get(props.data, 'country');
  if (props.mode.country && country) {
    filters.push({ column: 'country', value: country });
  }

  const discipline = get(props.data, 'discipline') ?? get(props.data, 'sportDisciplineId');
  if (props.mode.discipline && discipline) {
    filters.push({ column: 'sportDisciplineId', value: `*${discipline}` });
  }

  const type = get(props.data, 'type');
  if (props.mode.type && type) {
    filters.push({ column: 'type', value: type });
  }
};

const buildDefaultFilters = (props: BuildProps, filters: SearchQueryWhere[]) => {
  const name = get(props.data, 'preferredFamilyName') ?? get(props.data, 'familyName');
  if (name) {
    filters.push(buildFamilyNameFilter(name));
  }

  const gender = get(props.data, 'gender');
  if (props.mode.gender && gender) {
    filters.push({ column: 'gender', value: gender });
  }

  const nationality = get(props.data, 'nationality') ?? get(props.data, 'countryOfBirth');
  if (props.mode.country && nationality) {
    filters.push({ column: 'countryOfBirth', value: nationality });
  }

  const dateOfBirth = get(props.data, 'dateOfBirth');
  if (props.mode.date && dateOfBirth) {
    filters.push({ column: 'dateOfBirth', value: dayjs(dateOfBirth).format('YYYY-MM-DD') });
  }

  const preferredGivenName = get(props.data, 'preferredGivenName') ?? get(props.data, 'givenName');
  if (props.mode.name && preferredGivenName) {
    filters.push(buildGivenNameFilter(preferredGivenName));
  }
};

export const buildFilter = (props: BuildProps): BuildFilter => {
  const filters: Array<SearchQueryWhere> = [];
  const search: string = '';

  switch (props.type) {
    case EntityType.Horse: {
      buildHorseFilters(props, filters);
      break;
    }
    case EntityType.Team: {
      buildTeamFilters(props, filters);
      break;
    }
    case EntityType.Venue: {
      buildVenueFilters(props, filters);
      break;
    }
    case EntityType.Organization: {
      buildOrganizationFilters(props, filters);
      break;
    }
    default: {
      buildDefaultFilters(props, filters);
      break;
    }
  }

  const result: BuildFilter = {
    filters: { where: filters, operator: 'AND' },
    search,
  };
  return result;
};

export const defaultFilterMode = (props: Props): FilterMode => {
  switch (props.type) {
    case EntityType.Horse: {
      const yearOfBirth = get(props.data, 'yearOfBirth');
      return {
        date: yearOfBirth != undefined,
        country: false,
        gender: false,
        name: false,
        type: false,
        discipline: false,
      };
    }
    case EntityType.Team: {
      const nationality = get(props.data, 'nationality');
      const gender = get(props.data, 'gender');
      const eventType = get(props.data, 'eventType');
      return {
        date: false,
        country: nationality != undefined,
        gender: gender != undefined,
        name: true,
        type: false,
        discipline: true,
        eventType: eventType != undefined,
      };
    }
    case EntityType.Venue: {
      const country = get(props.data, 'country');
      return {
        date: false,
        country: country != undefined,
        gender: false,
        name: false,
        type: false,
        discipline: false,
      };
    }
    case EntityType.Organization: {
      const country = get(props.data, 'country');
      const type = get(props.data, 'type');
      return {
        date: false,
        country: country != undefined,
        gender: false,
        name: true,
        type: type != undefined,
        discipline: true,
      };
    }
    default: {
      const gender = get(props.data, 'gender');
      const dateOfBirth = get(props.data, 'dateOfBirth');
      const preferredGivenName =
        get(props.data, 'preferredGivenName') ?? get(props.data, 'givenName');
      return {
        date: dateOfBirth != undefined && dayjs(dateOfBirth).year() > 1,
        country: false,
        gender: gender != undefined,
        name: preferredGivenName != undefined,
        type: false,
        discipline: false,
      };
    }
  }
};

export const setupFilterMode = (props: Props): FilterMode => {
  switch (props.type) {
    case EntityType.Horse: {
      const yearOfBirth = get(props.data, 'yearOfBirth');
      const countryOfBirth = get(props.data, 'countryOfBirth');
      const gender = get(props.data, 'sex');
      return {
        date: yearOfBirth != undefined,
        country: countryOfBirth != undefined,
        gender: gender != undefined,
        name: false,
        type: false,
        discipline: false,
      };
    }
    case EntityType.Team: {
      const nationality = get(props.data, 'nationality');
      const discipline = get(props.data, 'discipline') ?? get(props.data, 'sportDisciplineId');
      const gender = get(props.data, 'gender');
      const eventType = get(props.data, 'eventType');
      return {
        date: false,
        country: nationality != undefined,
        gender: gender != undefined,
        name: true,
        type: true,
        discipline: discipline != undefined,
        eventType: eventType != undefined,
      };
    }
    case EntityType.Venue: {
      return {
        date: false,
        country: true,
        gender: false,
        name: false,
        type: false,
        discipline: false,
      };
    }
    case EntityType.Organization: {
      const disciplined = get(props.data, 'discipline') ?? get(props.data, 'sportDisciplineId');
      return {
        date: false,
        country: true,
        gender: false,
        name: true,
        type: true,
        discipline: disciplined != undefined,
      };
    }
    default: {
      const nationality = get(props.data, 'nationality') ?? get(props.data, 'countryOfBirth');
      const dateOfBirth = get(props.data, 'dateOfBirth');
      const preferredGivenName =
        get(props.data, 'preferredGivenName') ?? get(props.data, 'givenName');
      return {
        date: dateOfBirth != undefined && dayjs(dateOfBirth).year() > 1,
        country: nationality != undefined,
        gender: true,
        name: preferredGivenName != undefined,
        type: false,
        discipline: false,
      };
    }
  }
};
