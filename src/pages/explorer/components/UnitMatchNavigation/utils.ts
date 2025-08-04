import filter from 'lodash/filter';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import every from 'lodash/every';
import { atomWithHash } from 'jotai-location';
import { t } from 'i18next';
/**
 * Checks if, for all units where 'competitors' is not null or empty,
 * the length of 'competitors' is exactly 2, using optimized Lodash imports.
 *
 * @param {Array<any>} orderedUnits - An array of units, each potentially having a 'competitors' property.
 * @returns {boolean} True if the condition is met for all relevant units, false otherwise.
 */
export function isH2HUnitsSet(orderedUnits: any[]): boolean {
  // Filter units where 'competitors' is not null, undefined, or empty.
  // Using imported 'isNil' and 'isEmpty' directly.
  const unitsWithCompetitors = filter(orderedUnits, (unit) => {
    return !isNil(unit.competitors) && !isEmpty(unit.competitors);
  });

  // Check if all filtered units have a 'competitors' array of length 2.
  // Using imported 'every' and 'isArray' directly.
  return every(unitsWithCompetitors, (unit) => {
    return isArray(unit.competitors) && unit.competitors.length <= 2;
  });
}
export const competitionUnitIdAtom = atomWithHash<string | null>('unitId', null);

/**
 * Computes the longest common prefix (LCP) among the `title` properties of an array of unit objects.
 *
 * The function first extracts the `title` property from each unit, sorts the resulting array of strings,
 * and then compares the first and last strings in the sorted array to determine the LCP.
 *
 * @param orderedUnits - An array of objects, each expected to have a `title` property of type `string`.
 * @returns The longest common prefix shared by all `title` strings in the input array. Returns an empty string if the array is empty or undefined.
 */
const longestCommonPrefix = (orderedUnits: any[]): string => {
  if (!orderedUnits || orderedUnits.length === 0) {
    return '';
  }
  // Sorting helps to find the LCP by only comparing the first and last strings
  // in the sorted array.
  const sortedStrings = [...orderedUnits.map((x) => x.title)].sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0
  ); // Create a shallow copy to avoid modifying original array
  const firstStr = sortedStrings[0];
  const lastStr = sortedStrings[sortedStrings.length - 1];

  let i = 0;
  while (i < firstStr.length && i < lastStr.length && firstStr[i] === lastStr[i]) {
    i++;
  }

  return firstStr.substring(0, i);
};
/**
 * Cleans the 'title' property of each unit in an array by removing the longest common prefix.
 * If no common prefix exists, the original units are returned.
 * @param orderedUnits An array of unit objects, each with a 'title' property.
 * @returns A new array of unit objects with their 'title' properties cleaned.
 */
export const cleanTitles = (orderedUnits: any[]): any[] => {
  if (!orderedUnits || orderedUnits.length === 0) {
    return [];
  }

  const lcp = longestCommonPrefix(orderedUnits);

  // If there's no common prefix, return the original array of units
  // as there's nothing to remove.
  if (!lcp) {
    return orderedUnits;
  }

  // Remove the LCP from each unit's title and return new unit objects
  return orderedUnits.map((unit) => ({
    ...unit, // Keep all other properties of the unit
    displayTitle: `${t('general.group')} ${unit.title.substring(lcp.length).trim()}`, // Update the title
  }));
};
