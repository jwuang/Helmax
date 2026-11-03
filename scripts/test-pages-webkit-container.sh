#!/usr/bin/env bash
set -euo pipefail

# Run from an isolated copy: the container cannot change the host checkout.
# Keep the image version aligned with @playwright/test in package.json.
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
docker run --rm --init --ipc=host \
  --mount "type=bind,source=$project_root,target=/source,readonly" \
  --workdir /work \
  mcr.microsoft.com/playwright:v1.64.1-noble \
  /bin/bash -lc '
    set -euo pipefail
    tar -C /source \
      --exclude=.git --exclude=node_modules --exclude=.astro \
      --exclude=dist --exclude=dist-pages --exclude=reports \
      --exclude=playwright-report --exclude=test-results --exclude=artifacts \
      --exclude=.env --exclude=".env.*" \
      -cf - . | tar -C /work -xf -
    npm install --global pnpm@11.25.0
    pnpm install --frozen-lockfile
    pnpm build:pages
    pnpm test:pages --browser=webkit
  '
