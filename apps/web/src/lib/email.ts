/**
 * Email shape validation.
 *
 * This lives outside the server-action modules on purpose: Next.js treats
 * every export of a server-action file as an action endpoint, and an action
 * must be an async function. A plain synchronous helper exported from one of
 * those files fails the build.
 */

/**
 * A conservative email shape check.
 *
 * This is a UX guard against a typo, not a security control — the Auth
 * server owns the real validation. It accepts the address forms that
 * genuinely reach Indian businesses: dotted local parts, plus-addressing and
 * subdomains.
 */
export function isPlausibleEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(trimmed)) return false;
  return true;
}
