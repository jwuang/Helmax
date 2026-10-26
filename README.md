# Corporate Portal 企业门户

简体中文、香港繁体中文、英文的响应式企业官网。Astro 静态输出、TypeScript、Tailwind CSS、Markdown 内容集合；无数据库、登录或后台。支持 PC、手机、平板及无需 JavaScript 的核心浏览。

**当前是品牌待确认的可运行样稿。** 服务为明确标注的演示内容；案例、新闻模板为草稿，不在导航或 sitemap 中出现。未设置任何虚构电话、邮箱、客户、资质或业绩。正式构建要求实际域名及内容审核完成。

## 开始开发

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
| `pnpm preview` | 检查构建产物 |
| `pnpm test:e2e` | Chromium / Firefox / WebKit 浏览器测试 |
| `pnpm audit:security` | 高危及严重依赖漏洞门禁 |
| `pnpm build` | 正式构建，要求真实 HTTPS 域名及审核配置 |
| `pnpm prepare:art` | 从源 SVG 重新生成本站插画和分享图片 |

首次浏览器测试先运行 `pnpm exec playwright install --with-deps chromium firefox webkit`。仅使用系统 Chromium 时：`CHROMIUM_PATH=/usr/bin/chromium pnpm test:e2e --project=chromium`。

## 内容与正式构建

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

构建生成 `dist/`、sitemap、robots.txt、build-info.json，并检查所有 HTML 内部链接与资源。CI 只验证并保留预览产物，**不会自动发布**。生产只需上传 `dist/`，不需在服务器安装 Node。

## 手动运维与验证

完整操作在 [OPS-TODO.md](OPS-TODO.md)，参考配置在 [ops/Caddyfile.example](ops/Caddyfile.example)。HTTPS、域名、DDoS 防护、CDN、备份、服务器权限和生产发布由维护者人工执行。

安全响应头检查：`pnpm test:headers https://your-domain.com/`。

经供应商允许后，在自己拥有的测试源站执行：

```sh
LOAD_TEST_APPROVED=yes pnpm test:load https://your-origin/zh-cn/
```

脚本默认阶梯 20/50/100 并发，每阶 200 请求，超时 10 秒；输出错误数、P50/P95 和传输字节数。只测试指定 URL，不等同于真实浏览器完整加载，不据此承诺网站并发容量。详见 [docs/VALIDATION.md](docs/VALIDATION.md)。
