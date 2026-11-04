# 架构与扩展

官网使用一个 HTML 模板构建完整的简体中文、香港繁体中文和英文静态页面。共享样式与交互直接维护在模板中；构建时替换译文、页面语言、图片路径和语言链接，发布后不依赖客户端翻译脚本。静态托管只提供文件，没有数据库、后台或登录。

| 文件／目录 | 职责 |
| --- | --- |
| `docs/design/helmax-exhibition-prototype.html` | 正式官网模板、样式、交互和 `home-translations` 字典；保留历史文件名 |
| `docs/design/assets/` | 官网展示素材 |
| `scripts/build-pages.ts` | 校验译文并构建默认首页、三语页面、展示图片和 robots.txt |
| `scripts/lib/locales.ts` | 语言列表、类型和 HTML 语言码 |
| `scripts/serve-pages.ts` | 本地静态服务、项目子路径预览和开发监听 |
| `scripts/check-design-prototype.mjs` | 官网视口、交互、加载与无障碍检查 |
| `tests/unit/` | 页面构建、预览路由与路径限制测试 |
| `dist-pages/` | 唯一网站发布产物；构建时重建 |
| `.github/workflows/` | 官网检查与旧 GitHub Pages 地址跳转 |
| `cloudflare.config.ts` | Cloudflare Worker 名称、兼容日期与静态路由配置 |
| `wrangler.config.ts` | cf 构建工具生成的静态资源目录配置 |

`pnpm dev` 构建并监听 HTML 和素材变更，在 4321 端口提供预览；修改后刷新浏览器。`pnpm build` 与 `pnpm build:pages` 执行同一构建。`pnpm preview` 服务已有的 `dist-pages/`。

根路径展示简体，独立语言路径为 `/zh-cn/`、`/zh-hk/` 和 `/en/`。相对资源与语言链接同时支持根域名和 GitHub Pages 仓库子路径。启用 JavaScript 时切换语言会保留章节锚点；关闭 JavaScript 也可读取完整译文和切换语言。

构建仅发布列出的文件，不复制 PPT、项目记录、检查报告或其他文档。页面继续使用 `noindex, nofollow` 和禁止抓取的 robots.txt；收录策略需要单独确认。浏览器脚本和发布素材中不得包含秘密。

添加语言时同步语言模块、模板字典、语言菜单和测试；新增展示素材时更新构建复制清单。若未来增加 CMS、询盘或登录功能，应另行设计数据来源、部署方式、权限与隐私处理，不影响现有静态浏览能力。
