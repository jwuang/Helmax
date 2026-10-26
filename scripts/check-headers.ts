export {};
const target = process.argv[2];
if (!target) throw new Error('Usage: pnpm test:headers https://your-domain.com/');
const response = await fetch(target, { signal: AbortSignal.timeout(15000) });
const requirements: Record<string, RegExp> = {
  'content-security-policy': /default-src 'self'/,
  'x-content-type-options': /^nosniff$/,
  'referrer-policy': /strict-origin-when-cross-origin/,
  'permissions-policy': /camera=\(\)/,
};
const failures = Object.entries(requirements).filter(([header, pattern]) => !pattern.test(response.headers.get(header) || ''));
for (const header of Object.keys(requirements)) console.log(`${header}: ${response.headers.get(header) || 'MISSING'}`);
if (!response.ok || failures.length) process.exitCode = 1;
