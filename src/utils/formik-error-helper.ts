import { getIn, FormikErrors, FormikTouched } from 'formik';
import { ReactNode } from 'react';

export interface FieldState {
  error: boolean;
  helperText?: ReactNode;
}

/**
 * Derive MUI error/helperText from Formik state.
 *
 * @param field   name of the field (can be dotted, e.g. "user.email")
 * @param touched Formik touched object
 * @param errors  Formik errors object
 * @param hint    fallback hint to show when there's no error
 */
export function getFieldState(
  field: string,
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  hint?: ReactNode
): FieldState {
  const isTouched = Boolean(getIn(touched, field));
  const rawError = getIn(errors, field);
  const hasError = isTouched && Boolean(rawError);

  return {
    error: hasError,
    helperText: hasError && typeof rawError === 'string' ? rawError : hint,
  };
}
