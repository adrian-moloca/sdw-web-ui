import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { ROUNDS } from 'constants/explorer';
import { Entry } from 'models';

export const getRoundTitle = (row: any, roundTypes: Array<Entry>) => {
  let round = get(row, 'round');

  if (round) {
    if (round === 'RTYP$8') {
      round = 'RTYP$8F';
    }

    const value = roundTypes.find((x: any) => x.key === round);
    const roundTitle = value?.value;

    return roundTitle ?? normalizeTitle(row.title).trim();
  } else {
    return normalizeTitle(row.title).trim();
  }
};
export const numberAvatar = (name: number | string) => {
  return {
    sx: {
      bgcolor: 'white',
      border: '1px solid grey',
      color: 'black',
      width: '36px',
      height: '36px',
      fontSize: '1rem',
    },
    children: name.toString(),
  };
};

export const containsIgnoreCase = (mainString?: string, searchString?: string): boolean => {
  if (!mainString || !searchString) {
    return false;
  }

  // Handle null/undefined cases
  return normalizeTitle(mainString)
    .toLowerCase()
    .includes(normalizeTitle(searchString).toLowerCase());
};

export const normalizeTitle = (input: string) => {
  if (!input) {
    return input;
  }

  const result = input
    .replaceAll("Women's Individual - ", '')
    .replaceAll("Men's Individual - ", '')
    .replaceAll("Women's Individual", '')
    .replaceAll("Men's Individual", '')
    .replaceAll("Women's Team", '')
    .replaceAll('Stage', '')
    .replaceAll('stage', '')
    .replaceAll("Men's Team", '')
    .replaceAll('Mixed Team', '')
    .replaceAll("Women's", '')
    .replaceAll("Men's", '')
    .replaceAll('Women', '')
    .replaceAll('Men', '')
    .replaceAll(',', ' ')
    .replaceAll('  ', ' ')
    .replace('Grp', 'Group')
    .trim()
    .replace(/^[,.]+/, '');

  if (!result) {
    return input;
  }

  return result;
};

export const processResults = (dataContent: any) => {
  const groupedData = groupBy(dataContent?.rounds, 'usdmType');
  const result: Array<any> = [];

  Object.keys(groupedData).forEach((usdmType: string) => {
    switch (usdmType) {
      case ROUNDS.UNIT_TYPE:
      case ROUNDS.PHASE_TYPE:
        {
          const hasStages = groupedData[usdmType].filter((x: any) => x.stage).length > 0;

          if (hasStages) {
            const stages = uniqBy(
              groupedData[usdmType].filter((x: any) => x.stage).map((x: any) => x.stage),
              'id'
            );
            result.push(...stages);

            const remainingRounds = groupedData[usdmType].filter((x: any) => !x.stage);
            if (remainingRounds.length > 0) {
              result.push(...remainingRounds);
            }
          } else {
            result.push(...groupedData[usdmType]);
          }
        }
        break;
      default:
        result.push(...groupedData[usdmType]);
        break;
    }
  });

  return result;
};
