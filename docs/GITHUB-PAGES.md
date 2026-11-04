# GitHub Pages 部署

## 正式网站

用户已确认当前版本为正式网站。GitHub Pages 发布 [Helmax 全屏展览式官网](design/helmax-exhibition-prototype.html)：六个全屏章节、企业文化、统一产品展示和 Logo 加载页。首页内容、导航、加载提示、图片说明与辅助阅读标签均提供简体、香港繁体和英文。

仓库 `jwuang/corporate-portal` 的默认地址为：

<https://jwuang.github.io/corporate-portal/>

根路径默认展示简体。三语独立地址为 [简体](https://jwuang.github.io/corporate-portal/zh-cn/)、[繁體](https://jwuang.github.io/corporate-portal/zh-hk/)、[English](https://jwuang.github.io/corporate-portal/en/)。右上角语言菜单在桌面和手机上均可使用；启用 JavaScript 时切换会保留 URL 中的章节锚点。语言写入 URL，刷新、分享和浏览器返回均可恢复对应版本。

发布页面在构建时生成完整译文，关闭 JavaScript 仍可阅读和切换三语。本地直接打开首页 HTML 源文件时，语言菜单通过 `?lang=zh-cn`、`?lang=zh-hk`、`?lang=en` 预览译文，需要启用 JavaScript；未识别的语言回退至简体。

页面标题与页脚已采用正式官网表述。搜索收录策略沿用既有的 `noindex, nofollow` 和禁止抓取的 `robots.txt`。图片与语言链接使用相对路径，可在 `/corporate-portal/` 下加载。仓库仅保留这版展览官网，发布产物统一为 `dist-pages/`。

## 首次启用

1. 打开 [仓库 Pages 设置](https://github.com/jwuang/corporate-portal/settings/pages)。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 将配置推送到 `main`；如已推送，打开 [Actions](https://github.com/jwuang/corporate-portal/actions/workflows/pages.yml)，选择 **Run workflow → main → Run workflow**。
4. 等待 `build` 和 `deploy` 均成功，再打开工作流中 `github-pages` 环境提供的地址。

工作流使用 GitHub 自动提供的 `GITHUB_TOKEN` 和官方 Pages Actions，不需要另存个人 Token。首次切换 Pages 发布来源需要仓库管理员操作；默认的工作流 Token 无法自动启用 Pages。

## 更新与本地验证

推送首页源文件、所用图片、打包／检查脚本或相关依赖等文件的变更到 `main`，会触发 [.github/workflows/pages.yml](../.github/workflows/pages.yml)。其他修改可按需要手动触发发布。拉取请求检查官网构建、单元测试及三种浏览器，合入 `main` 后才会发布。

本地使用项目指定的 Node 26.13.0（26.x LTS）和 pnpm 12.16.1：

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm lint
pnpm test
pnpm build:pages
pnpm exec playwright install --with-deps chromium
pnpm test:pages
```

`pnpm build` 与 `pnpm build:pages` 执行同一构建，每次清理并重建 `dist-pages/`，只包含：

- `index.html`：简体默认首页。
- `zh-cn/index.html`、`zh-hk/index.html`、`en/index.html`：从同一官网模板与内嵌翻译字典生成的三语页面。
- `assets/helmax-logo.png`、`assets/welding-machine.png`、`assets/water-pump.png`：页面需要的展示图片。
- `robots.txt`：禁止搜索引擎抓取。

文案维护在首页 HTML 的 `home-translations` 字典中；修改时同步三个语言版本。增加文案绑定而缺少译文时构建会失败。新增展示图片时，更新 `scripts/build-pages.ts` 的图片清单，并运行单元与浏览器检查。

单元检查验证译文完整性、根域名和仓库子路径下的图片、锚点、语言链接及部署文件范围。浏览器检查通过临时本地 HTTP 服务加载 `/corporate-portal/` 下的打包产物，覆盖三语各六种尺寸、语言切换、刷新、返回、加载、菜单、无 JavaScript 和无障碍；结果及三语桌面／手机截图输出到已忽略的 `reports/design-prototype/`。

## 回退与后续维护

要恢复旧版，撤销导致问题的页面或图片提交，将回退提交推送到 `main`，让 Pages 工作流重新构建发布。若上次失败原因是临时网络或 Pages 尚未启用，修复后可以手动重新运行工作流。

后续继续在这版官网维护三语内容与展示资料。语言定义位于 `scripts/lib/locales.ts`；增加语言、图片或章节时同步模板、构建和测试，并验证 `/corporate-portal/` 子路径下的资源与导航。

参考：[GitHub 自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[configure-pages 的启用权限说明](https://github.com/actions/configure-pages#inputs)。
