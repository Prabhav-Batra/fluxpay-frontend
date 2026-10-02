import type { Mode } from './types';

/**
 * Builds a dashboard query key `[feature, mode, ...params]`. Mode is always second so
 * switching test/live never serves another mode's cache, and invalidating
 * `[feature]` clears both modes.
 */
export function modeKey(feature: string, mode: Mode, ...params: unknown[]): unknown[] {
  return [feature, mode, ...params];
}
