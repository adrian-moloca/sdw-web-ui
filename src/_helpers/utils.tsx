import dayjs from 'dayjs';
import React from 'react';
import durationPlugin from 'dayjs/plugin/duration';
import get from 'lodash/get';
import { MenuFlagEnum } from 'models';
import { Logger } from './logger';
import baseConfig from 'baseConfig';

export const isDevelopment = import.meta.env.NODE_ENV === 'development';

export const isFunction = (el: any) => typeof el === 'function';

export const isNullOrEmpty = (el: string | null | undefined) =>
  el === null ||
  el === undefined ||
  el === 'null' ||
  el === 'NULL' ||
  el === '' ||
  el === ' ' ||
  el === ',' ||
  el === '-';

export const renderHTML = (rawHTML: string) =>
  React.createElement('span', { dangerouslySetInnerHTML: { __html: rawHTML } });

export const acronymOf = (str: string): string => {
  if (!str) return 'AA';

  const matches = str.match(/\b(\w)/g);
  return matches?.join('') ?? '';
};

export const twoLetterAcronym = (str: string | undefined): string => {
  if (!str) return 'AA';

  const result = acronymOf(str);

  if (result.length > 2) return result.substring(0, 2);
  if (result.length < 2) return str.substring(0, 2).toUpperCase();

  return result;
};

type ParseJsonResult = {
  isParsed: boolean;
  values: any;
};

export const parseJson = (json: string): ParseJsonResult => {
  let isParsed: boolean = false;
  let values: any = null;

  try {
    values = JSON.parse(json);
    isParsed = true;
    // eslint-disable-next-line
  } catch (e) {
    Logger.error(`Could not parse json`);
  }

  return { isParsed, values };
};

export const loadStorage = (key: string, defaultValue: any): any => {
  const stickyValue = localStorage.getItem(key);

  return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
};

export const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const stringImageAvatar = (name: string) => {
  return {
    children: twoLetterAcronym(name).toUpperCase(),
  };
};

export const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      color: 'white',
      width: '56px',
      height: '56px',
      fontSize: '1.4rem',
    },
    children: twoLetterAcronym(name).toUpperCase(),
  };
};

export const stringLargeAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      color: 'white',
      width: '100px',
      height: '100px',
      fontSize: '2rem',
    },
    children: twoLetterAcronym(name).toUpperCase(),
  };
};

