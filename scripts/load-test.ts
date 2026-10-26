import { performance } from 'node:perf_hooks';
// Explicit opt-in. Only run against an origin you own and are allowed to test.
const target = process.argv[2];
if (process.env.LOAD_TEST_APPROVED !== 'yes' || !target) throw new Error('Usage: LOAD_TEST_APPROVED=yes pnpm test:load https://your-origin/');
const parsed = new URL(target);
if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('HTTP(S) required');
const levels = (process.env.LOAD_LEVELS || '20,50,100').split(',').map(Number);
const count = Number(process.env.LOAD_REQUESTS || 200);
if (!Number.isInteger(count) || count < 1 || count > 10000 || levels.some((x) => !Number.isInteger(x) || x < 1 || x > 200)) throw new Error('Invalid request count/concurrency');
for (const concurrency of levels) {
  const times: number[] = []; let errors = 0; let bytes = 0; let remaining = count;
  const started = performance.now();
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (remaining-- > 0) {
      const at = performance.now();
      try { const response = await fetch(target, { signal: AbortSignal.timeout(10000), redirect: 'error' }); bytes += (await response.arrayBuffer()).byteLength; if (!response.ok) errors++; }
      catch { errors++; }
      times.push(performance.now() - at);
    }
  }));
  times.sort((a, b) => a - b);
  console.log(JSON.stringify({ concurrency, requests: count, errors, seconds: (performance.now() - started) / 1000, p50ms: times[Math.floor(times.length * .5)], p95ms: times[Math.min(times.length - 1, Math.floor(times.length * .95))], bytes }));
  if (errors) process.exitCode = 1;
}
