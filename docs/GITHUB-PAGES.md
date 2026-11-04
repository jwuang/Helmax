# GitHub Pages 旧地址

官网已改用 Cloudflare Workers Static Assets；当前部署说明见 [Cloudflare 部署指南](CLOUDFLARE.md)。

合入迁移配置后，`.github/workflows/pages.yml` 仅发布 `scripts/build-legacy-redirects.ts` 生成的跳转入口。原首页及 `/zh-cn/`、`/zh-hk/`、`/en/` 转到 Cloudflare 对应地址；有 JavaScript 时保留查询参数与章节锚点，无 JavaScript 时仍有自动跳转和链接。

GitHub Pages 保持 Source = GitHub Actions，以便旧链接继续跳转。无需关闭 Pages；官网内容只部署到 Cloudflare。手动更新跳转页时，在 Actions 运行 Redirect legacy GitHub Pages URLs to Cloudflare。

历史名称 `corporate-portal` 已改为 `Helmax`。GitHub 是否继续提供历史名称的 Pages 路径不受 Cloudflare 控制，以实际访问结果为准。
