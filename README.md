# Helmax 企业官网

简体中文、香港繁体中文、英文的响应式企业官网。当前官网通过 GitHub Pages 发布静态页面，无数据库、登录或后台，支持 PC、手机、平板及无需 JavaScript 的核心浏览与语言切换。

**用户已确认当前全屏展览式版本就是正式网站。** 首页源文件沿用 `docs/design/helmax-exhibition-prototype.html` 的历史路径，由 `scripts/build-pages.ts` 生成三语页面。仓库另保留早期 Astro／TypeScript／Tailwind CSS／Markdown 样稿，位于 `src/`，与当前官网分别构建。

## 跨设备继续维护 Helmax 官网

先读 [项目进度与接续说明](docs/PROJECT-STATUS.md)，再按需要查看 [项目聊天记录](docs/CHAT-LOG.md)。这两个文件记录已确认的需求、当前设计、验证情况和下一步。

- [官网首页源文件与本地预览](docs/design/helmax-exhibition-prototype.html)：克隆仓库后用浏览器打开 HTML 文件；旁边的 `assets/` 目录需保留，语言预览需要 JavaScript。
- [首屏预览](docs/design/previews/helmax-hero-desktop.png) · [企业文化](docs/design/previews/helmax-culture-desktop.png) · [加载页](docs/design/previews/helmax-loading-desktop.png)。
- [首页设计说明](docs/HOMEPAGE-WIREFRAME.md) · [现有官网评估与企业资料梳理](docs/HOMEPAGE-REVIEW.md)。

后续维护保留 Helmax 统一品牌、统一“产品”展示、全屏章节、前置企业文化，以及“利他、专业、效率、创新”四个关键词。

## 正式网站与 GitHub Pages 发布

GitHub Pages 发布上述 **Helmax 官网**，已补齐简体、香港繁体和英文，标题与页脚使用正式官网表述；搜索收录策略沿用既有 `noindex`。部署地址为 <https://jwuang.github.io/corporate-portal/>，根路径默认简体；独立语言地址为 [简体](https://jwuang.github.io/corporate-portal/zh-cn/)、[繁體](https://jwuang.github.io/corporate-portal/zh-hk/)、[English](https://jwuang.github.io/corporate-portal/en/)。

首次启用：打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。推送相关文件到 `main` 后，`Deploy Helmax website to GitHub Pages` 工作流自动验证并发布；也可在 **Actions** 中手动运行。

`pnpm build:pages` 从共享模板和翻译字典生成三语静态页面，并将三张展示图片打包到 `dist-pages/`；关闭 JavaScript 也可阅读和切换语言。`pnpm test:pages` 检查打包后的三语页面。操作与回退说明见 [GitHub Pages 部署指南](docs/GITHUB-PAGES.md)。

## Astro 样稿开发

要求 Node 24.19.0+（24.x）、pnpm 11.25.0。推荐 `npm install -g pnpm@11.25.0`，然后：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

访问 `http://localhost:4321/zh-cn/`、`/zh-hk/`、`/en/`。根路径为语言入口，生产 Caddy 将其永久跳转至简体首页。开发服务监听所有接口以便云端转发；转发端口保持私有。

GitHub **Code → Codespaces → Create codespace on main** 可按 `.devcontainer/devcontainer.json` 创建对应云端开发环境。环境安装依赖后执行 `pnpm dev`；4321 端口默认私有。GitHub Codespaces 的使用额度、机器及费用由账号设置决定。现有工作环境中代码位于 `/workspace/corporate-portal`。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm check` | Astro / TypeScript 与内容关联校验 |
| `pnpm lint` | ESLint |
| `pnpm test` | 草稿隔离、内容一致性、链接安全测试 |
| `pnpm build:preview` | 预览静态产物，明确标识样稿且 noindex |
| `pnpm build:pages` | 构建 GitHub Pages 使用的正式 Helmax 三语官网 |
| `pnpm test:pages` | 检查三语官网各六种尺寸、语言切换、交互、加载和无障碍 |
| `pnpm preview` | 检查构建产物 |
| `pnpm test:e2e` | Chromium / Firefox / WebKit 浏览器测试 |
| `pnpm audit:security` | 高危及严重依赖漏洞门禁 |
| `pnpm build` | 正式构建，要求真实 HTTPS 域名及审核配置 |
| `pnpm prepare:art` | 从源 SVG 重新生成本站插画和分享图片 |

首次浏览器测试先运行 `pnpm exec playwright install --with-deps chromium firefox webkit`。仅使用系统 Chromium 时：`CHROMIUM_PATH=/usr/bin/chromium pnpm test:e2e --project=chromium`。

## 官网内容与 Astro 样稿构建

当前官网内容维护在 [首页源文件](docs/design/helmax-exhibition-prototype.html) 的 `home-translations` 三语字典中，样式与交互共用一份模板，运行 `pnpm build:pages` 后发布。以下配置用于独立的 Astro 样稿：

- 品牌名称、联系方式、企业全称：`src/config/site.ts`。
- 首页、关于、隐私及 UI 三语文案：`src/lib/i18n.ts`。
- 服务、案例、新闻：`src/content/`；每篇 Markdown 必须有稳定的 `translationKey`，不同语言可有不同 `routeSlug`。
- 内容规范见 [docs/CONTENT.md](docs/CONTENT.md)，结构与扩展说明见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

```sh
cp .env.example .env
# 填写真实 SITE_URL；完成并审核企业信息、三语正文和隐私说明。
# 在 site.ts 设置 publicationReviewed / privacyReviewed 为 true。
pnpm build
```

所有正式服务内容应设 `draft: false`、`previewOnly: false`；预览样例自动从正式构建中剔除。没有发布内容的栏目从导航隐藏；其列表页保留为 noindex 空状态，供缺少译文时回退。

Astro 构建生成 `dist/`、sitemap、robots.txt、build-info.json，并检查所有 HTML 内部链接与资源。`Website checks` CI 验证并保留旧样稿预览产物；Pages 工作流发布 `dist-pages/` 中的正式 Helmax 官网。

## 手动运维与验证

完整操作在 [OPS-TODO.md](OPS-TODO.md)，参考配置在 [ops/Caddyfile.example](ops/Caddyfile.example)。HTTPS、域名、DDoS 防护、CDN、备份、服务器权限和生产发布由维护者人工执行。

安全响应头检查：`pnpm test:headers https://your-domain.com/`。

经供应商允许后，在自己拥有的测试源站执行：

```sh
LOAD_TEST_APPROVED=yes pnpm test:load https://your-origin/zh-cn/
```

脚本默认阶梯 20/50/100 并发，每阶 200 请求，超时 10 秒；输出错误数、P50/P95 和传输字节数。只测试指定 URL，不等同于真实浏览器完整加载，不据此承诺网站并发容量。详见 [docs/VALIDATION.md](docs/VALIDATION.md)。