export const toPascalCase = (data: string): string => {
  return data
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

export const humanize = (str: string): string => {
  if (!str) return '';
  if (isNumeric(str)) return str;

  return capitalizeEachWord(
    str
      .trim()
      .replace(/^_+/, '')
      .replace(/_{1,1000}$/g, '')
      .replace(/[_\s]+/g, ' ')
      .replace(/^[a-z]/, (m) => m.toUpperCase())
  );
};

export const isValidDate = (value: any) => {
  // List of possible date formats to check
  const dateFormats = [
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'DD-MM-YYYY',
    'YYYY.MM.DD',
    'DD.MM.YYYY',
    'MMM DD, YYYY',
    'DD MMM YYYY',
    // Add more formats as needed
  ];

  // Check if the date is valid with the allowed formats
  const date = dayjs(value, dateFormats, true);

  return date.isValid() && date.isSame(dayjs(date.format('YYYY-MM-DD'), 'YYYY-MM-DD'), 'day');
};

const capitalizeEachWord = (input: string): string => {
  if (!input) return '';

  return input.toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
};

export const pascalizeWithSpaces = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const camelize = (text: string): string => {
  return text
    .replace('_', ' ')
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
};

export const camelCaseToWords = (text: string): string => {
  if (!text || isNumeric(text)) return text;

  return text
    .toLowerCase()
    .replaceAll('_', ' ')
    .replaceAll('.', ' ')
    .split(' ')
    .map((segment) =>
      segment
        .replace(/([A-Z][a-z])/g, ' $1')
        .replace(/([A-Z]+)/g, ' $1')
        .trim()
    )
    .join(' ')
    .replace(/^./, (m) => m.toUpperCase())
    .trim();
};

export const snakeCaseToWords = (text: string): string => {
  if (!text || isNumeric(text)) return text;

  return text
    .replace(/[_.]/g, ' ')
    .replace(/([A-Z][a-z])/g, ' $1')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const removeHtmlTags = (text: string): string => {
  return text?.toString().replace(/<\/?[a-z][\s\S]*?>/gi, '');
};

export function areAllElementsEqual<T>(arr: (T | null)[]): boolean {
  if (!arr || arr.length === 0) {
    return true; // An empty array is considered to have all equal elements.
  }

  const firstElement = arr[0];

  return arr.every((element) => {
    // Use a case-insensitive comparison if the elements are strings
    if (typeof element === 'string' && typeof firstElement === 'string') {
      return element.toLowerCase() === firstElement.toLowerCase();
    }

    // Use regular equality for other types (including null)
    return element === firstElement;
  });
}

export function areAllElementsEqualTo<T>(arr: T[], value: T): boolean {
  if (!arr || arr.length === 0) {
    return false; // An empty array is considered to have all equal elements.
  }
  return arr.every((element) => element === value);
}

export function isAtLeastOneElementEqualTo<T>(arr: T[], targetValue: T): boolean {
  return arr.some((element) => element === targetValue);
}

export const containsHtmlCode = (inputString: string): boolean => {
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(inputString);
};

export const isUrl = (str: string): boolean => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return urlRegex.test(str);
};

export const isDate = (value: any): boolean => {
  return dayjs.isDayjs(value);
};

export const isNumeric = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isJson = (value: any): boolean => {
  if (typeof value === 'object') {
    const jsonObject = getJson(value);
    return jsonObject && Object.keys(jsonObject).length > 0;
  }

  return false;
};

export const concatenateArray = (arr: string[]): string => {
  const length = arr.length;

  if (length === 0) {
    return '';
  } else if (length === 1) {
    return arr[0];
  } else if (length === 2) {
    return `${arr[0]} and ${arr[1]}`;
  }
  const firstPart = arr.slice(0, length - 1).join(', ');
  const lastPart = arr[length - 1];
  return `${firstPart}, and ${lastPart}`;
};

export const formatElapsedTime = (elapsedTimeString: string) => {
  dayjs.extend(durationPlugin);
  // Split the time string into parts (HH:mm:ss)
  const [hours, minutes, seconds] = elapsedTimeString.split(':').map(Number);

  // Create a dayjs duration object
  const durationObj = dayjs.duration({
    hours: hours || 0,
    minutes: minutes || 0,
    seconds: seconds || 0,
  });

  // Extract individual components
  const formattedHours = durationObj.hours();
  const formattedMinutes = durationObj.minutes();
  const formattedSeconds = durationObj.seconds();
  const formattedMilliseconds = durationObj.milliseconds();

  // Create a user-friendly representation
  let formattedElapsedTime = '';
  if (formattedHours > 0) {
    formattedElapsedTime += `${formattedHours} h, `;
  }
  if (formattedMinutes > 0) {
    formattedElapsedTime += `${formattedMinutes} m, `;
  }
  if (formattedSeconds > 0) {
    formattedElapsedTime += `${formattedSeconds} s, `;
  }
  formattedElapsedTime += `${formattedMilliseconds} ms`;

  return formattedElapsedTime;
};

export const formatFileSize = (sizeInBytes: number) => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (sizeInBytes >= gigabyte) {
    return `${(sizeInBytes / gigabyte).toFixed(2)} GB`;
  } else if (sizeInBytes >= megabyte) {
    return `${(sizeInBytes / megabyte).toFixed(2)} MB`;
  } else if (sizeInBytes >= kilobyte) {
    return `${(sizeInBytes / kilobyte).toFixed(2)} KB`;
  }
  return `${sizeInBytes} Bytes`;
};

export const formatMasterCode = (input: string) => {
  if (!input) return '-';

  const value = input.indexOf('$') > -1 ? input.split('$')[1] : input;
  if (value.indexOf('|') > -1) return value.split('|')[0];
  return value;
};

export const getJson = (input: any) => {
  if (!input) return null;

  try {
    if (typeof input === 'object') return decodeNestedJson(input);
    const jsonObject = get(input, 'info') ? JSON.parse(input?.info) : JSON.parse(input);
    if (typeof jsonObject === 'object' && jsonObject !== null) {
      const decodedObject = decodeNestedJson(jsonObject);
      return decodedObject;
    }
    return null;
  } catch (error) {
    if (isDevelopment) console.log(error);
    return null;
  }
};

export const decodeNestedJson = (inputJson: any) => {
  // Clone the input JSON to avoid modifying the original object
  const decodedJson = { ...inputJson };

  // Iterate over the keys in the input JSON
  for (const key in decodedJson) {
    if (typeof decodedJson[key] === 'string') {
      try {
        // Attempt to parse the string value as JSON
        const parsedValue = JSON.parse(decodedJson[key]);

        // Check if the parsed value is an object
        if (typeof parsedValue === 'object') {
          // Recursively decode nested JSON objects
          decodedJson[key] = decodeNestedJson(parsedValue);
        } else {
          // Update the value with the parsed JSON value
          decodedJson[key] = parsedValue;
        }
        // eslint-disable-next-line
      } catch (error) {
        // Ignore parsing errors and keep the original value
      }
    } else if (typeof decodedJson[key] === 'object') {
      // Recursively decode nested JSON objects
      decodedJson[key] = decodeNestedJson(decodedJson[key]);
    }
  }
  return decodedJson;
};

