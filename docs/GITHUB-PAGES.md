# GitHub Pages 部署

## 展示内容

已确认 GitHub Pages 首页直接展示最新的 [Helmax 全屏交互概念稿](design/helmax-exhibition-prototype.html)：六个全屏章节、企业文化、统一产品展示和 Logo 加载页。

仓库 `jwuang/corporate-portal` 的默认地址为：

<https://jwuang.github.io/corporate-portal/>

页面保留概念稿说明、`noindex, nofollow` 和禁止抓取的 `robots.txt`。图片使用相对路径，可在 `/corporate-portal/` 下加载，无需修改 Astro 的路由前缀。三语 Astro 主站继续按原有流程开发，正式内容与隐私审核标志保持原状。

## 首次启用

1. 打开 [仓库 Pages 设置](https://github.com/jwuang/corporate-portal/settings/pages)。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 将配置推送到 `main`；如已推送，打开 [Actions](https://github.com/jwuang/corporate-portal/actions/workflows/pages.yml)，选择 **Run workflow → main → Run workflow**。
4. 等待 `build` 和 `deploy` 均成功，再打开工作流中 `github-pages` 环境提供的地址。

工作流使用 GitHub 自动提供的 `GITHUB_TOKEN` 和官方 Pages Actions，不需要另存个人 Token。首次切换 Pages 发布来源需要仓库管理员操作；默认的工作流 Token 无法自动启用 Pages。

## 更新与本地验证

推送概念稿、所用图片、打包／检查脚本或相关依赖等文件的变更到 `main`，会触发 [.github/workflows/pages.yml](../.github/workflows/pages.yml)。其他修改可按需要手动触发发布。拉取请求仅执行原有检查，合入 `main` 后才会发布。

本地使用项目指定的 Node 24.19.0（24.x）和 pnpm 11.25.0：

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm lint
pnpm test
pnpm build:pages
pnpm exec playwright install --with-deps chromium
pnpm test:pages
```

`build:pages` 每次清理并重建 `dist-pages/`，只包含：

- `index.html`：最新概念稿的原样副本。
- `assets/helmax-logo.png`、`assets/welding-machine.png`、`assets/water-pump.png`：页面需要的展示图片。
- `robots.txt`：禁止搜索引擎抓取。

新增展示图片时，更新 `scripts/build-pages.ts` 的图片清单，并运行单元与浏览器检查。单元检查验证根域名和仓库子路径下的图片、锚点及部署文件范围；浏览器检查直接打开打包产物，覆盖六种尺寸、加载、菜单、无 JavaScript 和无障碍，结果输出到已忽略的 `reports/design-prototype/`。

## 回退与后续正式发布

要恢复旧版，撤销导致问题的概念稿或图片提交，将回退提交推送到 `main`，让 Pages 工作流重新构建发布。若上次失败原因是临时网络或 Pages 尚未启用，修复后可以手动重新运行工作流。

正式三语官网仍须完成真实企业内容、译文和隐私审核，并通过 `pnpm build`。未来将 Pages 改为发布 Astro 主站时，需一并适配 `/corporate-portal/` 的导航、资源、canonical、hreflang、sitemap 和 404；本次发布入口不做该切换。

参考：[GitHub 自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[configure-pages 的启用权限说明](https://github.com/actions/configure-pages#inputs)。
