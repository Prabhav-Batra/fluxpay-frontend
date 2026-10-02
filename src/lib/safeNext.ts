/**
 * Returns `next` only when it is a same-origin absolute path ("/x"), guarding the
 * post-login redirect against open redirects ("//evil.com", "https://…", "/\\evil").
 */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith('/')) return null;
  if (next.startsWith('//') || next.startsWith('/\\')) return null;
  return next;
}