export const bytesToKilobytes = (bytes: number) => {
  return `${(bytes / 1024).toFixed(2)} KB`;
};

export const removeDiacritics = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const lightenHexColor = (hex: string, factor: number): string => {
  if (!hex) return hex;
  // Ensure factor is between 0 and 1
  const clampFactor = Math.max(0, Math.min(1, factor));

  // Remove the hash symbol if present
  hex = hex.replace(/^#/, '');

  // If it's a shorthand hex (3 characters), convert to 6 characters
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Parse the R, G, and B values from the hex code
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Lighten each channel
  const newR = Math.round(r + (255 - r) * clampFactor);
  const newG = Math.round(g + (255 - g) * clampFactor);
  const newB = Math.round(b + (255 - b) * clampFactor);

  // Convert back to hex format and return
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
};

export const profileTitle = (auth: any) => {
  if (auth.profile.flags === MenuFlagEnum.Explorer) return 'SDW Viewer';
  if ((auth.profile.flags & MenuFlagEnum.All) === MenuFlagEnum.All) return 'SDW Administrator';
  if ((auth.profile.flags & MenuFlagEnum.Ingest) === MenuFlagEnum.Ingest) return 'SDW Ingest';
  if ((auth.profile.flags & MenuFlagEnum.Consolidation) === MenuFlagEnum.Ingest)
    return 'SDW Editor';
  if ((auth.profile.flags & MenuFlagEnum.Extractor) === MenuFlagEnum.Extractor)
    return 'SDW Extractor';
  if ((auth.profile.flags & MenuFlagEnum.ReportsSetup) === MenuFlagEnum.ReportsSetup)
    return 'SDW Reports Administrator';
  if ((auth.profile.flags & MenuFlagEnum.Reports) === MenuFlagEnum.Reports) return 'SDW Reports';
  if ((auth.profile.flags & MenuFlagEnum.Biography) === MenuFlagEnum.Reports)
    return 'SDW Editorial';
  return 'SDW Viewer';
};

export const geCountryRegionDisplay = (e: any): string | null => {
  if (!e.country && !e.region) return null;

  if (e.region) {
    return e.country ? `${e.region}, ${e.country.replace('CNTR$', '')}` : e.region;
  }

  return `${e.country?.replace('CNTR$', '') ?? 'UNK'}`;
};

export const formatCountry = (country: any): string => {
  return `${country?.replace('CNTR$', '') ?? 'UNK'}`;
};

export const formatStartFinishDate = (e: any) => {
  if (e.startDate && e.finishDate) {
    return `${dayjs(e.startDate).format(baseConfig.dayDateFormat).toUpperCase()} to ${dayjs(e.finishDate).format(baseConfig.dayDateFormat).toUpperCase()}`;
  }

  if (e.startDate) {
    return dayjs(e.startDate).format(baseConfig.dayDateFormat).toUpperCase();
  }

  return null;
};

export const formatSocialMediaLink = (e: any) => {
  if (!e) return '-';

  return e
    .replace('https://twitter.com/', '')
    .replace('https://www.twitter.com/', '')
    .replace('https://x.com/', '')
    .replace('https://www.x.com/', '')
    .replace('https://instagram.com/', '')
    .replace('https://www.instagram.com/', '')
    .replace('https://www.facebook.com/', '')
    .replace('https://facebook.com/', '')
    .replace('https://www.tiktok.com/', '')
    .replace('/', '')
    .replace('_', '')
    .toLowerCase();
};

export const parseTimeToSeconds = (timeStr: string): number | null => {
  const result = tryParseTimeToSeconds(timeStr);
  return isNaN(result) ? null : result;
};

export const tryParseTimeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':');
  // Handle HH:MM:SS.s, MM:SS.s, or MM:SS
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    return parseInt(hh) * 3600 + parseInt(mm) * 60 + parseFloat(ss);
  } else if (parts.length === 2) {
    const [mm, ss] = parts;
    return parseInt(mm) * 60 + parseFloat(ss);
  } else if (parts.length === 1) {
    return parseFloat(parts[0]);
  }
  return NaN;
};

