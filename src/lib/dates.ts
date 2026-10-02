const dateTime = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const dateOnly = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' });

type DateInput = string | Date | null | undefined;

function toDate(value: string | Date): Date {
  // Plain ISO days ("2026-10-02") are calendar dates, not UTC instants.
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y!, m! - 1, d!);
  }
  return new Date(value);
}

/** Formats an instant as a local date and time, or "—" when absent. */
export function formatDateTime(value: DateInput): string {
  return value ? dateTime.format(toDate(value)) : '—';
}

/** Formats an instant or ISO day as a local date, or "—" when absent. */
export function formatDate(value: DateInput): string {
  return value ? dateOnly.format(toDate(value)) : '—';
}

/** Returns the local calendar day as `YYYY-MM-DD`. */
export function isoDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns a new date `days` calendar days after `date` (negative goes back). */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
