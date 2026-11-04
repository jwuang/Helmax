# Helmax 企业官网

简体中文、香港繁体中文、英文的段落式展览官网，通过 GitHub Pages 发布。每个板块形成一段整屏体验，适配电脑、手机和平板；无需数据库、登录或后台，核心浏览与语言切换无需 JavaScript。

仓库仅维护这版官网。首页源文件沿用历史路径 `docs/design/helmax-exhibition-prototype.html`，`scripts/build-pages.ts` 从共享模板和 `home-translations` 字典生成三语页面到 `dist-pages/`。

## 继续维护

先读 [项目进度与接续说明](docs/PROJECT-STATUS.md)，再按需查看 [聊天记录](docs/CHAT-LOG.md)、[首页设计说明](docs/HOMEPAGE-WIREFRAME.md) 和 [企业资料梳理](docs/HOMEPAGE-REVIEW.md)。保留 Helmax 品牌、统一“产品”展示、全屏章节、前置企业文化，以及“利他、专业、效率、创新”四个关键词。

- [首页源文件](docs/design/helmax-exhibition-prototype.html)：可直接在浏览器打开，保留旁边的 `assets/`；这种预览的语言切换需要 JavaScript。
- [首屏](docs/design/previews/helmax-hero-desktop.png) · [文化](docs/design/previews/helmax-culture-desktop.png) · [加载页](docs/design/previews/helmax-loading-desktop.png)。
- [内容维护](docs/CONTENT.md) · [架构](docs/ARCHITECTURE.md) · [验证与验收](docs/VALIDATION.md)。

## 本地开发

使用 Node 26.13.0（26.x LTS）和 pnpm 12.16.1，可通过 `npm install -g pnpm@12.16.1` 安装指定包管理器。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

访问 `http://localhost:4321/`，根路径展示简体；独立语言地址为 `/zh-cn/`、`/zh-hk/`、`/en/`。开发命令先构建官网，再监听 HTML 和素材变更并重新构建；修改后刷新浏览器。GitHub Codespaces 可按 `.devcontainer/devcontainer.json` 创建对应环境，4321 转发端口默认私有。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 构建、监听官网源文件并启动本地服务 |
| `pnpm check` | TypeScript 检查（`tsc --noEmit`） |
| `pnpm lint` | ESLint |
| `pnpm test` | 页面构建单元测试 |
| `pnpm build` / `pnpm build:pages` | 构建同一套三语官网到 `dist-pages/` |
| `pnpm preview` | 本地服务已构建的 `dist-pages/` |
| `pnpm test:pages` / `pnpm test:e2e` | 官网浏览器检查，默认 Chromium |
| `pnpm verify` | 类型检查、lint、单元测试、构建及 Chromium 官网检查 |
| `pnpm audit:security` | 高危及严重依赖漏洞门禁 |

首次浏览器测试运行 `pnpm exec playwright install --with-deps chromium firefox webkit`。先构建，再用 `pnpm test:pages --browser=firefox` 或 `--browser=webkit` 选择浏览器；`test:e2e` 接受相同参数。CI 验证官网的三种浏览器。

## 发布与内容

官网地址为 <https://jwuang.github.io/corporate-portal/>；独立语言地址为 [简体](https://jwuang.github.io/corporate-portal/zh-cn/)、[繁體](https://jwuang.github.io/corporate-portal/zh-hk/)、[English](https://jwuang.github.io/corporate-portal/en/)。页面保留 `noindex, nofollow` 和禁止抓取设置，收录策略另行确认。

文案维护在 HTML 的 `home-translations` 字典中，样式与交互共用同一模板。图片位于 `docs/design/assets/`，构建仅复制明确列出的展示素材。修改三语文案、图片或交互后运行 `pnpm verify`。

GitHub Pages 使用 **Settings → Pages → Build and deployment → Source → GitHub Actions**。相关变更推送到 `main` 后，Pages 工作流验证并发布 `dist-pages/`；PR 执行检查。部署和回退见 [Pages 指南](docs/GITHUB-PAGES.md)，资料审核、域名和运维待办见 [OPS-TODO.md](OPS-TODO.md)。
