/** Reject script/data URLs, protocol-relative URLs and control characters. */
export function safeHref(value: string): string {
  // eslint-disable-next-line no-control-regex -- deliberately reject control characters in URLs
  if (/[\u0000-\u0020\u007f\\]/u.test(value)) throw new Error(`Unsafe link: ${value}`);
  if (/^\/(?!\/)/u.test(value) || value.startsWith('#')) return value;
  const url = new URL(value);
  if (!['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)) throw new Error(`Unsupported link protocol: ${url.protocol}`);
  if (url.username || url.password) throw new Error('Credentials are not allowed in links');
  return value;
}
