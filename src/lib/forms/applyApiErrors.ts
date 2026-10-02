import { ApiError } from '@/lib/api/errors';

type SetError = (name: never, error: { message: string }) => void;

/**
 * Copies a server error onto a react-hook-form form. Details whose `field` is one of
 * `fields` become field errors; everything else becomes the form's root error.
 * Returns true when the error came from the API.
 */
export function applyApiErrors(
  error: unknown,
  setError: SetError,
  fields: readonly string[],
): boolean {
  const set = setError as (name: string, error: { message: string }) => void;
  if (!(error instanceof ApiError)) {
    set('root', { message: 'Something went wrong. Please try again.' });
    return false;
  }
  if (error.details.length === 0) {
    set('root', { message: error.message });
    return true;
  }
  error.details.forEach((detail) => {
    const target = detail.field && fields.includes(detail.field) ? detail.field : 'root';
    set(target, { message: detail.message });
  });
  return true;
}
