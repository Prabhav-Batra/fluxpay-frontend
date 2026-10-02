const RUPEE_PATTERN = /^\d+(\.\d{1,2})?$/;

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

/** Formats integer paise as Indian rupees, e.g. 12345678 → "₹1,23,456.78". */
export function formatPaise(paise: number): string {
  return inr.format(paise / 100);
}

/**
 * Parses a rupee amount typed by a user into integer paise without float maths.
 * Accepts digits, optional thousands commas and up to two decimals; returns null otherwise.
 */
export function rupeesToPaise(input: string): number | null {
  const text = input.trim().replaceAll(',', '');
  if (!RUPEE_PATTERN.test(text)) return null;
  const [whole, fraction = ''] = text.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

/** Renders paise as a plain rupee string for form inputs, e.g. 49950 → "499.50". */
export function paiseToRupeesInput(paise: number): string {
  const whole = Math.trunc(paise / 100);
  const fraction = String(Math.abs(paise % 100)).padStart(2, '0');
  return `${whole}.${fraction}`;
}
