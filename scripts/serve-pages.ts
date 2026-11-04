import { createReadStream, existsSync, realpathSync, statSync, watch, type FSWatcher } from 'node:fs';
import { createServer } from 'node:http';
import { extname, relative, resolve, sep } from 'node:path';
import { clearTimeout, setTimeout } from 'node:timers';
import { fileURLToPath } from 'node:url';
import { buildPages } from './build-pages';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const pagesRoot = resolve(projectRoot, 'dist-pages');
const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
};

type PageRequest =
  | { status: 200; file: string; contentType: string }
  | { status: 301; location: string }
  | { status: 400 | 403 | 404 };

function isWithin(root: string, file: string) {
  const path = relative(root, file);
  return path === '' || (path !== '..' && !path.startsWith(`..${sep}`) && !path.startsWith(sep));
}

/** Resolve the raw HTTP request target before any URL normalization can hide traversal. */
export function resolvePageRequest(target: string, root = pagesRoot): PageRequest {
  const queryIndex = target.indexOf('?');
  const rawPath = queryIndex < 0 ? target : target.slice(0, queryIndex);
  const query = queryIndex < 0 ? '' : target.slice(queryIndex);
  let path: string;
  try {
    path = decodeURIComponent(rawPath);
  } catch {
    return { status: 400 };
  }
  const hasControlCharacter = [...path].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\') || hasControlCharacter) return { status: 400 };
  if (path.split('/').some((part) => part.startsWith('.'))) return { status: 403 };
  if (path === '/corporate-portal' || path.startsWith('/corporate-portal/')) {
    path = path.slice('/corporate-portal'.length) || '/';
  }
  try {
    const rootPath = realpathSync(root);
    let file = realpathSync(resolve(rootPath, `.${path}`));
    if (!isWithin(rootPath, file)) return { status: 403 };
    if (statSync(file).isDirectory()) {
      if (!rawPath.endsWith('/')) return { status: 301, location: `${rawPath}/${query}` };
      file = realpathSync(resolve(file, 'index.html'));
    }
    if (!isWithin(rootPath, file)) return { status: 403 };
    if (!statSync(file).isFile()) return { status: 404 };
    return { status: 200, file, contentType: mimeTypes[extname(file)] ?? 'application/octet-stream' };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT' || code === 'ENOTDIR') return { status: 404 };
    if (code === 'EACCES' || code === 'EPERM') return { status: 403 };
    throw error;
  }
}

export function createPagesServer(root = pagesRoot, getBuildError: () => string | undefined = () => undefined) {
  return createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Method not allowed');
      return;
    }
    if (getBuildError()) {
      response.writeHead(503);
      response.end('Website build failed. See the terminal for details and fix the source to rebuild.');
      return;
    }
    try {
      const result = resolvePageRequest(request.url ?? '/', root);
      if (result.status === 301) {
        response.writeHead(301, { Location: result.location });
        response.end();
      } else if (result.status !== 200) {
        response.writeHead(result.status);
        response.end(result.status === 404 ? 'Not found' : 'Invalid path');
      } else {
        response.writeHead(200, { 'Content-Type': result.contentType });
        if (request.method === 'HEAD') {
          response.end();
          return;
        }
        const stream = createReadStream(result.file);
        stream.on('error', (error) => {
          console.error('Unable to read website file:', error);
          response.destroy(error);
        });
        response.on('close', () => stream.destroy());
        stream.pipe(response);
      }
    } catch (error) {
      console.error('Unable to serve website:', error);
      response.writeHead(500);
      response.end('Unable to serve website. See the terminal for details.');
    }
  });
}

export function parseServerOptions(args: string[]) {
  const options = { host: '127.0.0.1', port: 4321, watch: false };
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === '--watch') options.watch = true;
    else if (argument === '--host') {
      const host = args[++index];
      if (!host || host.startsWith('--')) throw new Error('--host requires a hostname or IP address.');
      options.host = host;
    } else if (argument === '--port') {
      const value = args[++index];
      const port = Number(value);
      if (!value || !/^\d+$/u.test(value) || !Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('--port must be an integer from 1 to 65535.');
      }
      options.port = port;
    } else throw new Error(`Unknown option: ${argument}`);
  }
  return options;
}

async function main() {
  const options = parseServerOptions(process.argv.slice(2));
  if (options.watch) buildPages();
  if (!existsSync(resolve(pagesRoot, 'index.html'))) {
    throw new Error('Website output is missing. Run pnpm build before pnpm preview.');
  }
  let buildError: string | undefined;
  let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
  const watchers: FSWatcher[] = [];
  const server = createPagesServer(pagesRoot, () => buildError);
  const rebuild = () => {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(() => {
      try {
        buildPages();
        buildError = undefined;
        console.log('Website rebuilt. Refresh the browser to see your changes.');
      } catch (error) {
        buildError = String(error);
        console.error('Website build failed:', error);
      }
    }, 100);
  };
  if (options.watch) {
    const designRoot = resolve(projectRoot, 'docs/design');
    watchers.push(watch(designRoot, (_, name) => {
      if (!name || name === 'helmax-exhibition-prototype.html' || name === 'assets') rebuild();
    }));
    watchers.push(watch(resolve(designRoot, 'assets'), { recursive: true }, rebuild));
    for (const watcher of watchers) watcher.on('error', (error) => {
      buildError = String(error);
      console.error('Website watcher failed. Restart the development server:', error);
    });
  }
  let stopping = false;
  const close = () => {
    if (stopping) return;
    stopping = true;
    clearTimeout(rebuildTimer);
    for (const watcher of watchers) watcher.close();
    server.close();
    const shutdownTimer = setTimeout(() => server.closeAllConnections(), 5000);
    shutdownTimer.unref();
    server.once('close', () => clearTimeout(shutdownTimer));
  };
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
  server.on('error', (error) => {
    console.error('Website server failed:', error);
    process.exitCode = 1;
    close();
  });
  server.listen(options.port, options.host, () => {
    const host = options.host.includes(':') ? `[${options.host}]` : options.host;
    console.log(`Helmax website: http://${host}:${options.port}/`);
    console.log(`GitHub Pages preview: http://${host}:${options.port}/corporate-portal/`);
    if (options.watch) console.log('Watching the homepage and assets. Refresh after changes.');
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