export const formatSecondsToTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = (seconds % 60).toFixed(1).padStart(4, '0'); // "04.2"

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s}`;
  }
  return `${m}:${s}`;
};
export function formatAthleteName(data: any): string {
  const participationName = get(data, 'participationName') ?? get(data, 'name');
  const preferredGivenName = get(data, 'preferredGivenName') ?? get(data, 'givenName');
  const preferredFamilyName = get(data, 'preferredFamilyName') ?? get(data, 'familyName');
  return preferredFamilyName || preferredGivenName
    ? `${preferredFamilyName?.toUpperCase()} ${preferredGivenName}`
        .replaceAll('undefined', '')
        .trim()
    : participationName;
}
export const getMaxTextWidth = (
  field: string,
  header: string,
  rows: any[],
  charWidth: number = 10,
  minWidth: number = 70,
  extraWidth: number = 0
): number => {
  const maxLength = Math.max(
    ...rows.map((row) => get(row, field, '')?.toString().length ?? 0),
    header.length // include header length
  );
  return Math.max(minWidth, maxLength * charWidth) + extraWidth;
};

export function chunkWithMinSize(array: any[], maxChunkSize: number, minChunkSize = 3): any[][] {
  const result: any[][] = [];
  let i = 0;

  while (i < array.length) {
    const remaining = array.length - i;

    // If the remaining items are less than the min chunk size, append to previous chunk
    if (remaining < minChunkSize && result.length > 0) {
      result[result.length - 1].push(...array.slice(i));
      break;
    }

    // Adjust chunk size if needed to avoid tiny final chunk
    const nextChunkSize =
      remaining > maxChunkSize && remaining - maxChunkSize < minChunkSize
        ? Math.ceil(remaining / 2)
        : Math.min(maxChunkSize, remaining);

    result.push(array.slice(i, i + nextChunkSize));
    i += nextChunkSize;
  }

  return result;
}

/**
 * Returns a list of all dates with the same day and month as today,
 * starting from 1896 up to the current year.
 * @returns {string[]} List of dates in 'YYYY-MM-DD' format
 */
export function getSameDayAndMonthSinceYear(startYear: number = 1896) {
  const today = dayjs();
  const month = today.month(); // 0 = January
  const day = today.date(); // 1–31
  const currentYear = today.year();

  const result = [];

  for (let year = startYear; year <= currentYear; year++) {
    const date = dayjs().year(year).month(month).date(day);

    // Skip invalid dates (e.g. Feb 29 on a non-leap year)
    if (date.isValid() && date.date() === day) {
      result.push(date.format('YYYY-MM-DD'));
    }
  }

  return result;
}

/**
 * Calculates the age of an individual.
 * - If dateOfDeath is provided, calculates age at death.
 * - If not, calculates age as of today.
 *
 * @param {Object} athlete - The athlete object with dateOfBirth and optional dateOfDeath.
 * @returns {number | null} - The age, or null if dateOfBirth is missing/invalid.
 */
export function calculateAge(athlete: any) {
  const { dateOfBirth, dateOfDeath } = athlete;

  if (!dateOfBirth) return null;

  const dob = dayjs(dateOfBirth);
  const endDate = dateOfDeath ? dayjs(dateOfDeath) : dayjs(); // Use today if alive

  if (!dob.isValid() || !endDate.isValid()) return null;

  let age = endDate.year() - dob.year();

  // Adjust if end date is before birthday that year
  if (
    endDate.month() < dob.month() ||
    (endDate.month() === dob.month() && endDate.date() < dob.date())
  ) {
    age -= 1;
  }

  return age;
}

export const cleanTimeIfNeeded = (input: string): string => {
  // Simple regex to detect time format (e.g. 00:08:23.600, 08:23.600, 00:04:18, etc)
  const timePattern = /^(\d{2}:)+\d{1,2}(\.\d+)?$/;

  if (!timePattern.test(input)) {
    return input; // not a time, return original
  }

  // Remove leading "00:" groups
  let cleaned = input.replace(/^(00:)+/, '');

  // Remove leading zeros from first segment after removing leading 00:
  cleaned = cleaned.replace(/^0+(\d)/, '$1');

  return cleaned;
};

export function containsHtmlTags(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}
export const isObject = (val: any) => val && typeof val === 'object' && !Array.isArray(val);
export function stripHtmlTags(input: string): string {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '').trim();
}
export function removeCommonPrefix(strings: string[]): string[] {
  if (strings.length === 0) return [];

  const first = strings[0];
  let prefixLength = first.length;

  for (let i = 1; i < strings.length; i++) {
    let j = 0;
    while (j < prefixLength && j < strings[i].length && strings[i][j] === first[j]) {
      j++;
    }
    prefixLength = j;
  }

  return strings.map((str) => str.slice(prefixLength).trim());
}
export function stripCommonPrefixFromField(data: any[], field: string): any[] {
  if (data.length === 0) return [];

  const values = data.map((item) => item[field]);
  const first = values[0];
  let prefixLength = first.length;

  for (let i = 1; i < values.length; i++) {
    let j = 0;
    while (j < prefixLength && j < values[i].length && values[i][j] === first[j]) {
      j++;
    }
    prefixLength = j;
  }

  return data.map((item) => ({
    ...item,
    [field]: item[field].slice(prefixLength).trim(),
  }));
}
