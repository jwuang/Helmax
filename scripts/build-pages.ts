import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const designRoot = resolve(projectRoot, 'docs/design');

/** Publish only the concept page and its display assets, never the rest of docs/. */
export function buildPages(outDir = resolve(projectRoot, 'dist-pages')) {
  const html = readFileSync(resolve(designRoot, 'helmax-exhibition-prototype.html'), 'utf8');
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(resolve(outDir, 'assets'), { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html);
  for (const asset of ['helmax-logo.png', 'welding-machine.png', 'water-pump.png']) {
    cpSync(resolve(designRoot, 'assets', asset), resolve(outDir, 'assets', asset));
  }
  writeFileSync(resolve(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  return outDir;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Helmax concept preview (noindex) ready in ${buildPages()}.`);
}
