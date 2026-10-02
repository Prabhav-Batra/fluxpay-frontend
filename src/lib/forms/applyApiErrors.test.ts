import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';

import { applyApiErrors } from './applyApiErrors';

describe('applyApiErrors', () => {
  it('should_set_field_errors_when_details_match_fields', () => {
    const setError = vi.fn();
    const error = new ApiError(422, 'VALIDATION_FAILED', 'Invalid', [
      { field: 'image_url', code: 'Pattern', message: 'must be an https URL' },
      { field: 'unknown', code: 'X', message: 'odd' },
    ]);
    const handled = applyApiErrors(error, setError, ['name', 'image_url']);
    expect(handled).toBe(true);
    expect(setError).toHaveBeenCalledWith('image_url', { message: 'must be an https URL' });
    expect(setError).toHaveBeenCalledWith('root', { message: 'odd' });
  });

  it('should_set_root_error_when_no_details', () => {
    const setError = vi.fn();
    applyApiErrors(new ApiError(409, 'CONFLICT', 'Already exists'), setError, ['name']);
    expect(setError).toHaveBeenCalledWith('root', { message: 'Already exists' });
  });

  it('should_set_root_generic_message_when_not_api_error', () => {
    const setError = vi.fn();
    applyApiErrors(new Error('x'), setError, []);
    expect(setError).toHaveBeenCalledWith('root', {
      message: 'Something went wrong. Please try again.',
    });
  });
});
