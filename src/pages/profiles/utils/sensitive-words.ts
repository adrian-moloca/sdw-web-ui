import { SensitiveTerms } from 'constants/profiles';
import * as Yup from 'yup';
import { humanize } from '../../../_helpers';

// Helper function to check if a field contains sensitive terms and return the matched terms
export const findSensitiveWords = (value: string): string[] => {
  if (!value) return [];

  // Return the list of sensitive terms found in the value
  return SensitiveTerms.filter((term) => value.toLowerCase().includes(term.toLowerCase()));
};

export const sensitiveWordsValidator = () =>
  Yup.string().test('checkSensitiveTerms', function (value) {
    if (!value) return true;

    const foundTerms = findSensitiveWords(value || '');
    const { path, createError } = this;

    if (foundTerms.length > 0) {
      return createError({
        path,
        message: `${humanize(path)} contains sensitive terms: ${foundTerms.join(', ')}`,
      });
    }

    return true;
  });
