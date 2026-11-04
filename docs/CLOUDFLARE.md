# Cloudflare 部署与回退

官网部署到 Cloudflare Workers Static Assets，Worker 名称 `helmax`。

- 默认首页：<https://helmax.1143402012.workers.dev/>
- 简体：<https://helmax.1143402012.workers.dev/zh-cn/>
- 繁體：<https://helmax.1143402012.workers.dev/zh-hk/>
- English：<https://helmax.1143402012.workers.dev/en/>

使用 Cloudflare 默认域名；企业正式域名尚未绑定。保留原有 `noindex, nofollow` 与禁止抓取的 `robots.txt`。

## 构建和自动发布

使用 Node 26.13.0、pnpm 12.16.1。Cloudflare Workers Builds 连接 `jwuang/Helmax` 的 `main` 分支，根目录 `/`。

```sh
pnpm install --frozen-lockfile
pnpm check && pnpm lint && pnpm test
pnpm build:cloudflare
pnpm exec cf deploy --prebuilt --dry-run
```

Cloudflare 构建命令为 `pnpm check && pnpm lint && pnpm test && pnpm build && pnpm exec cf build`，部署命令为 `pnpm exec cf deploy --prebuilt`。构建环境设置 `NODE_VERSION=26.13.0`、`PNPM_VERSION=12.16.1`、`CF_SEND_TELEMETRY=false`。构建 Token 由 Cloudflare 管理，不写入仓库；自动发布不需要另配 GitHub Secrets。

`cloudflare.config.ts` 配置 Worker 名称、兼容日期、静态路由与可观测性。`wrangler.config.ts` 是 `cf init` 生成的底层构建配置，明确只打包 `dist-pages/`。使用 `cf` 作为部署入口；其构建委托给所锁定的 Wrangler 版本。不要把整个仓库或 `docs/` 作为静态目录发布。

`pnpm build` 仍生成原有三语官网；`pnpm build:cloudflare` 再生成 `.cloudflare/output/v0/`。本地已认证时可运行 `pnpm deploy`，此命令总是先重新构建官网。`pnpm-workspace.yaml` 仅允许 esbuild 和 workerd 的安装脚本。

根路径和三个语言目录直接提供静态 HTML；不存在的 URL 返回 404，不启用 SPA 回退。GitHub Actions 保留 Chromium、Firefox、WebKit 检查，并验证 Cloudflare 部署产物。

## 旧 GitHub Pages 地址

合入迁移配置后，Pages 工作流只发布轻量跳转页，不再发布官网副本。根路径及三个语言目录跳转至对应的新地址，JavaScript 跳转保留查询参数和章节锚点；关闭 JavaScript 时提供 HTML 自动跳转和可点击链接。

Pages 工作流先检查 Cloudflare 四个页面可访问，再替换旧发布产物。旧仓库名称 `corporate-portal` 的 Pages URL 是否继续可用由 GitHub 仓库重命名规则决定；当前仓库入口是 `https://jwuang.github.io/Helmax/`，不能在 Cloudflare 内控制 `github.io` 域名。

## 验证与回退

部署后检查四个页面、三张图片、robots.txt、语言切换、锚点、未知路径 404，并确认源码和 PPT 不可访问。

网站内容回退：撤销问题提交并推送 `main`，等待 Workers Builds 重新发布。紧急情况可在 Cloudflare 的 Helmax 部署记录中回退到已验证版本。此次迁移最初的占位 Worker 返回 503，不可选为恢复版本。

域名绑定另行执行；无需迁移域名注册商。域名接入前先保存原 DNS 记录，再在 Worker 的 Domains & Routes 中添加企业域名并验证 HTTPS。
